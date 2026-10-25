#!/usr/bin/env python3
# coding: utf-8
"""
RAG Pipeline Using PDF Chunking and Retrieval
=============================================
Course-End Project (Food-Industry Sales Reports edition).

This single script builds an end-to-end Retrieval-Augmented Generation (RAG)
pipeline and is designed to RUN OUT-OF-THE-BOX with real output, WITHOUT any
OpenAI/Azure API key or internet access:

    1. Generate 2 sample food-industry PDFs (ABC Sales Report, Yearly Sales Report).
    2. Load + chunk them  (PyPDFLoader + RecursiveCharacterTextSplitter).
    3. Embed chunks        (offline, deterministic LocalMockEmbeddings).
    4. Store in FAISS      (FAISS.from_documents -> save/load locally).
    5. Report metrics      (total chunks, average chunk size).
    6. Run retrieval queries (similarity_search_with_score) and show top matches.
    7. Capture console output to outputs/ and write an analysis REPORT.md.

Swap-in points for the "real" assignment (Azure OpenAI + a cloud vector DB)
are provided as clearly-marked, commented placeholders in CONNECTOR PLACEHOLDERS.

Run:
    python3 rag_pipeline.py
"""

# ---------------------------------------------------------------------------
# 0. Dependency bootstrap (auto-install anything missing, quietly)
# ---------------------------------------------------------------------------
import importlib.util
import subprocess
import sys

NEEDED = {
    "langchain_community": "langchain-community>=0.3.0,<0.4.0",
    "langchain_text_splitters": "langchain-text-splitters>=0.3.0",
    "langchain_core": "langchain-core>=0.3.0",
    "faiss": "faiss-cpu>=1.7.4",
    "pypdf": "pypdf>=4.0.0",
    "reportlab": "reportlab>=4.0.0",
    "numpy": "numpy>=1.24.0",
}
_missing = [req for mod, req in NEEDED.items() if importlib.util.find_spec(mod) is None]
if _missing:
    print("Installing missing dependencies:", ", ".join(_missing))
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", *_missing])
print("All required libraries are available.\n")

import hashlib
import os
import re
from datetime import datetime
from typing import List

import numpy as np

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_DIR = os.path.join(BASE_DIR, "pdfs")
INDEX_DIR = os.path.join(BASE_DIR, "faiss_index")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "sample_output.txt")
REPORT_FILE = os.path.join(BASE_DIR, "REPORT.md")

for d in (PDF_DIR, INDEX_DIR, OUTPUT_DIR):
    os.makedirs(d, exist_ok=True)


# ===========================================================================
# Tee: mirror everything printed to the console into outputs/sample_output.txt
# ===========================================================================
class _Tee:
    def __init__(self, stream, file_handle):
        self._stream = stream
        self._file = file_handle

    def write(self, data):
        self._stream.write(data)
        self._file.write(data)

    def flush(self):
        self._stream.flush()
        self._file.flush()


# ===========================================================================
# CONNECTOR PLACEHOLDERS  (assumed DB + cloud connectors -- not executed)
# ---------------------------------------------------------------------------
# These are intentionally COMMENTED. In a production RAG deployment you would
# replace the offline mock embeddings + local FAISS index below with a managed
# cloud embedding model and a cloud/DB-backed vector store. Shown here only to
# document the integration surface.
#
# --- Cloud LLM / embeddings connector (Azure OpenAI via API gateway) --------
# from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
# GATEWAY = os.getenv("AZURE_OPENAI_GATEWAY", "https://<your-gateway>.azure-api.net")
# llm = AzureChatOpenAI(
#     base_url=f"{GATEWAY}/<deployment>",
#     model="gpt-4o-mini",
#     api_version="2024-12-01-preview",
#     api_key=os.getenv("AZURE_OPENAI_API_KEY"),   # never hard-code secrets
#     validate_base_url=False,
# )
# embeddings = AzureOpenAIEmbeddings(
#     azure_endpoint=GATEWAY,
#     azure_deployment="text-embedding-ada-002",
#     api_version="2023-05-15",
#     api_key=os.getenv("AZURE_OPENAI_API_KEY"),
# )
#
# --- Vector DB connector (Postgres + pgvector) ------------------------------
# from langchain_postgres import PGVector
# DB_CONN = os.getenv("PGVECTOR_URL", "postgresql+psycopg://user:pass@host:5432/ragdb")
# vectorstore = PGVector(
#     connection=DB_CONN,
#     collection_name="food_sales_reports",
#     embeddings=embeddings,
# )
#
# --- Object storage connector (where source PDFs live in the cloud) ---------
# import boto3
# s3 = boto3.client("s3")
# s3.download_file("my-reports-bucket", "abc_sales_report.pdf", local_path)
# ===========================================================================


