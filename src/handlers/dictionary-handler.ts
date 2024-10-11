import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { translateProperties } from "../services/translation-service";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "ID is required" })
        };
    }

    const url = `https://swapi.py4e.com/api/people/${id}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const person = await response.json();

        // Translate properties from English to Spanish
        const translatedPerson = await translateProperties(person);

        return {
            statusCode: 200,
            body: JSON.stringify(translatedPerson),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message,
            }),
        };
    }
};
