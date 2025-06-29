const express = require('express');
const axios = require('axios');
const { getClaudeReply } = require('./claude');  // Import Claude function

const app = express();
app.use(express.json());

// ✅ REQUIRED WhatsApp credentials
const token = "EAAQSlT1AYOMBO83GjfUgSfOKgw6lnMF940mKb0bnfYqBVuwnA2ZCc0Br3yyYgRZA3YjERQ1YQUsrdp6qTIYgNv17xabGZCr0izCoEcR1O4Ct8j44sZBkP2kjZCZANp9Sep62J4JMgKMkezYaFbAyaIkc2FRBYZAdKHx0gsa6Gf8OKbwGhjNCcZAU780204WDu41mUo1flsXbJnaRGn1JNBRiJPv5aQlhzL17XaBuj9CXKnsyW98ZD";
const phone_number_id = "732087066645473"; // Your test/real phone number ID

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
    const botReply = await getClaudeReply(
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
    console.error("❌ Claude AI Error:", error.message);

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