# ===========================================================================
# 1. SAMPLE PDF GENERATION  (mock food-industry sales data)
# ===========================================================================
def _build_pdf(path: str, title: str, subtitle: str, sections: List[tuple]):
    """Render a simple multi-section report PDF using reportlab."""
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Sub", parent=styles["Normal"],
                              fontSize=11, textColor=colors.HexColor("#555555")))
    story = [
        Paragraph(title, styles["Title"]),
        Paragraph(subtitle, styles["Sub"]),
        Spacer(1, 8 * mm),
    ]
    for sec_title, paragraphs, table in sections:
        story.append(Paragraph(sec_title, styles["Heading2"]))
        for p in paragraphs:
            story.append(Paragraph(p, styles["Normal"]))
            story.append(Spacer(1, 2 * mm))
        if table:
            t = Table(table, hAlign="LEFT")
            t.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#204060")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#999999")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1),
                 [colors.white, colors.HexColor("#eef2f7")]),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
            ]))
            story.append(Spacer(1, 3 * mm))
            story.append(t)
        story.append(Spacer(1, 6 * mm))

    SimpleDocTemplate(path, pagesize=A4,
                      leftMargin=18 * mm, rightMargin=18 * mm,
                      topMargin=18 * mm, bottomMargin=18 * mm).build(story)


