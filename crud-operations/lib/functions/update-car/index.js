const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function getParams(body, id) {
    return {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: id,
            brand: body.brand,
            model: body.model,
            year: body.year,
            fuel: body.fuel,
            gear: body.gear,
        },
    };
}

exports.updateHandler = async (event) => {
    try {
        const { id } = event.pathParameters;
        const body = JSON.parse(event.body);
        const params = getParams(body, id);
        // Create record if not exists, Otherwise update
        const data = await docClient.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err),
        };
    }
};