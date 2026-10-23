import axios from "axios";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  content: string;
};



const Body = () => {
  const [query, setQuery] = useState<string>("");
  const [message, setMessage] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [threadId] = useState(() => crypto.randomUUID());
  function handleClick() {
    const text = query.trim();
    if (!text || loading) return; // ignore empty input and double-sends

    setMessage((prev) => [...prev, { role: "user", content: text }]);
    setQuery("");
    generate(text);
  }

  const generate = async (queryText: string) => {
    setLoading(true);
    try {
      // send the text to the server, then append the reply to the chat
      const reply = await callServer(queryText);
      setMessage((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error("error:", e);
      setMessage((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      // runs on success and on failure
      setLoading(false);
    }
  };

  async function callServer(inputText: string): Promise<string> {
    const response = await axios.post("http://localhost:4000/chat", {
      message: inputText, threadId  : threadId
    });
    return response.data.response; // must match the key your server sends
  }

  return (
    <div className="text-white bg-neutral-900 h-screen w-screen fixed overflow-x-hidden [&::-webkit-scrollbar]:hidden">
      <div className="container p-3 bg-neutral-900 mx-auto my-20 max-w-3xl pb-32">
        {/* chat messages */}
        {message.map((m, i) =>
          m.role === "user" ? (
            <div
              key={i}
              className="bg-gray-800 p-3 ml-auto max-w-fit rounded-xl my-4"
            >
              <h4>{m.content}</h4>
            </div>
          ) : (
            <div key={i} className="my-4 max-w-fit bg-gray-700 p-3 rounded-2xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </div>
          ),
        )}

        {/* loading indicator */}
        {loading && (
          <div className="my-4 flex gap-1 w-fit items-end-safe  p-3 rounded-2xl">
            <h1>Thinking  </h1>
            <span className="size-1 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
            <span className="size-1 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
            <span className="size-1 rounded-full bg-white animate-bounce" />
          </div>
        )}
      </div>

      {/* input textarea */}
      <div className="fixed inset-x-0 bottom-0 flex justify-center items-center bg-neutral-900 p-4">
        <div className="bg-gray-800 rounded-2xl w-full p-4 max-w-3xl mb-5">
          <textarea
            className="w-full resize-none outline-0 [&::-webkit-scrollbar]:hidden"
            rows={2}
            placeholder="Hi, how can I help you?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // stops the newline from being inserted
                handleClick();
              }
            }}
          />
          <div className="flex justify-end">
            <button
              className="bg-white font-semibold text-black hover:bg-amber-300 px-3 py-1 rounded-2xl disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed"
              onClick={handleClick}
              disabled={loading}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