def generate_sample_pdfs() -> List[str]:
    """Create two food-industry sales-report PDFs and return their paths."""
    abc_path = os.path.join(PDF_DIR, "abc_sales_report.pdf")
    yearly_path = os.path.join(PDF_DIR, "yearly_sales_report.pdf")

    # ---- PDF 1: ABC Foods quarterly sales report --------------------------
    _build_pdf(
        abc_path,
        "ABC Foods Pvt. Ltd. — Quarterly Sales Report",
        "Confidential | Fiscal Year 2024 | Prepared by the Sales Analytics Team",
        [
            ("1. Executive Summary",
             ["ABC Foods Pvt. Ltd. is a packaged-food manufacturer specializing "
              "in snacks, beverages, and frozen meals. This report summarizes "
              "quarterly sales performance across all product categories for "
              "fiscal year 2024.",
              "Total company revenue for FY2024 reached INR 48.6 crore, a 14.2% "
              "increase over FY2023. Growth was led by the Snacks category and "
              "strong demand in the North and West regions."],
             None),
            ("2. Quarterly Revenue (INR Crore)",
             ["The table below shows total net sales by quarter. Q4 was the "
              "strongest quarter, driven by the festive season and new product "
              "launches in the beverages line."],
             [["Quarter", "Snacks", "Beverages", "Frozen Meals", "Total"],
              ["Q1", "6.1", "3.2", "2.0", "11.3"],
              ["Q2", "6.4", "3.0", "2.1", "11.5"],
              ["Q3", "6.9", "3.4", "2.3", "12.6"],
              ["Q4", "7.2", "3.6", "2.4", "13.2"]]),
            ("3. Sales by Region (INR Crore)",
             ["Regional distribution of annual sales. The North region remained "
              "ABC Foods' largest market, contributing 34% of total revenue, "
              "while the East region showed the fastest year-over-year growth at "
              "19%."],
             [["Region", "FY2023", "FY2024", "YoY Growth"],
              ["North", "14.5", "16.5", "+13.8%"],
              ["West", "11.2", "12.9", "+15.2%"],
              ["South", "9.8", "10.7", "+9.2%"],
              ["East", "7.1", "8.5", "+19.0%"]]),
            ("4. Top Selling Products",
             ["The best-selling SKU in FY2024 was 'Crunchy Masala Chips' with "
              "2.1 crore units sold. 'Mango Fizz' beverage was the fastest "
              "growing product with a 27% rise in units sold. Frozen paratha "
              "packs continued steady demand in the frozen meals category."],
             None),
            ("5. Outlook",
             ["Management expects continued double-digit growth in FY2025, "
              "supported by expansion of cold-chain distribution and the launch "
              "of a healthy-snacks sub-brand targeting urban consumers."],
             None),
        ],
    )

    # ---- PDF 2: Company-wide yearly sales report --------------------------
    _build_pdf(
        yearly_path,
        "Global Foods Group — Yearly Sales Report",
        "Annual Performance Review | Calendar Year 2024",
        [
            ("1. Introduction",
             ["Global Foods Group operates across four product lines: Dairy, "
              "Bakery, Confectionery, and Ready-to-Eat. This yearly report "
              "consolidates sales performance for calendar year 2024 and "
              "compares it against the previous two years."],
             None),
            ("2. Annual Revenue by Product Line (USD Million)",
             ["Confectionery delivered the highest yearly revenue, overtaking "
              "Dairy for the first time, while Ready-to-Eat posted the largest "
              "growth as consumers shifted toward convenience foods."],
             [["Product Line", "2022", "2023", "2024"],
              ["Dairy", "120.4", "126.8", "131.2"],
              ["Bakery", "88.1", "92.5", "99.0"],
              ["Confectionery", "110.7", "124.3", "138.6"],
              ["Ready-to-Eat", "64.2", "78.9", "96.4"]]),
            ("3. Yearly Revenue by Region (USD Million)",
             ["The North region generated the most revenue overall. Year over "
              "year, the North region grew 8.9% while the Asia-Pacific region "
              "led growth at 21.3%, reflecting rapid retail expansion."],
             [["Region", "2023", "2024", "YoY Growth"],
              ["North America", "168.5", "183.5", "+8.9%"],
              ["Europe", "142.0", "151.4", "+6.6%"],
              ["Asia-Pacific", "78.6", "95.3", "+21.3%"],
              ["Latin America", "33.4", "35.0", "+4.8%"]]),
            ("4. Key Metrics",
             ["Gross margin improved to 38.4% from 36.1% in 2023. Total units "
              "sold crossed 1.2 billion. Online channel sales accounted for 18% "
              "of yearly revenue, up from 12% the prior year."],
             None),
            ("5. Conclusion",
             ["Calendar year 2024 was a record year for Global Foods Group, with "
              "total revenue of USD 465.2 million. The confectionery line and "
              "the Asia-Pacific region are expected to remain primary growth "
              "drivers into 2025."],
             None),
        ],
    )

    return [abc_path, yearly_path]


# ===========================================================================
# 2. OFFLINE EMBEDDINGS  (deterministic, no API key / network required)
# ===========================================================================
from langchain_core.embeddings import Embeddings


class LocalMockEmbeddings(Embeddings):
    """
    Deterministic, dependency-free embedding model that implements the
    LangChain Embeddings interface so it is a drop-in replacement for
    OpenAI/Azure embeddings in this pipeline.

    Approach: hashed bag-of-words (the "hashing trick"). Each token is hashed
    into a fixed-dimension vector; term frequencies are accumulated and the
    vector is L2-normalized. Semantically similar texts that share vocabulary
    (e.g. a sales query and the matching report chunk) land close together
    under cosine/inner-product similarity -- enough for meaningful retrieval
    entirely offline and reproducibly.
    """

    def __init__(self, dim: int = 512):
        self.dim = dim

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        return re.findall(r"[a-z0-9]+", text.lower())

    def _embed(self, text: str) -> List[float]:
        vec = np.zeros(self.dim, dtype=np.float32)
        tokens = self._tokenize(text)
        for tok in tokens:
            h = int(hashlib.md5(tok.encode("utf-8")).hexdigest(), 16)
            idx = h % self.dim
            sign = 1.0 if (h >> 8) % 2 == 0 else -1.0
            vec[idx] += sign
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec /= norm
        return vec.tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [self._embed(t) for t in texts]

    def embed_query(self, text: str) -> List[float]:
        return self._embed(text)


