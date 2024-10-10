import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";

export const dbClient = async (params: ScanCommandInput) => {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new ScanCommand(params);

    try {
        const results: any = await docClient.send(command);
        return results;
    } catch (err) {
        console.error(err);
        return null;
    }
};
