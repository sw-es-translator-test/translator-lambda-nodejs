import { ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { DictionaryItem } from "../models/dictionary-item";
import { dbClient } from "../utils/db-client";

export const translateProperties = async (person: any): Promise<any> => {
    const translatedPerson: any = {};
    try {
        const dictionary = await prepareMap(person);
        for (const personKey in person) {
            if (person.hasOwnProperty(personKey)) {
                translatedPerson[dictionary[personKey] ?? personKey] = person[personKey];
            }
        }
        return translatedPerson;
    } catch (error) {
        console.log(error);
        return error.message;
    }
};

const prepareMap = async (person: any): Promise<any> => {
    const personKeys = Object.keys(person);

    // Query DynamoDB to get the translation
    const expressionAttributeValues = personKeys.reduce((acc: any, item, index) => {
        acc[`:val${index}`] = item;
        return acc;
    }, {});

    const params: ScanCommandInput = {
        TableName: "dictionary",
        FilterExpression: `#attr IN (${Object.keys(expressionAttributeValues).join(", ")})`,
        ExpressionAttributeNames: {
            "#attr": "en"
        },
        ExpressionAttributeValues: expressionAttributeValues
    };

    try {
        const matchingItems = await dbClient(params);
        const items = matchingItems.Items;
        return items.reduce((accItems: any, item: DictionaryItem) => {
            accItems[item.en] = item.es;
            return accItems;
        }, {});
    } catch (error) {
        console.log(error);
        return error;
    }
};
