import axios from 'axios';

async function retrieveAndCreateNotionEntry(meetingId: string, gongAuthToken: string, notionAuthToken: string) {
  try {
    // Retrieve the Gong transcript
    const transcript = await retrieveGongTranscript(meetingId, gongAuthToken);

    // Create a new Notion entry with the transcript
    await createNotionEntry(transcript, notionAuthToken);

    console.log('Notion entry created successfully.');
  } catch (error) {
    console.error('Failed to create the Notion entry:', error);
  }
}

async function retrieveGongTranscript(
  meetingId: string,
  authToken: string
): Promise<string> {
  const gongApiUrl = `https://api.gong.io/v1/meetings/${meetingId}/transcript`;

  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  try {
    const response = await axios.get(gongApiUrl, { headers });

    // Extract the transcript from the response data
    const transcript = response.data.transcript;

    return transcript;
  } catch (error) {
    throw new Error(`Failed to retrieve the Gong transcript: ${error.message}`);
  }
}

async function createNotionEntry(transcript: string, authToken: string) {
  const databaseId = 'your-database-id'; // Replace with your actual Notion database ID

  const notionEndpoint = `https://api.notion.com/v1/pages`;
  const headers = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2021-05-13',
  };

  const requestBody = {
    parent: { database_id: databaseId },
    properties: {
      title: {
        title: [
          {
            text: {
              content: 'Gong Transcript Entry',
            },
          },
        ],
      },
      body: {
        rich_text: [
          {
            text: {
              content: transcript,
            },
          },
        ],
      },
    },
  };

  try {
    await axios.post(notionEndpoint, requestBody, { headers });
  } catch (error) {
    throw new Error(`Failed to create the Notion entry: ${error.message}`);
  }
}

// Usage example
const meetingId = '12345'; // Replace with the actual meeting ID
const gongAuthToken = process.env.GONG_AUTH; // Replace with your actual Gong authentication token
const notionAuthToken = process.eng.NOTION_AUTH; // Replace with your actual Notion authentication token
retrieveAndCreateNotionEntry(meetingId, gongAuthToken, notionAuthToken);
