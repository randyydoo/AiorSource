import boto3
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

class Handler:
    def __init__(self, table_name,  topic):
        self.dyn_resource = boto3.resource("dynamodb")
        self.table_name = table_name
        self.topic = topic
        self.table = None
        self.assign_table()

    def assign_table(self):
        """
        Assigns table if self.table_name is valid
        """
        try:
            table = self.dyn_resource.Table(self.table_name)
            table.load()
            self.table = table
        except ClientError as err:
            logger.error(
                "Couldn't check for existence of %s. Here's why: %s: %s",
                self.table_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            return None
        
    def get_text(self):
        try:
            response = self.table.get_item(Key={"topic": self.topic})
            return response["Item"] # {sourceText: [], aiText: []}
        except ClientError as err:
                logger.error(
                    "Couldn't get sport %s from table %s. Here's why: %s: %s",
                    self.topic,
                    "sports table",
                    err.response["Error"]["Code"],
                    err.response["Error"]["Message"],
                )
                raise
