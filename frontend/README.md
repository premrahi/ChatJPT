# ChatJPT: Frontend

The chat interface for ChatJPT: a dark-mode, single-page UI built with React and TypeScript. It sends messages to the [backend](../backend/README.md) and renders the assistant's replies as Markdown.

## Features

- **Chat interface** with user and assistant message bubbles
- **Markdown rendering** for replies (lists, tables, code, links) via `react-markdown` and `remark-gfm`
- **Keyboard-friendly input:** Enter sends, Shift+Enter inserts a new line
- **Input guards:** empty messages are ignored and the Ask button is disabled while a reply is loading, which prevents double sends
- **Loading indicator:** an animated "Thinking…" state while the backend works
- **Error handling:** a friendly message appears in the chat if a request fails
- **Per-session conversation:** a unique `threadId` is created with `crypto.randomUUID()` on load, so the backend keeps the context of your chat

## Tech stack

- **React 19** and **TypeScript**
- **Vite**: dev server and build tool
- **Tailwind CSS v4** (via `@tailwindcss/vite`) with the typography plugin
- **Axios**: HTTP client
- **react-markdown** and **remark-gfm**: Markdown rendering
- **Oxlint**: linting

## Project structure

```
frontend/
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Root layout
│   ├── components/
│   │   └── Body.tsx        # Chat UI, state and API call
│   ├── index.css           # Tailwind import
│   └── App.css
├── public/                 # Static assets (favicon, icons)
├── index.html
├── vite.config.ts
└── package.json
```

## Setup

The backend must be running first. See [`../backend/README.md`](../backend/README.md).

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Type-check with `tsc` and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the code with Oxlint |

## How it talks to the backend

All chat logic is in `src/components/Body.tsx`.

1. When the component mounts, it creates a `threadId` once with `crypto.randomUUID()`.
2. When you send a message, it is added to the chat immediately and a request is sent:

   ```ts
   axios.post("http://localhost:4000/chat", { message, threadId });
   ```

3. The backend replies with `{ success: "ok", response: "..." }`.
4. `response` is added as an assistant message and rendered as Markdown.
5. If the request fails, a fallback message is shown instead and the input unlocks again.

Messages are typed in TypeScript:

```ts
type Message = {
  role: "user" | "assistant";
  content: string;
};
```

## Changing the API URL

The backend URL is currently hardcoded in the `callServer` function in `src/components/Body.tsx`. To point the UI at a different server, change it there. A cleaner setup is to read it from a Vite environment variable (for example `import.meta.env.VITE_API_URL`) so it can differ between development and production.

## Known limitations

- The API URL is hardcoded to `http://localhost:4000`.
- Replies appear all at once; there is no streaming.
- The chat doesn't auto-scroll to the newest message.
- Conversations aren't persisted, so refreshing the page starts a new thread.