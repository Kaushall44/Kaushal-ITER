# AI Backend Server (Groq Edition)

A simple Express.js backend server that connects to **Groq API** (`llama-3.3-70b-versatile`) for ultra-fast, terminal-based code generation.

## Features

- **Groq API Integration**: Uses the fast Llama 3 models.
- **Client Script**: `ask.js` handles output formatting and prevents truncation in PowerShell.
- **File Download Support**: Support for saving generated code to a file via Vercel or local server.
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

### 1. Terminal Query
Use the included `ask.js` script to get clean, full output:

```bash
node ask.js "write a factorial function in python"
```

### 2. Save Code to File (Vercel & Local)
To download the generated code to a file:

**Git Bash / Mac / Linux:**
```bash
curl -OJ "https://your-app.vercel.app/ask?q=write%20function&filename=code.py"
```

**Windows PowerShell:**
Use `curl.exe` explicitly to avoid the PowerShell alias:
```powershell
curl.exe -OJ "https://your-app.vercel.app/ask?q=write%20function&filename=code.py"
```

Or use the PowerShell native command:
```powershell
Invoke-WebRequest "https://your-app.vercel.app/ask?q=write%20function&filename=code.py" -OutFile "code.py"
```

## Vercel Deployment

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Add the environment variable `GROQ_API_KEY` in Vercel project settings.
4. Redeploy.

## API Endpoints

- `GET /ask?q=question` - Returns plain text answer.
- `GET /ask?q=question&filename=file.ext` - Downloads the answer as a file.
