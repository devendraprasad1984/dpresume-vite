"""Quick smoke test: python test_client.py [url]   (default http://localhost:8000/mcp)"""
import asyncio, sys
from fastmcp import Client

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000/mcp"

async def main():
    async with Client(URL) as c:
        tools = await c.list_tools()
        print("TOOLS:", [t.name for t in tools])
        r = await c.call_tool("competitor_brief", {"company": "AMD", "category": "GPUs"})
        print("BRIEF KEYS:", list(r.data.keys()))
        r = await c.call_tool("list_competitors", {"name": "NVIDIA"})
        print("COMPETITORS:", r.data["answer"])
        r = await c.call_tool("server_status", {})
        print("STATUS:", r.data["tool_calls"])

asyncio.run(main())
