# python3 -m venv demo_1
# source demo_1/bin/activate
# pip3 install ipykernel
# python3 -m ipykernel install --user --name demo_1 --display-name demo_1_kernal



#!/usr/bin/env python
# coding: utf-8

# In[1]:


import importlib.util, subprocess, sys
NEEDED = {
    "dotenv": "python-dotenv",
    "langchain_openai": "langchain-openai",
    "langchain_community": "langchain-community>=0.3.0,<0.4.0",
    "langchain_text_splitters": "langchain-text-splitters",
    "faiss": "faiss-cpu>=1.7.4",
    "pypdf": "pypdf>=4.0.0",
}
missing = [req for mod, req in NEEDED.items() if importlib.util.find_spec(mod) is None]
if missing:
    print("Installing:", ", ".join(missing))
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", *missing])
print("All required libraries are installed.")



# In[2]:


# faiss and chroma db is a vector db - this is not for production, only for poc / demo
# for prod, used vector db  weaviate, pinecone, redis, pgvector from postgres
# neo4j is graphdb

import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(usecwd=True), override=True)
key = "2ABecnfxzhRg4M5D6pBKiqxXVhmGB2WvQ0aYKkbTCPsj0JLKsZPfJQQJ99BDAC77bzfXJ3w3AAABACOGi3sC"
assert key, "AZURE_OPENAI_API_KEY not found. Add it to the .env file in this notebook's folder."
print("API key loaded.")




# In[3]:


GATEWAY = "https://openai-api-management-gw.azure-api.net"


# In[4]:


from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
GATEWAY = "https://openai-api-management-gw.azure-api.net"
llm = AzureChatOpenAI(
    base_url=f"{GATEWAY}/openaiprodtest-clone",
    model="gpt-5-mini",
    api_version="2024-12-01-preview",
    api_key=key,
    validate_base_url=False,
)
embeddings = AzureOpenAIEmbeddings(
    azure_endpoint=GATEWAY,
    azure_deployment="text-embedding-ada-002",
    api_version="2023-05-15",
    api_key=key,
)
print("Chat model replied:", llm.invoke("Reply with just the word: ready").content)
print("Embeddings OK, vector length:", len(embeddings.embed_query("test")))


# In[5]:


llm.invoke("reply with just the word: ready")


# In[6]:


llm.invoke("who is present of india in 2026 and how he / she differs from US president")


# In[7]:


question = "How many days of paid annual leave does ACME Corporation offer its employees?"
no_rag_answer = llm.invoke(question).content
print("--- LLM ANSWER WITHOUT RAG ---\n")
print(no_rag_answer)


# In[10]:


from langchain_community.document_loaders import TextLoader
docs = TextLoader("hr_policy.txt", encoding="utf-8").load()     # the whole file becomes one Document
print(f"Loaded hr_policy.txt: {len(docs[0].page_content)} characters\n")
print(docs[0].page_content[:600])


# In[11]:


#chunking is similar to batching strategy so smaller portions are fed to llm
#overlap chunking, there are various chunking strategies
# semantic chunking better than overlap chunking
from langchain_text_splitters import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
hr_chunks = splitter.split_documents(docs)
print(f"Split the document into {len(hr_chunks)} chunks.\n")
print("--- Example chunk ---")
print(hr_chunks[3].page_content)


# In[13]:


from langchain_community.document_loaders import TextLoader
docs = TextLoader("hr_policy.txt", encoding="utf-8").load()     # the whole file becomes one Document
print(f"Loaded hr_policy.txt: {len(docs[0].page_content)} characters\n")
print(docs[0].page_content[:600])


# In[14]:


#vectorisation part
INDEX_DIR = "hr_policy_txt_faiss_index"
chunk_texts = [chunk.page_content for chunk in hr_chunks]
chunk_vectors = embeddings.embed_documents(chunk_texts)      # one API call for all chunks
print(f"Created {len(chunk_vectors)} vectors, one per chunk.")
print(f"Each vector has {len(chunk_vectors[0])} numbers.")


# In[15]:


chunk_vectors


# In[16]:


from langchain_community.vectorstores import FAISS
hr_vectorstore = FAISS.from_embeddings(
    text_embeddings=list(zip(chunk_texts, chunk_vectors)),   # (text, vector) pairs we already computed
    embedding=embeddings,                                     # used later to turn QUESTIONS into vectors
    metadatas=[chunk.metadata for chunk in hr_chunks],
)
print("Vector database created.")


# In[18]:


#read about CLIP embedding model - images also into numbers / vectors - meaning format


# In[ ]:






