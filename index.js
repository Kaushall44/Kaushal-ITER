const express = require('express');
const OpenAI = require('openai');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client with Groq configuration
const openai = new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY
});

// System prompt for code-only responses
const SYSTEM_PROMPT = "You are a java, python and assembly language (MSME x82 bit) code generator. Respond only with complete, fully functional code. Do not shorten or truncate the code. Do not use placeholders like '// ... rest of code'. Write the full code every time. No markdown formatting, no code blocks, just raw code. Do not include any text before or after the code. If multiple files are needed, output them sequentially with a comment separator.";

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Groq Backend Server is running! Use /ask?q=your-question to query AI.');
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
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).send('Error: GROQ_API_KEY not configured');
        }

        // Generate response from Groq
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: question }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const text = completion.choices[0].message.content;

        const filename = req.query.filename;
        if (filename) {
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'text/plain');
            res.send(text);
        } else {
            // Return plain text response for clean terminal output
            res.set('Content-Type', 'text/plain');
            res.send(text);
        }

    } catch (error) {
        console.error('Error processing request:', error);

        // Handle specific error types
        if (error.status === 401) {
            return res.status(401).send('Error: Invalid API key');
        } else if (error.status === 429) {
            return res.status(429).send('Error: API quota exceeded or rate limit');
        } else {
            return res.status(500).send(`Error: Failed to process request - ${error.message}`);
        }
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Usage: curl "http://localhost:${PORT}/ask?q=your-question"`);

    if (!process.env.GROQ_API_KEY) {
        console.warn('WARNING: GROQ_API_KEY environment variable not set!');
    } else {
        console.log('🚀 Server ready to accept requests using Groq API!');
    }
});
