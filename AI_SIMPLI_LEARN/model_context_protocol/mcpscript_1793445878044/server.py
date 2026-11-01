"""
MarketIntel MCP Server  (remote / streamable-HTTP)  -  built for a live ChatGPT demo

 - Exposes market-research tools over HTTP at  http://localhost:8000/mcp
 - Uses Tavily for live web data. If no TAVILY_API_KEY is set it falls back to
   built-in DEMO data, so the demo never breaks.
 - Prints a log line for EVERY hit: who called (IP / client / user-agent),
   which MCP method, which tool, with what arguments, how long it took.
"""
import os
import re
import sys
import time
import json
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastmcp import FastMCP
from fastmcp.server.middleware import Middleware, MiddlewareContext
from fastmcp.server.dependencies import get_http_request
from starlette.middleware import Middleware as ASGIMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

# --------------------------------------------------------------------------
# Config  (reads .env next to this file, no extra package needed)
# --------------------------------------------------------------------------
def _load_dotenv(path: str = ".env") -> None:
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), path)
    if not os.path.exists(p):
        return
    for line in open(p, encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

_load_dotenv()
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "").strip()
TAVILY_DEPTH = os.getenv("TAVILY_DEPTH", "basic")          # basic = 1 credit, advanced = 2
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
LIVE = bool(TAVILY_API_KEY) and os.getenv("FORCE_DEMO_MODE", "0") != "1"

tavily = None
if LIVE:
    from tavily import TavilyClient
    tavily = TavilyClient(api_key=TAVILY_API_KEY)

# --------------------------------------------------------------------------
# Logging helpers - plain print() so it shows up in the terminal during demo
# --------------------------------------------------------------------------
STATS: Dict[str, Any] = {"started": datetime.now().isoformat(timespec="seconds"),
                         "http_requests": 0, "tool_calls": {}, "clients": {}}

def log(tag: str, msg: str) -> None:
    ts = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    print(f"[{ts}] [{tag:<6}] {msg}", flush=True)

def _short(obj: Any, n: int = 300) -> str:
    s = json.dumps(obj, default=str, ensure_ascii=False)
    return s if len(s) <= n else s[:n] + f"... (+{len(s) - n} chars)"

def _caller_from_headers(h) -> str:
    ip = (h.get("x-forwarded-for") or h.get("cf-connecting-ip") or "direct").split(",")[0].strip()
    ua = h.get("user-agent", "unknown-ua")
    host = h.get("host", "?")
    return f"ip={ip} host={host} ua='{ua}'"


# --------------------------------------------------------------------------
# 1) HTTP-level logging: every raw request that reaches the server
#    (this is where you SEE ChatGPT / ngrok / curl hitting you)
# --------------------------------------------------------------------------
class HttpAccessLog:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        headers = {k.decode().lower(): v.decode() for k, v in scope["headers"]}
        STATS["http_requests"] += 1
        sid = headers.get("mcp-session-id", "-")
        t0 = time.perf_counter()
        status = {"code": "?"}

        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                status["code"] = message["status"]
            await send(message)

        log("HTTP", f"--> {scope['method']} {scope['path']} session={sid[:8]} "
                    f"{_caller_from_headers(headers)}")
        try:
            await self.app(scope, receive, send_wrapper)
        finally:
            ms = (time.perf_counter() - t0) * 1000
            log("HTTP", f"<-- {status['code']} {scope['method']} {scope['path']} ({ms:.0f} ms)")


# --------------------------------------------------------------------------
# 2) MCP-level logging: which MCP method / tool, args, result, timing
# --------------------------------------------------------------------------
class McpLog(Middleware):
    def _who(self) -> str:
        try:
            return _caller_from_headers(get_http_request().headers)
        except Exception:
            return "caller=unknown"

    @staticmethod
    def _client_name(msg) -> str:
        """Pull clientInfo out of the initialize message (shape differs by version)."""
        try:
            params = getattr(msg, "params", None) if msg is not None else None
            ci = getattr(params, "client_info", None) or getattr(params, "clientInfo", None)
            if ci is None and isinstance(params, dict):
                ci = params.get("clientInfo")
            if ci is not None:
                name = ci.get("name") if isinstance(ci, dict) else ci.name
                ver = ci.get("version") if isinstance(ci, dict) else ci.version
                return f"{name} v{ver}"
        except Exception:
            pass
        return "unknown-client"

    async def on_initialize(self, context: MiddlewareContext, call_next):
        client = self._client_name(context.message)
        STATS["clients"][client] = STATS["clients"].get(client, 0) + 1
        log("INIT", f"New MCP session: client='{client}' {self._who()}")
        return await call_next(context)

    async def on_discover(self, context: MiddlewareContext, call_next):
        log("INIT", f"Client discovery request {self._who()}")
        return await call_next(context)

    async def on_list_tools(self, context: MiddlewareContext, call_next):
        result = await call_next(context)
        names = [t.name for t in result]
        log("LIST", f"Client asked for tools -> returned {len(names)}: {names}")
        return result

    async def on_call_tool(self, context: MiddlewareContext, call_next):
        name = context.message.name
        args = context.message.arguments or {}
        STATS["tool_calls"][name] = STATS["tool_calls"].get(name, 0) + 1
        log("CALL", f">>> TOOL '{name}' args={_short(args)}")
        log("CALL", f"    caller: {self._who()}")
        t0 = time.perf_counter()
        try:
            result = await call_next(context)
            ms = (time.perf_counter() - t0) * 1000
            size = sum(len(getattr(c, "text", "") or "") for c in result.content)
            log("DONE", f"<<< TOOL '{name}' OK in {ms:.0f} ms, response ~{size} chars")
            return result
        except Exception as e:
            ms = (time.perf_counter() - t0) * 1000
            log("ERROR", f"<<< TOOL '{name}' FAILED in {ms:.0f} ms: {type(e).__name__}: {e}")
            raise


