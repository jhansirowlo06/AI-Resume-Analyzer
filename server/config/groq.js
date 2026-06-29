const Groq = require("groq-sdk");

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing in .env");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = groq;