const express = require('express');
const app = express();
const PORT = process.env.PORT || 5678;

app.use(express.json()); // Middleware to parse incoming JSON

// Webhook verification route for Meta
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

// NEW: POST handler to receive messages
app.post('/webhook/meta-webhook-verify', (req, res) => {
  console.log('📨 Webhook received:');
  console.dir(req.body, { depth: null });

  res.sendStatus(200); // Respond to Meta
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
