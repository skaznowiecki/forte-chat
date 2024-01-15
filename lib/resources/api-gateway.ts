import { Construct } from "constructs";

import { Cors, RestApi } from "aws-cdk-lib/aws-apigateway";

export const constructApiGateway = (scope: Construct): RestApi => {
  return new RestApi(scope, "ApiGateway", {
    restApiName: "chat-api",
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
    },
    deploy: true,
  });
};
