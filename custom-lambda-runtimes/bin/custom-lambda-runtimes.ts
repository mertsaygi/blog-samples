#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CustomLambdaRuntimesStack } from '../lib/custom-lambda-runtimes-stack';

const app = new cdk.App();
new CustomLambdaRuntimesStack(app, 'CustomLambdaRuntimesStack');