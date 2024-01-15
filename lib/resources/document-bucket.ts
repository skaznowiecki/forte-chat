import { Construct } from "constructs";
import { Bucket, BucketEncryption, HttpMethods } from "aws-cdk-lib/aws-s3";
import { RemovalPolicy } from "aws-cdk-lib";
import { ForteChatStackProps } from "../forte-chat-stack";

export const constructDocumentBucket = (
  scope: Construct,
  props: ForteChatStackProps
): Bucket => {
  return new Bucket(scope, "DocumentBucket", {
    encryption: BucketEncryption.S3_MANAGED,
    bucketName: `documents.${props.domainName}`,
    autoDeleteObjects: true,
    removalPolicy: RemovalPolicy.DESTROY,
  });
};
