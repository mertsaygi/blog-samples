const crypto = require('crypto');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function getParams(body) {
    return {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: crypto.randomUUID(),
            brand: body.brand,
            model: body.model,
            year: body.year,
            fuel: body.fuel,
            gear: body.gear,
        },
    };
}

exports.createHandler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const params = getParams(body);
        await docClient.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                brand: body.brand,
                model: body.model,
                year: body.year,
                fuel: body.fuel,
                gear: body.gear,
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err),
        };
    }
};