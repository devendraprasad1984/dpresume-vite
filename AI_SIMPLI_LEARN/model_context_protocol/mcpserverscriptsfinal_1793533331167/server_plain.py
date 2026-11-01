"""
MarketIntel MCP Server - PLAIN version (no logging, no middleware).

Just the essentials: a server, a few tools, and run().
 - With TAVILY_API_KEY set  -> live web search through Tavily
 - Without it               -> small built-in sample data (demo mode)

Run locally (for Cursor / Claude Desktop):   uv run server_plain.py
Run over HTTP (for a tunnel / Claude web):   TRANSPORT=http uv run server_plain.py
"""
import os
from typing import Any, Dict, List, Optional

from fastmcp import FastMCP

# ---------------------------------------------------------------- setup
API_KEY = os.getenv("TAVILY_API_KEY", "").strip()
LIVE = bool(API_KEY)

if LIVE:
    from tavily import TavilyClient
    tavily = TavilyClient(api_key=API_KEY)

mcp = FastMCP(name="MarketIntel")

# ---------------------------------------------------------------- sample data (demo mode)
SAMPLE = {
    "nvidia": "NVIDIA designs GPUs and AI chips; data-center products drive most of its revenue.",
    "amd": "AMD sells Ryzen/EPYC CPUs, Radeon GPUs and Instinct AI accelerators.",
    "intel": "Intel makes x86 CPUs and AI accelerators and runs a chip foundry business.",
}


def search(query: str, company: str, **options) -> Dict[str, Any]:
    """One helper every tool uses: live Tavily search, or sample data if no key."""
    if not LIVE:
        text = next((v for k, v in SAMPLE.items() if k in company.lower()),
                    "Demo mode: no sample data for this company. Set TAVILY_API_KEY for live results.")
        return {"mode": "demo", "query": query, "answer": text, "results": []}

    resp = tavily.search(query=query, include_answer=True, **options)
    return {
        "mode": "live",
        "query": query,
        "answer": resp.get("answer"),
        "results": [
            {"title": r.get("title"), "url": r.get("url"), "snippet": (r.get("content") or "")[:500]}
            for r in resp.get("results", [])
        ],
    }


# ---------------------------------------------------------------- tools (plain functions)
# Optional inputs use  str = ""  (not Optional[str] = None) because Google Gemini rejects
# the "anyOf ... null" schema that Optional produces.
def company_overview(name: str, region: str = "") -> Dict[str, Any]:
    """Company background: founding, HQ, products, business model."""
    where = f" in {region}" if region else ""
    return search(f"Company overview of {name}{where}", name, max_results=5)


def list_competitors(name: str, category: str = "") -> Dict[str, Any]:
    """Top competitors of a company, optionally within a product category."""
    cat = f" in {category}" if category else ""
    return search(f"Top competitors of {name}{cat}", name, max_results=6)


def pricing_snapshot(product_or_company: str) -> Dict[str, Any]:
    """Pricing information: list prices, tiers, discounts."""
    return search(f"Pricing for {product_or_company}: list price, tiers, discounts",
                  product_or_company, max_results=6)


def recent_news(company: str, days: int = 30) -> Dict[str, Any]:
    """Latest news about a company from the last N days."""
    return search(f"Recent news about {company}", company, topic="news", days=days, max_results=6)


def competitor_brief(company: str) -> Dict[str, Any]:
    """One call that bundles overview, competitors, pricing and news."""
    return {
        "overview": company_overview(company),
        "competitors": list_competitors(company),
        "pricing": pricing_snapshot(company),
        "news": recent_news(company),
    }


# ---------------------------------------------------------------- register the tools with MCP
for tool_fn in (company_overview, list_competitors, pricing_snapshot, recent_news, competitor_brief):
    mcp.tool(annotations={"readOnlyHint": True})(tool_fn)


# ---------------------------------------------------------------- run
if __name__ == "__main__":
    if os.getenv("TRANSPORT", "stdio") == "http":
        mcp.run(transport="http", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), path="/mcp")
    else:
        mcp.run()  # stdio: the client (Cursor, Claude Desktop) starts this script itself
