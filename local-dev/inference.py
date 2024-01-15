import boto3
import os

from langchain.embeddings import BedrockEmbeddings
from langchain.document_loaders import PyPDFLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import PromptTemplate


os.environ['OPENAI_API_KEY'] = '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'
openai_api_key = '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'

llm = OpenAI(openai_api_key=openai_api_key, temperature=0)

faiss_index = FAISS.load_local("./", OpenAIEmbeddings())

qa = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=faiss_index.as_retriever(),
        return_source_documents=True
)

res = qa({"question": "What is EIN number?", "chat_history": []})

print(res)