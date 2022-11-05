const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.getHandler = async (event) => {
    try {
        const { id } = event.pathParameters;
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                id: id
            }
        };
        const data = await docClient.get(params).promise();
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