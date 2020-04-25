#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DynamodbStreamsStack } from '../lib/dynamodb-streams-stack';

const app = new cdk.App();
new DynamodbStreamsStack(app, 'DynamodbStreamsStack');
