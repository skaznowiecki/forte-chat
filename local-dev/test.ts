import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

import * as fs from "fs";
import { writeFileSync } from "node:fs";

const client = new S3Client({
  region: "us-east-1",
});

export const checkIfVectorStoreExists = async (
  key: string,
  bucketName: string = process.env.DOCUMENT_BUCKET_NAME!
): Promise<boolean> => {
  const command = new HeadObjectCommand({
    Bucket: "covert-assets",
    Key: `1y2ipo.jp`,
  });
  try {
    await client.send(command);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getVectorStoreFile = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const command = new GetObjectCommand({
      Bucket: "covert-assets",
      Key: `1y2ipo.jpg`,
    });

    const file = fs.createWriteStream("1y2ipo.jpg");

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

const init = async () => {
  //const exists = await checkIfVectorStoreExists("example_pdf.pdf");

  //console.log(exists);
  await getVectorStoreFile();
  console.log("done");
};

init();
