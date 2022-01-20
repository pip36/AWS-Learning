import json


def handle(event, context):
    print("Triggered", event)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "Message": "ok" 
        })
    }