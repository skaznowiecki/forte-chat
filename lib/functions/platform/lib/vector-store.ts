import { FaissStore } from "langchain/vectorstores/faiss";
import { getEmbeddings } from "../repository/embeddings";
import {
  existsVectorStoreFile,
  getVectorStoreFile,
  saveVectorStoreFile,
} from "../repository/vector-store";

const checkIfVectorStoreExists = async (): Promise<boolean> => {
  const [docstore, faiss] = await Promise.all([
    existsVectorStoreFile("docstore.json"),
    existsVectorStoreFile("faiss.index"),
  ]);

  return docstore && faiss;
};

export const loadVectorStore = async (): Promise<FaissStore> => {
  const exists = await checkIfVectorStoreExists();
  const embeddings = await getEmbeddings();

  if (!exists) {
    return new FaissStore(embeddings, {});
  }

  await Promise.all([
    getVectorStoreFile("docstore.json"),
    getVectorStoreFile("faiss.index"),
  ]);

  return await FaissStore.load("./", embeddings);
};

export const saveVectorStore = async (vectorStore: FaissStore) => {
  await vectorStore.save("./tmp");

  await Promise.all([
    saveVectorStoreFile("docstore.json"),
    saveVectorStoreFile("faiss.index"),
  ]);
};