mcp = FastMCP(name="MarketIntel",
              instructions="Market research tools: company overviews, competitors, "
                           "product portfolios, pricing and recent news. Cite source URLs.")
mcp.add_middleware(McpLog())


@mcp.custom_route("/health", methods=["GET"])
async def health(request: Request):
    log("HEALTH", f"health check from {_caller_from_headers(request.headers)}")
    return JSONResponse({"status": "ok", "mode": "live" if LIVE else "demo", **STATS})


# --------------------------------------------------------------------------
# Data layer: Tavily (live) or canned demo data (fallback)
# --------------------------------------------------------------------------
DEMO_DB: Dict[str, Dict[str, Any]] = {
    "nvidia": {
        "answer": "NVIDIA (founded 1993, HQ Santa Clara, CA) designs GPUs and AI accelerators; its data-center "
                  "segment (H100/H200/Blackwell, CUDA software stack) now drives most revenue.",
        "competitors": ["AMD", "Intel", "Google (TPU)", "Amazon (Trainium)", "Cerebras", "Groq"],
        "pricing": "Data-center GPUs are quoted per system: roughly $25k-$40k per H100-class card; "
                   "GeForce RTX cards range from about $300 to $2,000+.",
        "news": ["Demo item: new data-center GPU generation ramping with hyperscalers",
                 "Demo item: export-control rules continue to shape China sales"],
    },
    "amd": {
        "answer": "AMD (founded 1969, HQ Santa Clara, CA) sells Ryzen/EPYC CPUs, Radeon GPUs and Instinct "
                  "accelerators (MI300 series) and competes with NVIDIA and Intel.",
        "competitors": ["NVIDIA", "Intel", "Qualcomm", "Apple (silicon)", "Arm-based server CPUs"],
        "pricing": "Instinct MI300-class accelerators are typically priced below comparable NVIDIA parts "
                   "(reported ~$10k-$20k); Ryzen CPUs ~$150-$700; Radeon GPUs ~$250-$1,000.",
        "news": ["Demo item: Instinct accelerator roadmap update",
                 "Demo item: EPYC server CPU share gains vs Intel"],
    },
    "intel": {
        "answer": "Intel (founded 1968, HQ Santa Clara, CA) makes x86 CPUs, Gaudi AI accelerators and runs a "
                  "foundry business while restructuring.",
        "competitors": ["AMD", "NVIDIA", "Qualcomm", "Apple", "TSMC (foundry)"],
        "pricing": "Core CPUs ~$100-$600 (consumer), Xeon server CPUs ~$1k-$10k+, Gaudi accelerators priced "
                   "below NVIDIA equivalents.",
        "news": ["Demo item: foundry strategy and cost-cutting update"],
    },
}

def _demo_lookup(text: str) -> Dict[str, Any]:
    key = next((k for k in DEMO_DB if k in text.lower()), None)
    return DEMO_DB.get(key, {
        "answer": f"DEMO MODE: no canned data for '{text}'. Set TAVILY_API_KEY for live results.",
        "competitors": [], "pricing": "n/a", "news": []})

def _search(query: str, kind: str, demo_key: str, **kw) -> Dict[str, Any]:
    """Run a search. kind in {answer, competitors, pricing, news} picks the demo payload."""
    if not LIVE:
        log("DEMO", f"serving canned data for query='{query}'")
        d = _demo_lookup(demo_key)
        payload = d[kind]
        return {"mode": "demo", "query_used": query,
                "answer": payload if isinstance(payload, str) else None,
                "results": [{"title": x, "url": "demo://data", "content": x} for x in payload]
                           if isinstance(payload, list) else []}
    log("TAVILY", f"search query='{query}' depth={TAVILY_DEPTH} extra={kw}")
    t0 = time.perf_counter()
    resp = tavily.search(query=query, search_depth=TAVILY_DEPTH, include_answer=True, **kw)
    log("TAVILY", f"got {len(resp.get('results', []))} results in "
                  f"{(time.perf_counter() - t0) * 1000:.0f} ms")
    return {
        "mode": "live", "query_used": query, "answer": resp.get("answer"),
        "results": [{"title": r.get("title"), "url": r.get("url"),
                     "snippet": (r.get("content") or "")[:500],
                     "published": r.get("published_date")}
                    for r in resp.get("results", [])],
    }


