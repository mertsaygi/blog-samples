import json
import boto3
from random import randint
import names

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # TODO implement
    table = dynamodb.Table('dynamodb-streams-sample-datas')
    table.put_item(
        Item={
            'id': randint(0, 1000),
            'username': names.get_first_name(),
            'lastname': names.get_last_name()
        }
    )

    return {
        'statusCode': 200,
        'body': {}
    }


