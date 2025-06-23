# Gemini Backend Server

A simple Express.js backend server that connects to Google's Gemini API for terminal-based AI queries.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API key:**
   - Copy `.env.example` to `.env`
   - Add your Gemini API key to the `.env` file:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## Usage

### Option 1: Simple Windows Batch Script (Recommended)
Use the included `ask.bat` script for clean output:

```cmd
ask "What is artificial intelligence?"
ask "Write a Python hello world program"
ask "Explain quantum computing in simple terms"
```

### Option 2: Direct curl (shows HTTP headers)
```bash
curl "http://localhost:3000/ask?q=What is artificial intelligence?"
```

### Option 3: Clean curl (silent mode)
```bash
curl -s "http://localhost:3000/ask?q=What is artificial intelligence?"
```

### Remote Server Query
```bash
curl -s "http://your-domain.com:3000/ask?q=Write a hello world program in Python"
```

## API Endpoints

- `GET /` - Health check endpoint
- `GET /ask?q=question` - Main query endpoint that returns AI response as plain text

## Response Format

The server returns plain text responses for clean terminal output. No JSON parsing required.

## Features

- **Auto-model detection**: Automatically finds the correct Gemini model for your API key
- **Multiple model support**: Tries different model names (gemini-1.5-flash, gemini-1.5-pro, etc.)
- **Clean terminal output**: Plain text responses without HTTP headers
- **Comprehensive error handling**: Invalid API keys, quota limits, safety filters
- **Windows batch script**: Simple `ask.bat` for easy querying

## Error Handling

The server handles various error scenarios:
- Missing question parameter
- Invalid API key
- API quota exceeded
- Content blocked by safety filters
- General API errors

## Deployment

This backend can be deployed to any platform that supports Node.js:
- Vercel
- Railway
- Heroku
- VPS/Cloud instances

Make sure to set the `GEMINI_API_KEY` environment variable in your deployment platform!
