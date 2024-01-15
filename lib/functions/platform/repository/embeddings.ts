import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const client = new SSMClient({});

let openAIApiKey: string | undefined;

const getOpenAIKey = async (
  name: string = process.env.PARAMETER_STORE_NAME!
): Promise<string> => {
  const command = new GetParameterCommand({
    Name: name,
  });

  const response = await client.send(command);

  if (!response.Parameter) {
    throw new Error("No parameter found");
  }

  return response.Parameter.Value!;
};

export const getEmbeddings = async (): Promise<OpenAIEmbeddings> => {
  if (!openAIApiKey) {
    openAIApiKey = await getOpenAIKey();
  }

  return new OpenAIEmbeddings({
    openAIApiKey,
  });
};
