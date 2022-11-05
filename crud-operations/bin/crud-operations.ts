#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CrudOperationsStack } from '../lib/crud-operations-stack';

const app = new cdk.App();
new CrudOperationsStack(app, 'CrudOperationsStack');