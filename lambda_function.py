import json
from datetime import datetime, timezone
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('GymProgress')  # Replace with your table name

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))

        user_id = body.get("user_id")
        exercise = body.get("exercise")
        sets = body.get("sets")
        reps = body.get("reps")
        workout_id = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc).isoformat()

        item = {
            "user_id": user_id,
            "workout_id": workout_id,
            "exercise": exercise,
            "sets": sets,
            "reps": reps,
            "timestamp": timestamp
        }

        # Try writing to DynamoDB
        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "headers": { "Content-Type": "application/json" },
            "body": json.dumps({
                "message": "Workout logged successfully!",
                "data": item
            })
        }
    
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e)
            })
        }