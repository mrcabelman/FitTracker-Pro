import json
import boto3
import datetime
import decimal
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('GymProgress')  # ⬅️ Replace with your actual table name

# Fix Decimal serialization issue
def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

def lambda_handler(event, context):
    print("Raw event:", json.dumps(event))
    
    cors_headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
    }

    try:
        method = event.get("requestContext", {}).get("http", {}).get("method", "")
        print("HTTP Method:", method)

        if method == "POST":
            body = event.get("body")
            if isinstance(body, str):
                data = json.loads(body)
            else:
                data = body or {}

            print("Parsed POST body:", data)

            required_fields = ['user_id', 'exercise', 'sets', 'reps']
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")

            item = {
                'user_id': data['user_id'],
                'exercise': data['exercise'],
                'sets': int(data['sets']),
                'reps': int(data['reps']),
                'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                'notes': data.get('notes', '')
            }

            table.put_item(Item=item)

            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({
                    "message": "Workout logged successfully!",
                    "data": item
                }, default=decimal_default)
            }

        elif method == "GET":
            user_id = event.get('queryStringParameters', {}).get('user_id')
            if not user_id:
                raise ValueError("Missing user_id")

            print("Querying workouts for:", user_id)

            response = table.query(
                KeyConditionExpression=Key('user_id').eq(user_id)
            )

            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({
                    "workouts": response.get("Items", [])
                }, default=decimal_default)
            }

        else:
            return {
                "statusCode": 405,
                "headers": cors_headers,
                "body": json.dumps({ "message": "Method Not Allowed" })
            }

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {
            "statusCode": 500,
            "headers": cors_headers,
            "body": json.dumps({ "message": "Internal Server Error", "error": str(e) })
        }