import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { constructApiGateway } from "./resources/api-gateway";
import { helloWorld } from "./functions/hello-world";
import { constructDocumentBucket } from "./resources/document-bucket";
import { constructParameterStore } from "./resources/parameter-store";
import { constructDocumentStoreTable } from "./resources/document-store-table";
import { handlers } from "./functions/handler";

export interface ForteChatStackProps extends StackProps {
  domainName: string;
}

export class ForteChatStack extends Stack {
  constructor(scope: Construct, id: string, props: ForteChatStackProps) {
    super(scope, id, props);

    const documentBucket = constructDocumentBucket(this, props);
    const parameterStore = constructParameterStore(this);
    const documentStoreTable = constructDocumentStoreTable(this);

    const apiGateway = constructApiGateway(this);

    handlers(this, parameterStore, documentBucket, documentStoreTable);

    helloWorld(this, apiGateway);
  }
}
