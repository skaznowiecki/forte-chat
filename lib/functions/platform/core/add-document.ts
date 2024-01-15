import { loadVectorStore, saveVectorStore } from "../lib/vector-store";
import {
  getDocuments,
  storeDocumentsRelatedToKey,
} from "../repository/document";

export const addDocument = async (key: string): Promise<void> => {
  const vectorStore = await loadVectorStore();
  const documents = await getDocuments(key);

  const ids = await vectorStore.addDocuments(documents);

  await storeDocumentsRelatedToKey(key, ids);

  await saveVectorStore(vectorStore);
};
