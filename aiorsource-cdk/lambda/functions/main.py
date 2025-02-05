import json
import boto3
from botocore.exceptions import ClientError
import logging
from handler import Handler


logger = logging.getLogger(__name__)


def handler(event, context):
    payload = json.loads(event["body"])
    topic = payload["topic"]

    valid_origins = ['http://localhost:5173', "https://aiorsource.vercel.app", "https://wikiguess.vercel.app", "https://wiki-guess-git-dev-randy-dos-projects.vercel.app"]
    origin = event["headers"]["origin"] if event["headers"]["origin"] in valid_origins else ''
    try:
        source_and_ai_texts = []
        driver = Handler("TopicsTable", topic)
        source_and_ai_texts = driver.get_text()
    except ClientError as err:
        logger.error(
                "Couldn't check for existence of %s. Here's why: %s: %s",
                "topics table",
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
    

    response = {
    'statusCode': 200,
    "headers": {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
  },
    'body': json.dumps(source_and_ai_texts)
    }
    return response
