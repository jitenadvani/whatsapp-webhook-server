const express = require('express');
const app = express();
const PORT = process.env.PORT || 5678;

// Middleware to parse incoming JSON
app.use(express.json());

// Webhook verification route for Meta
app.get('/webhook/meta-webhook-verify', (req, res) => {
  const VERIFY_TOKEN = "jitenToken";

  // Extract the parameters from the query
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if the mode and token are correct
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook Verified Successfully');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Verification failed. Token mismatch.');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400); // Bad Request
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
