import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export const helloWorld = (
  scope: Construct,
  apiGateway: RestApi
): lambda.NodejsFunction => {
  const lambdaFunction = new lambda.NodejsFunction(scope, "HelloWorld", {
    functionName: "hello-world",
    entry: `${__dirname}/handler.ts`,
    handler: "handler",
    runtime: Runtime.NODEJS_LATEST,
  });

  const integration = new LambdaIntegration(lambdaFunction, {
    requestTemplates: {
      "application/json": '{ "statusCode": "200" }',
    },
  });

  apiGateway.root.addMethod("GET", integration);

  return lambdaFunction;
};
