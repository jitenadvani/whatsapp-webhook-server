require('dotenv').config();
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function getOpenAIReply(userMessage) {
  try {
    console.log("🔑 Using model:", process.env.OPENROUTER_MODEL);
    console.log("🔐 Using API key prefix:", OPENROUTER_API_KEY?.slice(0, 10) + "...");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL, // ✅ dynamic from .env
        messages: [
          {
            role: "system",
            content: "You are a helpful salon assistant. Help users with appointments, services, prices, etc., politely."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    return response?.data?.choices?.[0]?.message?.content?.trim() || "Sorry, no reply available.";
  } catch (error) {
    console.error("❌ OpenAI Error:", error.response?.data || error.message);
    return "Sorry! I can't reply right now.";
  }
}

module.exports = { getOpenAIReply };
