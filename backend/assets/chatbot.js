import Groq from "groq-sdk";
import "dotenv/config";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function generate(userMessage) {
 

  const messages = [
    {
      role: "system",
      content: `you are Jarvis, a smart personal assistant who answers the asked questions. Be always polite
          you have access ti following tools:
          1. webSearch({query} : {query : string}) //Search the latest information and realtime data for the user query on the internet. you can use this when you need to access internet for realtime data
           current datetime : ${new Date().toUTCString()}`,
    },
  ];



    messages.push({
      role: "user",
      content: userMessage,
    });

   
    while (true) {
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
