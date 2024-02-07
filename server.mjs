import express from 'express';
import cron from 'node-cron';
import fetch from 'node-fetch';

const app = express();
const port = 3005;

// Replace with your actual Facebook page ID and access token
const pageId = '213873688481509';
const accessToken = 'EAANB2YJLSy4BOyV3tmt6SekIMHopVeDdQQ4q8sE7VbP1LyoYi8kbdiMDZAaUKpXLEl6v6C4bd2f95aZCtusH8mMFOWuZABaeRRQiBM641iyCL2jO5E7eNZADwLQ5Ov1v4ldVlG0eh8ZAhYkCP1FGwxH0RbdTk8oGFfv8laPnenRW1SAr6ctxetVtCfCGqOkwZD';
const apiUrl = `https://graph.facebook.com/v19.0/${pageId}/feed`;

let sharedPostCount = 0;

// Function to fetch a random quote
async function getRandomQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();

    if (response.ok) {
      return data.content;
    } else {
      throw new Error(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error fetching random quote:', error.message);
  }
}

// Function to share the current quote on Facebook
async function shareOnFacebook(quote) {
  const postData = {
    message: quote,
    published: true
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(postData)
    });

    const data = await response.json();

    console.log('Post response:', data);
  } catch (error) {
    console.error('Error posting to Facebook:', error.message);
  }
}

// Schedule a task to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  const newQuote = await getRandomQuote();
  sharedPostCount++;
  shareOnFacebook(newQuote);
  console.log(`Scheduled post - Post ${sharedPostCount} has been shared.`);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
