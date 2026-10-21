import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Body = () => {
  const [query, setQuery] = useState<string>("");
  const [message, setMessage] = useState<Message[]>([]);

  function handleClick() {
    if (!query) {
      return;
    }

    const text = query.trim();
    console.log(text);

    setMessage((prev) => [...prev, { role: "user", content: text }]);
    generate(text);
    setQuery("");
  }

  const generate = (queryText: string) => {
    //1. append text message to UI (chat container)
    //2. send textquery to LLM
    //3. append response to UI (chat container)
  };

  return (
    <div className=" text-white bg-neutral-900 h-screen w-screen fixed overflow-x-hidden">
      <div className="container p-3 bg-neutral-900 mx-auto my-20 max-w-3xl  pb-32  ">
        {/* this section will store message of the chatbot */}

        {message.map((m, i) =>
          m.role === "user" ? (
            <div
              key={i}
              className="bg-gray-800 p-3 ml-auto max-w-fit rounded-xl my-4"
            >
              <h4> {m.content} </h4>
            </div>
          ) : (
            <div key={i} className=" max-w-fit my-4">
              <h4>{m.content}</h4>
            </div>
          ),
        )}

        {/* input textarea */}
      </div>
      <div className="fixed inset-x-0 bottom-0 flex justify-center items-center bg-neutral-900  ">
        <div className="bg-gray-800 rounded-2xl w-full p-4 max-w-3xl mb-5">
          <textarea
            className="w-full resize-none outline-0  [&::-webkit-scrollbar]:hidden"
            rows={2}
            placeholder="Hi, how can i help you?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // stops the newline from being inserted
                handleClick();
              }
            }}
          />
          <div className="flex  justify-end">
            <button
              className="bg-white font-bold text-black hover:bg-amber-300 p-3 rounded-2xl"
              onClick={handleClick}
            >
              {" "}
              ASk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
