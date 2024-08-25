const { DynamoDBClient, GetItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB Client and DocumentClient
const client = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDb = DynamoDBDocumentClient.from(client);

// Table names
const COMMENTS_TABLE_NAME = "Comments";
const TRANSCRIPTS_TABLE_NAME = "Transcipts"; // Corrected table name

const getTranscriptSummary = async (req, res) => {
    const transcriptId = req.params.transcriptId;

    try {
        // Fetch transcript data from DynamoDB
        const transcriptParams = {
            TableName: TRANSCRIPTS_TABLE_NAME,
            Key: {
                transcriptId: { S: transcriptId }
            }
        };

        const transcriptCommand = new GetItemCommand(transcriptParams);
        const transcriptResult = await dynamoDb.send(transcriptCommand);
        const transcript = transcriptResult.Item;

        if (!transcript) {
            return res.status(404).json({ message: 'Transcript not found' });
        }

        // Fetch comments from DynamoDB
        const commentsParams = {
            TableName: COMMENTS_TABLE_NAME,
            KeyConditionExpression: "transcriptId = :transcriptId",
            ExpressionAttributeValues: {
                ":transcriptId": { S: transcriptId }
            }
        };

        const commentsCommand = new QueryCommand(commentsParams);
        const commentsResult = await dynamoDb.send(commentsCommand);
        const comments = commentsResult.Items;

        // Combine transcript and comments
        const combinedData = {
            transcript: transcript,
            comments: comments
        };

        // Return the combined data
        res.json(combinedData);

    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve data', details: error.message });
    }
};

module.exports = {
    getTranscriptSummary
};