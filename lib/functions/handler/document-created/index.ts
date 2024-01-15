import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { S3EventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Duration, Size } from "aws-cdk-lib";

export const documentCreated = (
  scope: Construct,
  parameterStore: StringParameter,
  documentBucket: Bucket,
  documentStoreTable: Table
): lambda.NodejsFunction => {
  const lambdaFunction = new lambda.NodejsFunction(scope, "DocumentCreated", {
    functionName: "document-created",
    entry: `${__dirname}/handler.ts`,
    handler: "handler",
    runtime: Runtime.NODEJS_LATEST,
    environment: {
      DOCUMENT_STORE_TABLE: documentStoreTable.tableName,
      DOCUMENT_BUCKET_NAME: documentBucket.bucketName,
      PARAMETER_STORE_NAME: parameterStore.parameterName,
    },
    bundling: {
      nodeModules: ["@langchain/openai", "@langchain/community", "faiss-node"],
    },
    memorySize: 4096,
    timeout: Duration.minutes(5),
    ephemeralStorageSize: Size.gibibytes(1),
  });

  parameterStore.grantRead(lambdaFunction);
  documentBucket.grantReadWrite(lambdaFunction);
  documentStoreTable.grantReadData(lambdaFunction);

  lambdaFunction.addEventSource(
    new S3EventSource(documentBucket, {
      events: [EventType.OBJECT_CREATED],
      filters: [{ prefix: "documents/" }],
    })
  );

  return lambdaFunction;
};
