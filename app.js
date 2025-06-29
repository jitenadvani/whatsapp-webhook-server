const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5678;

const ACCESS_TOKEN = 'EAAQSlT1AYOMBO0ralVNmpzWHRvDx8hAv8p6aOYpJ0b10nwDkdOyCULxybyNFbZC8tLZAANfBHE3oVIZAg1Fclz1eVBzc3wkjXLQbwwddNQsOzAKg9Y8BM38Asqy8JVZBJS5NRpnwbI9QBnZCLiQ2KbiUMLxhnFTy4FkVwLe9x4VcMTuJPpY9GmosnhsLRtodvNJWUKMoH4lp0ouFFbg6C5v5DIjaHl9CO3UhJZCS5p0ZC84mwZDZD';
const PHONE_NUMBER_ID = '732087066645473'; // Replace this with your actual Phone Number ID

app.use(express.json());

app.get('/webhook/meta-webhook-verify', (req, res) => {
  const VERIFY_TOKEN = "jitenToken";
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook Verified Successfully');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Verification failed. Token mismatch.');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

app.post('/webhook/meta-webhook-verify', async (req, res) => {
  console.log('📨 Webhook received:');
  console.dir(req.body, { depth: null });

  res.sendStatus(200);

  const entry = req.body.entry && req.body.entry[0];
  const changes = entry && entry.changes && entry.changes[0];
  const value = changes && changes.value;
  const messages = value && value.messages;

  if (messages && messages.length > 0) {
    const message = messages[0];
    const from = message.from;
    const msgBody = message.text && message.text.body;

    console.log(`Message from ${from}: ${msgBody}`);

    const replyText = `Hi! You said: "${msgBody}". This is an auto-reply from your bot.`;

    try {
      await axios.post(
        `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: replyText }
        },
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Auto-reply sent');
    } catch (error) {
      console.error('❌ Error sending message:', error.response ? error.response.data : error.message);
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
