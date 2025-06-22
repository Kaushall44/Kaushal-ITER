const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Try different model names - Gemini model names have changed over time
const MODEL_NAMES = [
    "gemini-2.5-flash"
];

let model;

// System prompt for code-only responses
const SYSTEM_PROMPT = "You are a java code generator. Respond only with clean code. No explanations, no comments, no markdown formatting, no code blocks. Write simple, straightforward code that works. Do not include any text before or after the code. Just return the raw code. Make sure to include the main method and the main class should not be public use only class Name and inside it public static void main(String[] args){//code goes here}. Also u are allowed to use multiple methods and classes but keep it in the same file unless asked specifically to use different packages in that case before each class include the name of file and folder for the class below it.";

// Function to initialize the model by trying different names
async function initializeModel() {
    for (const modelName of MODEL_NAMES) {
        try {
            console.log(`Trying model: ${modelName}`);
            const testModel = genAI.getGenerativeModel({ model: modelName });
            
            // Test the model with a simple query
            await testModel.generateContent("Hi");
            
            console.log(`✓ Successfully initialized model: ${modelName}`);
            model = testModel;
            return true;
        } catch (error) {
            console.log(`✗ Model ${modelName} failed: ${error.message}`);
        }
    }
    return false;
}

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Gemini Backend Server is running! Use /ask?q=your-question to query AI.');
});

// Main ask endpoint
app.get('/ask', async (req, res) => {
    try {
        const question = req.query.q;
        
        // Validate question parameter
        if (!question || question.trim() === '') {
            return res.status(400).send('Error: Missing question parameter. Use ?q=your-question');
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).send('Error: GEMINI_API_KEY not configured');
        }

        // Check if model is initialized
        if (!model) {
            return res.status(500).send('Error: No working model found. Check server logs.');
        }

        // Combine system prompt with user question
        const fullPrompt = `${SYSTEM_PROMPT}\n\nUser request: ${question}`;
        
        // Generate response from Gemini
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Return plain text response for clean terminal output
        res.set('Content-Type', 'text/plain');
        res.send(text);

    } catch (error) {
        console.error('Error processing request:', error);
        
        // Handle specific error types
        if (error.message.includes('API_KEY_INVALID')) {
            return res.status(401).send('Error: Invalid API key');
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
            return res.status(429).send('Error: API quota exceeded');
        } else if (error.message.includes('SAFETY')) {
            return res.status(400).send('Error: Content blocked by safety filters');
        } else {
            return res.status(500).send('Error: Failed to process request');
        }
    }
});

// Start server and initialize model
app.listen(PORT,'0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Usage: curl "http://localhost:${PORT}/ask?q=your-question"`);
    
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
        console.warn('WARNING: GEMINI_API_KEY environment variable not set!');
        console.warn('Create a .env file with: GEMINI_API_KEY=your-api-key');
        return;
    }
    
    // Initialize the model
    console.log('\nInitializing Gemini model...');
    const success = await initializeModel();
    
    if (!success) {
        console.error('❌ Failed to initialize any Gemini model. Please check:');
        console.error('   1. Your API key is valid');
        console.error('   2. Your API has access to Gemini models');
        console.error('   3. Check Google AI Studio for available models');
    } else {
        console.log('🚀 Server ready to accept requests!');
    }
});
