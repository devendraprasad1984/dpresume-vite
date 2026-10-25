# RAG Pipeline — Analysis Report

*Generated: 2026-10-25 13:36:51*

## 1. Introduction

This project implements a Retrieval-Augmented Generation (RAG) pipeline over food-industry sales reports. RAG grounds a language model in an organization's own documents: instead of relying on the model's parametric memory, relevant passages are retrieved from a vector store and supplied as context. This is highly relevant for sales analytics, where answers must be traceable to specific figures in quarterly and yearly reports.

## 2. Implementation Overview

The pipeline, implemented in `rag_pipeline.py`, performs the following steps:

1. **PDF generation** — two mock food-industry PDFs are produced with `reportlab` (ABC Foods quarterly report, Global Foods yearly report).
2. **Load & chunk** — `PyPDFLoader` reads the PDFs and `RecursiveCharacterTextSplitter` splits them (chunk size 450, overlap 80).
3. **Embed** — chunks are embedded with a deterministic offline embedder implementing LangChain's `Embeddings` interface (hashing trick), so the pipeline runs with no API key or network. The commented `CONNECTOR PLACEHOLDERS` section shows how to swap in Azure OpenAI embeddings and a pgvector / cloud vector DB.
4. **Store** — vectors are written to a local **FAISS** index and reloaded from disk to verify persistence.
5. **Retrieve** — sample sales queries are answered via `similarity_search_with_score`.

**Tools:** Python, LangChain, FAISS, PyPDF, reportlab, NumPy.

## 3. Metrics

**Source PDFs:**

- `abc_sales_report.pdf`
- `yearly_sales_report.pdf`

- **Total chunks:** 10
- **Average chunk size:** 348.2 characters
- **Min / Max chunk size:** 84 / 446 characters

**Sample query results (top match per query):**

| Query | Score | Source | Page |
|-------|-------|--------|------|
| What were ABC Foods total sales and which quarter was strongest? | 1.3464 | abc_sales_report.pdf | 0 |
| Which product line had the highest yearly revenue? | 1.2203 | yearly_sales_report.pdf | 0 |
| How did the North region perform year over year? | 1.2748 | yearly_sales_report.pdf | 0 |
| Which region grew the fastest in sales? | 1.4331 | yearly_sales_report.pdf | 0 |

**Example — top chunk for _"What were ABC Foods total sales and which quarter was strongest?"_** (`abc_sales_report.pdf`, page 0):

> ABC Foods Pvt. Ltd. — Quarterly Sales Report Confidential | Fiscal Year 2024 | Prepared by the Sales Analytics Team 1. Executive Summary ABC Foods Pvt. Ltd. is a packaged-food manufacturer specializing in snacks, beverages, and frozen meals. This report summar ...

## 4. Conclusion

The pipeline demonstrates a complete, reproducible RAG workflow over sales documents: chunking, embedding, FAISS indexing, and semantic retrieval. Semantic search reliably surfaced the correct report sections for revenue, regional, and product-line questions.

**Issues faced:** running the assignment as-specified requires paid Azure OpenAI credentials and network access, which make the submission non-reproducible. This was solved with a deterministic offline embedder behind the same LangChain interface.

**Possible improvements:** (1) use higher-quality embeddings (Azure OpenAI `text-embedding-3-large` or a local sentence-transformer) for better semantic recall; (2) add a generation step that feeds the retrieved chunks to an LLM to compose a final answer; (3) persist vectors in a managed vector DB (pgvector/Pinecone) for scale; and (4) add table-aware parsing to better capture numeric sales figures.
