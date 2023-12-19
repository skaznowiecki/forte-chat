#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ForteChatStack } from '../lib/forte-chat-stack';

const app = new cdk.App();
new ForteChatStack(app, 'ForteChatStack');
