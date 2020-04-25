import json
import boto3
from random import randint

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # TODO implement
    table = dynamodb.Table('dynamodb-streams-processed-datas')
    event_name = event["Records"][0]["eventName"]
    event_source = event["Records"][0]["eventSource"]
    d = event["Records"][0]["dynamodb"]
    if event_name == "INSERT":
        table.put_item(
            Item={
                'id': randint(0, 1000),
                'eventName': event_name,
                'eventSource': event_source,
                'NewImage': str(d["NewImage"])
            }
        )
    if event_name == "MODIFY":
        table.put_item(
            Item={
                'id': randint(0, 1000),
                'eventName': event_name,
                'eventSource': event_source,
                'NewImage': str(d["NewImage"]),
                'OldImage': str(d["OldImage"])
            }
        )
    if event_name == "REMOVE":
        table.put_item(
            Item={
                'id': randint(0, 1000),
                'eventName': event_name,
                'eventSource': event_source,
                'OldImage': str(d["OldImage"])
            }
        )
    return {
        'statusCode': 200,
        'body': {}
    }
