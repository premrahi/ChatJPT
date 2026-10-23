# ChatJPT: Backend

The Express API behind ChatJPT. It receives chat messages, keeps a conversation history per thread, and runs an LLM (Groq `openai/gpt-oss-120b`) with a Tavily-powered `webSearch` tool so the assistant, **Jarvis**, can answer questions that need up-to-date information.

## Tech stack

- **Node.js** with ES modules
- **Express 5**: HTTP server and routing
- **groq-sdk**: LLM chat completions with tool calling
- **@tavily/core**: web search
- **node-cache**: in-memory conversation history with a TTL
- **dotenv**, **cors**, **tsx** (dev runner)

## Project structure

```
backend/
├── server.js          # Express app: CORS, JSON body parsing, /health, mounts /chat
├── routes/
│   └── chatRoute.js   # POST /chat: validates the body, calls generate()
├── assets/
│   └── chatbot.js     # generate(): system prompt, tool-calling loop, thread memory
├── app.js             # Original terminal chatbot (CLI prototype)
├── package.json
└── .env               # Your API keys (not committed)
```

## Setup

```bash
cd backend
npm install
```

Create a `.env` file in this folder:

```env
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```

| Variable | Purpose | Where to get it |
| --- | --- | --- |
| `GROQ_API_KEY` | Authenticates requests to the Groq LLM API | [console.groq.com](https://console.groq.com/) |
| `TAVILY_API_KEY` | Authenticates web searches | [tavily.com](https://tavily.com/) |

`.env` is listed in `.gitignore`, so your keys are never committed.

## Running

```bash
npm run dev
```

This runs `tsx watch server.js`, which restarts the server when files change. The API listens on **http://localhost:4000**.

### Terminal version

The original CLI prototype is still included. It runs the same tool-calling loop in your terminal, with a single shared conversation:

```bash
node app.js
```

Type `bye` to exit.

## API

### `GET /health`

Returns a simple status message.

```json
{ "message": "server is running fine" }
```

### `POST /chat`

Sends a user message to a conversation thread and returns the assistant's reply.

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | yes | The user's message |
| `threadId` | string | yes | Identifies the conversation. Reuse it to continue a chat; use a new one to start fresh. |

**Success: `200`**

```json
{ "success": "ok", "response": "The capital of France is Paris." }
```

**Missing `message` or `threadId`: `400`**

Returns a JSON object with a `message` field describing the problem.

**Example**

```bash
curl -X POST http://localhost:4000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the capital of France?", "threadId": "demo-1"}'
```

## How a reply is generated

The logic lives in `assets/chatbot.js`, in the `generate(userMessage, threadId)` function.

1. **Load the thread.** The history for `threadId` is read from the cache. If none exists, a new conversation starts with the system prompt.
2. **Add the user message** to the history.
3. **Call the model** with the full history and the `webSearch` tool definition (`tool_choice: "auto"`).
4. **Check the reply.**
   - If the model returns a final answer, the updated history is saved and the answer is returned.
   - If the model requests `webSearch`, the query runs through Tavily, the combined result text is appended as a `tool` message, and the model is called again.
5. **Stop safely.** After 10 iterations without a final answer, the function returns a fallback message instead of looping forever.

### System prompt

The prompt defines Jarvis as a polite assistant and gives short examples of when to answer directly and when to search. It also includes the current UTC date and time, so questions about "now" or "today" are handled correctly.

### Configuration

| Setting | Value | Location |
| --- | --- | --- |
| Model | `openai/gpt-oss-120b` | `assets/chatbot.js` |
| Temperature | `0` | `assets/chatbot.js` |
| Tool choice | `auto` | `assets/chatbot.js` |
| Max loop iterations | `10` (`MAX_RETRIES`) | `assets/chatbot.js` |
| Thread memory TTL | 24 hours | `assets/chatbot.js` |
| Port | `4000` | `server.js` |

## Troubleshooting

- **`ERR_MODULE_NOT_FOUND` when running `node server.js`:** the project uses extensionless relative imports, which `tsx` resolves. Start the server with `npm run dev`.
- **Requests fail or return errors:** check that both keys are set in `.env` and that you restarted the server after editing it.
- **The frontend can't reach the API:** make sure the backend is running on port 4000 and nothing else is using that port.

## Known limitations

- Thread history is stored in memory, so it resets when the server restarts and isn't shared between instances.
- Raw search results remain in each thread's history, so long conversations use more tokens over time.
- Responses are returned in one piece rather than streamed.
- There is no authentication or rate limiting.