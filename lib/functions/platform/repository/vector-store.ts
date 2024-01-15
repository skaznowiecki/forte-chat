import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createReadStream, createWriteStream, unlinkSync } from "fs";
import { Readable } from "stream";

const client = new S3Client({});

const BASE_PATH = "/tmp";

export const existsVectorStoreFile = async (
  key: string,
  bucketName: string = process.env.DOCUMENT_BUCKET_NAME!
): Promise<boolean> => {
  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: `vector-store/${key}`,
  });

  try {
    await client.send(command);
    return true;
  } catch (error) {
    return false;
  }
};

export const saveVectorStoreFile = async (
  key: string,
  bucketName: string = process.env.DOCUMENT_BUCKET_NAME!
): Promise<void> => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `vector-store/${key}`,
    Body: createReadStream(`${BASE_PATH}/${key}`),
  });

  await client.send(command);

  unlinkSync(`${BASE_PATH}/${key}`);
};

export const getVectorStoreFile = async (
  key: string,
  bucketName: string = process.env.DOCUMENT_BUCKET_NAME!
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const file = createWriteStream(`${BASE_PATH}/${key}`);

    const data = await client.send(command);

    if (!data.Body) {
      reject("No body found");
    }

    const readStream = data.Body as Readable;

    readStream.pipe(file).on("close", () => {
      resolve();
    });
  });
};
