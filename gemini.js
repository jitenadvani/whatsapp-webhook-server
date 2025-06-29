const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Replace with your actual API key
const genAI = new GoogleGenerativeAI("AIzaSyCN0R0Nj4O9e0m6C_U8E47beUZF6nN8zXs");

async function getGeminiReply(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: userMessage }] }]
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Gemini AI Error:", error.message);
    return "Sorry! I'm having trouble replying right now.";
  }
}

module.exports = { getGeminiReply };
