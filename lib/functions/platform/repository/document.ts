import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { createWriteStream, unlinkSync } from "fs";
import { Document } from "langchain/dist/document";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Readable } from "stream";
import { basename } from "path";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});
const s3Client = new S3Client({});
const BASE_PATH = "/tmp";

export const getDocuments = async (
  key: string,
  bucketName: string = process.env.DOCUMENT_BUCKET_NAME!
): Promise<Document[]> => {
  await getDocumentFile(key, bucketName);

  const documents = await new PDFLoader(`${BASE_PATH}/${basename(key)}`).load();

  unlinkSync(`${BASE_PATH}/${basename(key)}`);

  return documents;
};

const getDocumentFile = async (
  key: string,
  bucketName: string
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const file = createWriteStream(`${BASE_PATH}/${basename(key)}`);

    const data = await s3Client.send(command);

    if (!data.Body) {
      reject("No body found");
    }

    const readStream = data.Body as Readable;

    readStream.pipe(file).on("close", () => {
      resolve();
    });
  });
};

export const storeDocumentsRelatedToKey = async (
  key: string,
  ids: string[],
  tableName: string = process.env.DOCUMENT_TABLE_NAME!
): Promise<void> => {
  await docClient.send(
    new BatchWriteCommand({
      RequestItems: {
        [tableName]: ids.map((id) => ({
          PutRequest: {
            Item: {
              pk: key,
              sk: id,
            },
          },
        })),
      },
    })
  );
};

export const getDocumentsRelatedToKey = async (
  key: string,
  tableName: string = process.env.DOCUMENT_TABLE_NAME!
): Promise<string[]> => {
  const { Items } = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": key,
      },
    })
  );

  return (Items || []).map((item) => item.sk);
};

export const deleteDocumentsRelatedToKey = async (
  key: string,
  ids: string[],
  tableName: string = process.env.DOCUMENT_TABLE_NAME!
): Promise<void> => {
  await docClient.send(
    new BatchWriteCommand({
      RequestItems: {
        [tableName]: ids.map((id) => ({
          DeleteRequest: {
            Key: {
              pk: key,
              sk: id,
            },
          },
        })),
      },
    })
  );
};
