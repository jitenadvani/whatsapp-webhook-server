const { GoogleGenerativeAI } = require('@google/generative-ai');

// ✅ Use your actual Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyDf0ao3YBthEmUTYg0Mz4MSyBP7cy661SA");

async function getGeminiReply(userMessage) {
  const model = genAI.getGenerativeModel({
    model: "models/gemini-1.5-flash",  // ✅ Correct model name
  });

  const result = await model.generateContent(userMessage);
  const response = await result.response;
  return response.text();
}

module.exports = { getGeminiReply };
