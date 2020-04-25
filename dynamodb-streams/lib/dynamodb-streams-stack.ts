import * as cdk from '@aws-cdk/core';
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import events = require('@aws-cdk/aws-events');
import sources = require("@aws-cdk/aws-lambda-event-sources");
import targets = require('@aws-cdk/aws-events-targets');
import { StreamViewType } from '@aws-cdk/aws-dynamodb';
import { RemovalPolicy } from '@aws-cdk/core';

export class DynamodbStreamsStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sourceTable = new dynamodb.Table(this, 'SourceTable', {
      tableName: "dynamodb-streams-sample-datas",
      partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const targetTable = new dynamodb.Table(this, 'TargetTable', {
      tableName: "dynamodb-streams-processed-datas",
      partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
      removalPolicy: RemovalPolicy.DESTROY
    });

    const dataGeneratorFunction = new lambda.Function(this, 'DataGeneratorFunction', {
      runtime: lambda.Runtime.PYTHON_3_7,
      functionName: "dynamodb-streams-data-generator",
      handler: 'lambda_function.lambda_handler',
      code: new lambda.AssetCode('./lib/data-generator/', { exclude: ["cdk", "cdk.out"] }),
    });
    sourceTable.grantReadWriteData(dataGeneratorFunction);

    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.expression('cron(0/1 * * * ? *)'),
      ruleName: "data-generator-cron-for streams"
    });
    rule.addTarget(new targets.LambdaFunction(dataGeneratorFunction));

    const streamsWorkerFunction = new lambda.Function(this, 'DataWorkerFunction', {
      runtime: lambda.Runtime.PYTHON_3_7,
      functionName: "dynamodb-streams-data-processor",
      handler: 'lambda_function.lambda_handler',
      code: new lambda.AssetCode('./lib/data-processor/', { exclude: ["cdk", "cdk.out"] }),
    });
    targetTable.grantReadWriteData(streamsWorkerFunction);

    streamsWorkerFunction.addEventSource(new sources.DynamoEventSource(sourceTable, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      batchSize: 5,
      bisectBatchOnError: true,
      retryAttempts: 10
    }));

  }

}
