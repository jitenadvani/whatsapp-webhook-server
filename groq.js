require('dotenv').config();
const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL;

async function getGroqReply(userMessage) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful salon assistant. Help users with appointments, services, and questions politely."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    return response?.data?.choices?.[0]?.message?.content?.trim() || "Sorry, no reply available.";
  } catch (error) {
    console.error("❌ Groq AI Error:", error.response?.data || error.message);
    return "Sorry! I can't reply right now.";
  }
}

module.exports = { getGroqReply };