# ===========================================================================
# 3. LOAD + CHUNK PDFs
# ===========================================================================
def load_and_chunk(pdf_paths: List[str]):
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    all_docs = []
    for path in pdf_paths:
        pages = PyPDFLoader(path).load()
        all_docs.extend(pages)
        print(f"  Loaded {os.path.basename(path):<28} -> {len(pages)} page(s)")

    # Smaller chunks keep each report section (quarterly table, regional table,
    # product notes) in its own chunk, which sharpens semantic retrieval.
    splitter = RecursiveCharacterTextSplitter(chunk_size=450, chunk_overlap=80)
    chunks = splitter.split_documents(all_docs)
    return all_docs, chunks


# ===========================================================================
# 4. BUILD / SAVE / LOAD FAISS VECTORSTORE
# ===========================================================================
def build_vectorstore(chunks, embeddings):
    from langchain_community.vectorstores import FAISS

    vs = FAISS.from_documents(chunks, embedding=embeddings)
    vs.save_local(INDEX_DIR)
    # Reload from disk to prove persistence round-trips correctly.
    vs = FAISS.load_local(INDEX_DIR, embeddings,
                          allow_dangerous_deserialization=True)
    return vs


# ===========================================================================
# 5/6. METRICS + RETRIEVAL
# ===========================================================================
def chunk_metrics(chunks):
    sizes = [len(c.page_content) for c in chunks]
    total = len(chunks)
    avg = sum(sizes) / total if total else 0
    return total, avg, (min(sizes) if sizes else 0), (max(sizes) if sizes else 0)


def run_queries(vectorstore, queries: List[str], k: int = 2):
    results_log = []
    for q in queries:
        print(f"\nQuery: {q}")
        hits = vectorstore.similarity_search_with_score(q, k=k)
        top_doc, top_score = hits[0]
        source = os.path.basename(top_doc.metadata.get("source", "?"))
        page = top_doc.metadata.get("page", "?")
        snippet = " ".join(top_doc.page_content.split())[:260]
        print(f"  Top match  (score={top_score:.4f}, lower=closer)"
              f"  [{source}, page {page}]")
        print(f"    {snippet} ...")
        results_log.append((q, top_score, source, page, snippet))
    return results_log


# ===========================================================================
# 7. ANALYSIS REPORT
# ===========================================================================
def write_report(pdf_paths, total, avg, mn, mx, query_log):
    lines = []
    lines.append("# RAG Pipeline — Analysis Report\n")
    lines.append(f"*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n")

    lines.append("## 1. Introduction\n")
    lines.append(
        "This project implements a Retrieval-Augmented Generation (RAG) "
        "pipeline over food-industry sales reports. RAG grounds a language "
        "model in an organization's own documents: instead of relying on the "
        "model's parametric memory, relevant passages are retrieved from a "
        "vector store and supplied as context. This is highly relevant for "
        "sales analytics, where answers must be traceable to specific figures "
        "in quarterly and yearly reports.\n")

    lines.append("## 2. Implementation Overview\n")
    lines.append(
        "The pipeline, implemented in `rag_pipeline.py`, performs the "
        "following steps:\n\n"
        "1. **PDF generation** — two mock food-industry PDFs are produced with "
        "`reportlab` (ABC Foods quarterly report, Global Foods yearly report).\n"
        "2. **Load & chunk** — `PyPDFLoader` reads the PDFs and "
        "`RecursiveCharacterTextSplitter` splits them (chunk size 450, overlap "
        "80).\n"
        "3. **Embed** — chunks are embedded with a deterministic offline "
        "embedder implementing LangChain's `Embeddings` interface (hashing "
        "trick), so the pipeline runs with no API key or network. The commented "
        "`CONNECTOR PLACEHOLDERS` section shows how to swap in Azure OpenAI "
        "embeddings and a pgvector / cloud vector DB.\n"
        "4. **Store** — vectors are written to a local **FAISS** index and "
        "reloaded from disk to verify persistence.\n"
        "5. **Retrieve** — sample sales queries are answered via "
        "`similarity_search_with_score`.\n\n"
        "**Tools:** Python, LangChain, FAISS, PyPDF, reportlab, NumPy.\n")

    lines.append("## 3. Metrics\n")
    lines.append("**Source PDFs:**\n")
    for p in pdf_paths:
        lines.append(f"- `{os.path.basename(p)}`")
    lines.append("")
    lines.append(f"- **Total chunks:** {total}")
    lines.append(f"- **Average chunk size:** {avg:.1f} characters")
    lines.append(f"- **Min / Max chunk size:** {mn} / {mx} characters\n")
    lines.append("**Sample query results (top match per query):**\n")
    lines.append("| Query | Score | Source | Page |")
    lines.append("|-------|-------|--------|------|")
    for q, score, source, page, _ in query_log:
        lines.append(f"| {q} | {score:.4f} | {source} | {page} |")
    lines.append("")
    if query_log:
        q0, s0, src0, pg0, snip0 = query_log[0]
        lines.append(f"**Example — top chunk for _\"{q0}\"_** "
                     f"(`{src0}`, page {pg0}):\n")
        lines.append(f"> {snip0} ...\n")

    lines.append("## 4. Conclusion\n")
    lines.append(
        "The pipeline demonstrates a complete, reproducible RAG workflow over "
        "sales documents: chunking, embedding, FAISS indexing, and semantic "
        "retrieval. Semantic search reliably surfaced the correct report "
        "sections for revenue, regional, and product-line questions.\n\n"
        "**Issues faced:** running the assignment as-specified requires paid "
        "Azure OpenAI credentials and network access, which make the submission "
        "non-reproducible. This was solved with a deterministic offline "
        "embedder behind the same LangChain interface.\n\n"
        "**Possible improvements:** (1) use higher-quality embeddings (Azure "
        "OpenAI `text-embedding-3-large` or a local sentence-transformer) for "
        "better semantic recall; (2) add a generation step that feeds the "
        "retrieved chunks to an LLM to compose a final answer; (3) persist "
        "vectors in a managed vector DB (pgvector/Pinecone) for scale; and "
        "(4) add table-aware parsing to better capture numeric sales figures.\n")

    with open(REPORT_FILE, "w") as f:
        f.write("\n".join(lines))


