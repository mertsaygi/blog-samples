import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from "path";

export class CustomLambdaRuntimesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new lambda.DockerImageFunction(this, 'AssetFunction', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, 'functions/git-operations')),
      description: "git-operations-lambda-with-docker",
      functionName: "git-operations-lambda-with-docker",
      timeout: cdk.Duration.seconds(30),
      memorySize: 128,

    });

    new lambda.Function(this, 'GitOperationsLambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, './functions/git-operations')),
      runtime: lambda.Runtime.PYTHON_3_7,
      description: "git-operations-lambda",
      functionName: "git-operations-lambda",
      handler: "main.lambda_handler",
      timeout: cdk.Duration.seconds(30),
      memorySize: 128,
    });

  }
}
