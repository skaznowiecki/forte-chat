import { RemovalPolicy } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
export const constructDocumentStoreTable = (scope: Construct): Table => {
  return new Table(scope, "DocumentStoreTable", {
    tableName: `DocumentStore`,
    partitionKey: { name: "pk", type: AttributeType.STRING },
    sortKey: { name: "sk", type: AttributeType.STRING },
    billingMode: BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
    stream: StreamViewType.NEW_AND_OLD_IMAGES,
  });
};
