#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ForteChatStack } from "../lib/forte-chat-stack";

const app = new cdk.App();
new ForteChatStack(app, "ForteChatStack", {
  env: {
    region: "us-east-1",
    account: "686165858056",
  },
  domainName: "skaznowiecki.co",
});
