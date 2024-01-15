import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { documentCreated } from "./document-created";

export const handlers = (
  scope: Construct,
  parameterStore: StringParameter,
  documentBucket: Bucket,
  documentStoreTable: Table
) => {
  documentCreated(scope, parameterStore, documentBucket, documentStoreTable);
};
