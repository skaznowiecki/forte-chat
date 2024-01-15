import { loadVectorStore, saveVectorStore } from "../lib/vector-store";
import {
  deleteDocumentsRelatedToKey,
  getDocumentsRelatedToKey,
} from "../repository/document";

export const deleteDocument = async (key: string): Promise<void> => {
  const vectorStore = await loadVectorStore();

  const ids = await getDocumentsRelatedToKey(key);

  await vectorStore.delete({ ids });

  await deleteDocumentsRelatedToKey(key, ids);

  await saveVectorStore(vectorStore);
};
