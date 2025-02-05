import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { TableV2, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { IFunction} from 'aws-cdk-lib/aws-lambda';

export interface DbStackProps extends StackProps {
    lambdaFunction: IFunction;
}

export class DbStack extends Stack {
    public readonly topicsTable: TableV2;

    constructor(scope: Construct, id: string, props: DbStackProps) {
        super(scope, id, props);

        this.topicsTable = new TableV2(this, "topicsTable", {
            tableName: 'TopicsTable',
            partitionKey: { name: 'topic', type: AttributeType.STRING },
            removalPolicy: RemovalPolicy.DESTROY
        })
        this.topicsTable.grantReadWriteData(props.lambdaFunction)
    }
}