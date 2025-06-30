require('dotenv').config();
const axios = require('axios');

// ✅ Use API key from .env file
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function getClaudeReply(userMessage) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3.5-haiku",
        messages: [
          {
            role: "system",
            content: "You are a helpful, polite salon assistant. Assist users with booking appointments, prices, services, and general queries clearly and briefly."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    return response?.data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("❌ Claude AI Error:", error.response?.data || error.message);
    return "Sorry! I'm having trouble replying right now.";
  }
}

module.exports = { getClaudeReply };
