require('dotenv').config(); // Make sure this is at the top
const express = require('express');
const axios = require('axios');
const { getOpenAIReply } = require('./openai'); // ✅ Changed function name and file name

const app = express();
app.use(express.json());

// ✅ Load WhatsApp credentials from .env
const token = process.env.WHATSAPP_TOKEN;
const phone_number_id = process.env.PHONE_NUMBER_ID;

// ✅ Webhook Verification
app.get('/webhook/meta-webhook-verify', (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const verify_token = req.query["hub.verify_token"];

  if (mode === "subscribe" && verify_token === "jitenToken") {
    console.log("✅ Webhook Verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Webhook Message Handler
app.post('/webhook/meta-webhook-verify', async (req, res) => {
  const body = req.body;
  console.log("📨 Webhook received:");
  console.dir(body, { depth: null });

  const msg = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const from = msg?.from;
  const userMessage = msg?.text?.body;

  if (msg?.type !== "text" || !userMessage) {
    console.log("⚠️ Ignored non-text or empty message.");
    return res.sendStatus(200);
  }

  try {
    const botReply = await getOpenAIReply(
      `User said: ${userMessage}. Reply as a smart and polite salon assistant offering help with booking or services.`
    );

    await axios.post(
      `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: botReply },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`📤 Reply sent to ${from}: ${botReply}`);
  } catch (error) {
    console.error("❌ OpenAI Error:", error.message); // ✅ Updated error label

    await axios.post(
      `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: "Sorry! I'm having trouble replying right now. Please try again later." },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  res.sendStatus(200);
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
