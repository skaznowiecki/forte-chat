import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const init = async () => {
  const loader = new PDFLoader("./example_pdf.pdf");

  const docs = await loader.load();

  const vectorStore = await FaissStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({
      openAIApiKey: "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",
    })
  );

  vectorStore.save("./");
};

init();
