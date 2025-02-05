import { Function, IFunction, Runtime, Code} from 'aws-cdk-lib/aws-lambda';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';

export class LambdaStack extends Stack{
    public readonly serviceFunction: IFunction;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

    this.serviceFunction = new Function(this, 'Handler',{
        runtime: Runtime.PYTHON_3_10,
        handler: 'main.handler',
        code: Code.fromAsset('lambda/functions/my_deployment_package.zip'),
        timeout: Duration.seconds(45)
    });
    
    }

}