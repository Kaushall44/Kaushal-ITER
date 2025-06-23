// api/ask.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

let model; // For caching in serverless

const SYSTEM_PROMPT = "You are a java code generator. Respond only with clean code. No explanations, no comments, no markdown formatting, no code blocks. Write simple, straightforward code that works. Do not include any text before or after the code. Just return the raw code. Make sure to include the main method and the main class should not be public use only class Name and inside it public static void main(String[] args){//code goes here}. Also u are allowed to use multiple methods and classes but keep it in the same file unless asked specifically to use different packages in that case before each class include the name of file and folder for the class below it.";

const MODEL_NAME = "gemini-2.5-flash";

async function getModel(apiKey) {
  if (!model) {
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: MODEL_NAME });
    // Optionally: await model.generateContent("Hi"); // To test
  }
  return model;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const question = req.query.q;
  if (!question || question.trim() === '') {
    res.status(400).send('Error: Missing question parameter. Use ?q=your-question');
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).send('Error: GEMINI_API_KEY not configured');
    return;
  }

  try {
    const model = await getModel(apiKey);
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser request: ${question}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: Failed to process request');
  }
};