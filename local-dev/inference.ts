import { PromptTemplate } from "langchain/prompts";

import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import {
  ConversationalRetrievalQAChain,
  RetrievalQAChain,
} from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";

const init = async () => {
  const questionPrompt = PromptTemplate.fromTemplate(
    `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
      ----------------
      CHAT HISTORY: {chatHistory}
      ----------------
      CONTEXT: {context}
      ----------------
      QUESTION: {question}
      ----------------
      Helpful Answer:`
  );

  const vectorStore = await FaissStore.load(
    "./",
    new OpenAIEmbeddings({
      openAIApiKey: "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",
    })
  );

  const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
  });

  const model = new ChatOpenAI({
    modelName: "gpt-4",
    openAIApiKey: "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",
  });

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  const response = await chain.call({
    query: "What is task decomposition?",
  });
  console.log(response);
};

init();
