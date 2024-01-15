import { S3CreateEvent } from "aws-lambda";
import { addDocument } from "../../platform/core/add-document";

export const handler = async (event: S3CreateEvent): Promise<void> => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const keys: string[] = event.Records.map((record) => {
    return record.s3.object.key;
  });

  await addDocument(keys[0]);
};
