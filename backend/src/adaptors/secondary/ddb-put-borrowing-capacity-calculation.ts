import { InternalError } from '@/errors/InternalError';
import { PutBorrowingCapacityCalculationPort } from '@/ports/secondary/DynamoDBPutBorrowingCapacityCalculation';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Config } from 'sst/node/config';

const dynamoDbClient = new DynamoDBClient();

export const putBorrowingCapacityCalculation: PutBorrowingCapacityCalculationPort =
  async ({
    borrowingCapacityCalculationId,
    borrowerEmail,
    estimatedBorrowingCapacity,
    timestamp,
    grossAnnualIncome,
    employmentStatus,
  }) => {
    try {
      await dynamoDbClient.send(
        new PutItemCommand({
          TableName: Config.FINANCIAL_DATA_TABLE_NAME,
          Item: marshall({
            pk: borrowerEmail,
            sk: `BORROWING_CAPACITY_CALCULATION#${borrowingCapacityCalculationId}#TIMESTAMP#${timestamp}`,
            estimatedBorrowingCapacity,
            grossAnnualIncome,
            employmentStatus,
            borrowingCapacityCalculationId,
            timestamp,
          }),
        })
      );
    } catch (e) {
      throw new InternalError(
        'Failed to put borrowing capacity calculation to financial data table'
      );
    }
  };
