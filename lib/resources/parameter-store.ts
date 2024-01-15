import { Construct } from "constructs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

export const constructParameterStore = (scope: Construct): StringParameter => {
  return new StringParameter(scope, "SsmParameter", {
    parameterName: "OPEN_AI_KEY",
    stringValue: "randomString",
  });
};
