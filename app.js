const express = require('express');
const axios = require('axios');
const { getGeminiReply } = require('./gemini');  // <-- import Gemini AI

const app = express();
app.use(express.json());

const token = "EAAQSlT1AYOMBO83GjfUgSfOKgw6lnMF940mKb0bnfYqBVuwnA2ZCc0Br3yyYgRZA3YjERQ1YQUsrdp6qTIYgNv17xabGZCr0izCoEcR1O4Ct8j44sZBkP2kjZCZANp9Sep62J4JMgKMkezYaFbAyaIkc2FRBYZAdKHx0gsa6Gf8OKbwGhjNCcZAU780204WDu41mUo1flsXbJnaRGn1JNBRiJPv5aQlhzL17XaBuj9CXKnsyW98ZD";
const phone_number_id = "732087066645473"; // your test number ID

app.post('/webhook/meta-webhook-verify', async (req, res) => {
  const body = req.body;

  console.log("📨 Webhook received:");
  console.dir(body, { depth: null });

  // If it's a real message
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
      const botReply = await getGeminiReply(`User said: ${userMessage}. Reply like a helpful salon assistant.`);

      // Send the reply via WhatsApp
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
    }
  }

  res.sendStatus(200);
});

// ✅ Add this to make Render detect the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
