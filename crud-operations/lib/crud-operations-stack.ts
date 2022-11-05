import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from "path";

export class CrudOperationsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaRole = new iam.Role(this, 'LambdaBasicRole', {
      roleName: 'lambda-basic-execution-role',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    const api = new apigateway.RestApi(this, 'SampleCRUDApi', {
      restApiName: 'sample-crud-api',
      description: 'sample-crud-api',
      deploy: true
    });

    const table = new dynamodb.Table(this, 'Table', {
      tableName: 'sample-crud-data-table',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    const createCarLambda = new lambda.Function(this, 'CreateCarLambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, './functions/create-car')),
      runtime: lambda.Runtime.NODEJS_16_X,
      description: "create-car-lambda",
      functionName: "create-car-lambda",
      handler: "index.createHandler",
      timeout: cdk.Duration.seconds(30),
      role: lambdaRole,
      memorySize: 128,
      environment: {
          "TABLE_NAME": table.tableName,
      }
    });

    const deleteCarLambda = new lambda.Function(this, 'DeleteCarLambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, './functions/delete-car')),
      runtime: lambda.Runtime.NODEJS_16_X,
      description: "delete-car-lambda",
      functionName: "delete-car-lambda",
      handler: "index.deleteHandler",
      timeout: cdk.Duration.seconds(30),
      role: lambdaRole,
      memorySize: 128,
      environment: {
          "TABLE_NAME": table.tableName,
      }
    });

    const getCarLambda = new lambda.Function(this, 'GetCarLambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, './functions/get-car')),
      runtime: lambda.Runtime.NODEJS_16_X,
      description: "get-car-lambda",
      functionName: "get-car-lambda",
      handler: "index.getHandler",
      timeout: cdk.Duration.seconds(30),
      role: lambdaRole,
      memorySize: 128,
      environment: {
          "TABLE_NAME": table.tableName,
      }
    });

    const listCarsLambda = new lambda.Function(this, 'ListCarLambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, './functions/list-cars')),
      runtime: lambda.Runtime.NODEJS_16_X,
      description: "list-car-lambda",
      functionName: "list-car-lambda",
      handler: "index.listHandler",
      timeout: cdk.Duration.seconds(30),
      role: lambdaRole,
      memorySize: 128,
      environment: {
          "TABLE_NAME": table.tableName,
      }
    });

    const updateCarLambda = new lambda.Function(this, 'UpdateCarLambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, './functions/update-car')),
      runtime: lambda.Runtime.NODEJS_16_X,
      description: "update-car-lambda",
      functionName: "update-car-lambda",
      handler: "index.updateHandler",
      timeout: cdk.Duration.seconds(30),
      role: lambdaRole,
      memorySize: 128,
      environment: {
          "TABLE_NAME": table.tableName,
      }
    });

    const carServiceResource = api.root.addResource('car');

    carServiceResource.addMethod('POST', new apigateway.LambdaIntegration(createCarLambda), {
      apiKeyRequired: false
    });

    carServiceResource.addMethod('GET', new apigateway.LambdaIntegration(listCarsLambda), {
      apiKeyRequired: false
    });

    const carServiceResourceWithId = carServiceResource.addResource('{id}');

    carServiceResourceWithId.addMethod('GET', new apigateway.LambdaIntegration(getCarLambda), {
      apiKeyRequired: false,
    });

    carServiceResourceWithId.addMethod('DELETE', new apigateway.LambdaIntegration(deleteCarLambda), {
      apiKeyRequired: false
    });

    carServiceResourceWithId.addMethod('PUT', new apigateway.LambdaIntegration(updateCarLambda), {
      apiKeyRequired: false
    });


  }
}