# --------------------------------------------------------------------------
# Tools
# --------------------------------------------------------------------------
def _tool(title: str):
    """Register fn as an MCP tool but hand back the plain function, so tools can
    call each other (works across FastMCP versions)."""
    def deco(fn):
        mcp.tool(annotations={"title": title, "readOnlyHint": True})(fn)
        return fn
    return deco


@_tool("Company Overview")
def company_overview(name: str, region: Optional[str] = None, max_results: int = 5) -> Dict[str, Any]:
    """Company background: founding, HQ, products, business model, recent news."""
    reg = f" in {region}" if region else ""
    q = f"Company overview of {name}{reg}: founding, HQ, products, business model, recent news"
    return _search(q, "answer", name, max_results=max_results)


@_tool("List Competitors")
def list_competitors(name: str, category: Optional[str] = None, region: Optional[str] = None,
                     max_results: int = 6) -> Dict[str, Any]:
    """Top competitors of a company, optionally within a category and region."""
    cat = f" in {category}" if category else ""
    reg = f" in {region}" if region else ""
    q = f"Top competitors of {name}{cat}{reg}; include upstart challengers"
    r = _search(q, "competitors", name, max_results=max_results)
    if r["mode"] == "demo":
        r["answer"] = "Competitors: " + ", ".join(_demo_lookup(name)["competitors"])
    return r


@_tool("Product Portfolio Map")
def product_portfolio(company: str, focus_keywords: Optional[List[str]] = None,
                      max_results: int = 6) -> Dict[str, Any]:
    """Map a company's product lines, tiers and segments. Optional focus keywords."""
    kws = f" ({', '.join(focus_keywords)})" if focus_keywords else ""
    q = f"{company} product portfolio{kws}: product list, suites, tiers, segments"
    return _search(q, "answer", company, max_results=max_results)


@_tool("Pricing Snapshot")
def pricing_snapshot(product_or_company: str, region: Optional[str] = None,
                     currency_hint: Optional[str] = None, max_results: int = 6) -> Dict[str, Any]:
    """Pricing info: list prices, tiers, discounts, hidden fees."""
    reg = f" in {region}" if region else ""
    cur = f" in {currency_hint}" if currency_hint else ""
    q = f"Pricing for {product_or_company}{reg}{cur}: list price, tiers, billing cycles, discounts"
    return _search(q, "pricing", product_or_company, max_results=max_results)


@_tool("Recent News Pulse")
def recent_news_pulse(company: str, days: int = 30, max_results: int = 6) -> Dict[str, Any]:
    """Latest news (funding, acquisitions, launches, leadership) from the last N days."""
    q = f"Recent news about {company}: funding, acquisitions, launches, leadership"
    return _search(q, "news", company, topic="news", days=days, max_results=max_results)


@_tool("Competitor Brief (all-in-one)")
def competitor_brief(company: str, region: Optional[str] = None,
                     category: Optional[str] = None) -> Dict[str, Any]:
    """One-shot research bundle: overview + competitors + pricing + news for a company.
    Use the returned sections to write a brief with SWOT and Porter's Five Forces."""
    log("BRIEF", f"building bundled brief for '{company}'")
    return {
        "company": company,
        "overview": company_overview(company, region, 4),
        "competitors": list_competitors(company, category, region, 5),
        "pricing": pricing_snapshot(company, region, None, 4),
        "news": recent_news_pulse(company, 30, 5),
        "suggested_structure": ["Company Overview", "Competitors", "Portfolio & Pricing",
                                "News Pulse", "SWOT", "Five Forces", "Sources"],
    }


@_tool("Server Status")
def server_status() -> Dict[str, Any]:
    """Health/debug: mode (live/demo), uptime start, request counters, clients seen."""
    return {"mode": "live" if LIVE else "demo", **STATS}


# --------------------------------------------------------------------------
def main():
    print("=" * 70)
    print(" MarketIntel MCP Server")
    print(f" Mode      : {'LIVE (Tavily)' if LIVE else 'DEMO (canned data, no TAVILY_API_KEY)'}")
    print(f" Listening : http://{HOST}:{PORT}/mcp     health: http://localhost:{PORT}/health")
    print(" Next      : expose with  ngrok http %d  and paste https://<id>.ngrok-free.app/mcp" % PORT)
    print("=" * 70, flush=True)
    mcp.run(transport="http", host=HOST, port=PORT, path="/mcp",
            middleware=[ASGIMiddleware(HttpAccessLog)],
            uvicorn_config={"access_log": False})


if __name__ == "__main__":
    main()
