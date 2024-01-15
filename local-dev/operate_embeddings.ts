import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const create = async () => {
  const vectorStore = new FaissStore(
    new OpenAIEmbeddings({
      openAIApiKey: "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",
    }),
    {}
  );

  const result = await vectorStore.addDocuments(
    await new PDFLoader("./example_pdf.pdf").load()
  );
  console.log(result);
  await vectorStore.save("./");
};

const addDocument = async (name: string) => {
  const vectorStore = await FaissStore.load(
    "./",
    new OpenAIEmbeddings({
      openAIApiKey: "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",
    })
  );

  console.log(await vectorStore.addDocuments(await new PDFLoader(name).load()));

  await vectorStore.save("./");
};

const deleteDocument = async () => {
  const vectorStore = await FaissStore.load(
    "./",
    new OpenAIEmbeddings({
      openAIApiKey: "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",
    })
  );

  const result = vectorStore.delete({
    ids: ["9cd56a76-ccc5-4ebd-9a36-c337451b0cb6"],
  });

  console.log(result);

  vectorStore.save("./");
};

const check = async () => {
  const vectorStore = await FaissStore.load(
    "./",
    new OpenAIEmbeddings({
      openAIApiKey: "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",
    })
  );

  console.log(vectorStore);
};
check();
//create();
//addDocument("./example_pdf.pdf");
//addDocument("./example_pdf_2.pdf");

//deleteDocument();
