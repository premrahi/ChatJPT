import Groq from "groq-sdk";
import "dotenv/config";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const myCache = new NodeCache({stdTTL : 60*60*24}); //24hours

export default async function generate(userMessage , threadId) {
 
  const baseMessages = [
    {
      role: "system",
      content: `you are Jarvis, a smart personal assistant who answers the asked questions. Be always polite
                if you know the answer to a question, answer it directly in plain english,
                if the answer is not known , require real-time,local ,or up-to-date information , use the available tool to find it.
                you have access to the following tool: 

            webSearch(query : string): use this to search the internet for current or unknown information.
            Decide when to use your own knowledge and when to use the tool.
            Do not mention the tool unless needed.

            Examples :
            Q:what is the capital of France?
            A:The capital of France is Paris.

            Q:what is the weather of Mumbai right now?
            A:(use the search tool to find the weather)

            Q:who is the current Prime Minister of India?
            A:(use search tool to find the latest prime Minister)

           current date-time : ${new Date().toUTCString()}`,
    },
  ];

  const messages = myCache.get(threadId) ?? baseMessages ;


    messages.push({
      role: "user",
      content: userMessage,
    });

   const MAX_RETRIES = 10 ;
    let count = 0 ;

    while (true) {

      if(count > MAX_RETRIES){
        return "I Couldn't find the answer, please try again!"
      }

      count++ ;
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the latest information and realtime data for the user query on the internet.",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "the search query to perform search on.",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      messages.push(completion.choices[0].message);

      const toolCalls = completion.choices[0].message.tool_calls;

      if (!toolCalls) {

        myCache.set(threadId , messages) ;
        return completion.choices[0].message.content ;
      }

      for (const tool of toolCalls) {
        //  console.log('tools :' , tool)

        const functionName = tool.function.name;
        const functionParams = tool.function.arguments;

        if (functionName === "webSearch") {
          const toolResult = await webSearch(JSON.parse(functionParams));
          // console.log("Tool result: ", toolResult);

          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: toolResult,
          });
        }
      }
    }
  }





async function webSearch({ query }) {

  const response = await tvly.search(query);

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");

  return finalResult;
}
