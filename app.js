const express = require('express');
const axios = require('axios');
const { getGeminiReply } = require('./gemini');  // <-- import Gemini AI

const app = express();
app.use(express.json());

const token = "EAAQSlT1AYOMBO83GjfUgSfOKgw6lnMF940mKb0bnfYqBVuwnA2ZCc0Br3yyYgRZA3YjERQ1YQUsrdp6qTIYgNv17xabGZCr0izCoEcR1O4Ct8j44sZBkP2kjZCZANp9Sep62J4JMgKMkezYaFbAyaIkc2FRBYZAdKHx0gsa6Gf8OKbwGhjNCcZAU780204WDu41mUo1flsXbJnaRGn1JNBRiJPv5aQlhzL17XaBuj9CXKnsyW98ZD";
const phone_number_id = "732087066645473"; // your test number ID

// ✅ Webhook verification (GET request for Meta)
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

// ✅ WhatsApp message handler (POST)
app.post('/webhook/meta-webhook-verify', async (req, res) => {
  const body = req.body;

  console.log("📨 Webhook received:");
  console.dir(body, { depth: null });

  if (
    body.object &&
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages[0]
  ) {
    const msg = body.entry[0].changes[0].value.messages[0];
    const from = msg.from;
    const userMessage = msg.text?.body;

    if (userMessage) {
      try {
        const botReply = await getGeminiReply(`User said: ${userMessage}. Reply like a helpful salon assistant.`);
        
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
      } catch (error) {
        console.error("❌ Gemini AI Error:", error.message);
      }
    }
  }

  res.sendStatus(200);
});

// ✅ Let Render detect and use correct port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
