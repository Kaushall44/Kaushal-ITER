# AI Backend Server (Groq Edition)

A simple Express.js backend server that connects to **Groq API** (`llama-3.3-70b-versatile`) for ultra-fast, terminal-based code generation.

## Features

- **Groq API Integration**: Uses the fast Llama 3 models.
- **Client Script**: `ask.js` handles output formatting and prevents truncation.
- **Server-Side File Creation**: Can save generated code correctly to a file on the server.
- **Vercel Ready**: Includes configuration for easy deployment.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API key:**
   - Create `.env` file
   - Add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## Usage

### 1. Terminal Query (Recommended)
Use the included `ask.js` script to get clean, full output:

```bash
node ask.js "write a factorial function in python"
```

### 2. Save Code to File (Server-Side)
To save the generated code directly to a file on the server (or local disk if running locally):

```bash
curl "http://localhost:3000/ask?q=write%20a%20hello%20world%20in%20python&filename=hello.py"
```

*Note: On Vercel, this will write to the ephemeral server file system, so you won't be able to access the file easily unless you return it. For Vercel deployments, use the terminal query method or `curl > file.py`.*

### 3. Vercel Deployment

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Add the environment variable `GROQ_API_KEY` in Vercel project settings.
4. Redeploy.

## API Endpoints

- `GET /` - Health check endpoint
- `GET /ask?q=question` - Returns plain text response
- `GET /ask?q=question&filename=name.ext` - Saves code to file (returns confirmation message)
