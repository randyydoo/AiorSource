import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaStack } from '../lambda/lambda-stack';
import { ApiGatewayStack } from '../api_gw/api-gw-stack';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const lambdaStack = new LambdaStack(this, "PythonLambdaStack")
    const apiGwStack = new ApiGatewayStack(this, 'APIGwStack', {
      lambdaFunction: lambdaStack.serviceFunction
    })
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
