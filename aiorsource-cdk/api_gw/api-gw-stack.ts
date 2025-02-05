import { StackProps, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {RestApi, LambdaIntegration, LogGroupLogDestination, AccessLogFormat} from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { LogGroup} from 'aws-cdk-lib/aws-logs';

export interface ApiGatewayStackProps extends StackProps {
  lambdaFunction: IFunction;
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);
    // Define log group
    const prodLogGroup = new LogGroup(this, 'prodLogs');

    // Define the REST API
    const api = new RestApi(this, 'WikiGuessAPI', {
      restApiName: 'Wiki Guess API',
      description: 'API for Wiki Guess',
      defaultCorsPreflightOptions:{
        allowOrigins: ['http://localhost:5173', "https://aiorsource.vercel.app", "https://wikiguess.vercel.app", "https://wiki-guess-git-dev-randy-dos-projects.vercel.app"],  //allows api call from local host
        allowHeaders: ['Content-Type']
      },

      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new LogGroupLogDestination(prodLogGroup),
        accessLogFormat: AccessLogFormat.jsonWithStandardFields({
          caller: true,
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          user: true,
        }),
      },
    });

    // Define the API resource
    const lambdaIntegration = new LambdaIntegration(props.lambdaFunction);

    api.root.addResource('test').addMethod('POST', lambdaIntegration);
  }
}