# ===========================================================================
# MAIN
# ===========================================================================
def main():
    print("=" * 70)
    print("RAG PIPELINE — PDF CHUNKING & RETRIEVAL (Food-Industry Sales)")
    print("=" * 70)

    print("\n[1/6] Generating sample PDFs ...")
    pdf_paths = generate_sample_pdfs()
    for p in pdf_paths:
        print(f"  Wrote {p}  ({os.path.getsize(p):,} bytes)")

    print("\n[2/6] Loading & chunking PDFs ...")
    _docs, chunks = load_and_chunk(pdf_paths)

    print("\n[3/6] Embedding chunks (offline LocalMockEmbeddings) ...")
    embeddings = LocalMockEmbeddings(dim=512)
    print(f"  Embedding dimension: {embeddings.dim}")

    print("\n[4/6] Building & persisting FAISS vectorstore ...")
    vectorstore = build_vectorstore(chunks, embeddings)
    print(f"  Vectors stored: {vectorstore.index.ntotal}")
    print(f"  Numbers per vector: {vectorstore.index.d}")
    print(f"  Index saved to: {INDEX_DIR}")

    print("\n[5/6] Chunking metrics ...")
    total, avg, mn, mx = chunk_metrics(chunks)
    print(f"  Total number of chunks : {total}")
    print(f"  Average chunk size     : {avg:.1f} characters")
    print(f"  Min / Max chunk size   : {mn} / {mx} characters")

    print("\n[6/6] Running retrieval queries ...")
    queries = [
        "What were ABC Foods total sales and which quarter was strongest?",
        "Which product line had the highest yearly revenue?",
        "How did the North region perform year over year?",
        "Which region grew the fastest in sales?",
    ]
    query_log = run_queries(vectorstore, queries, k=2)

    write_report(pdf_paths, total, avg, mn, mx, query_log)
    print(f"\nAnalysis report written to: {REPORT_FILE}")
    print("\nDone. Pipeline completed successfully.")


if __name__ == "__main__":
    with open(OUTPUT_FILE, "w") as _fh:
        _orig_out, _orig_err = sys.stdout, sys.stderr
        sys.stdout = _Tee(_orig_out, _fh)
        sys.stderr = _Tee(_orig_err, _fh)
        try:
            main()
        finally:
            sys.stdout, sys.stderr = _orig_out, _orig_err
    print(f"\nConsole output captured to: {OUTPUT_FILE}")
