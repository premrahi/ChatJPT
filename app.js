import Groq from "groq-sdk";
import 'dotenv/config' ;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const completion = await groq.chat.completions.create({
        model : 'openai/gpt-oss-120b',
        temperature : 0 ,
        messages :[
            {
                role: 'system' ,
                content :'you are Jarvis, a smart personal assistant who answers the asked questions. Be always polite' ,
            } ,
            {
                role : 'user' ,
                content :'what is the current weather in mumbai?' ,
            }
        ]
    })

    console.log(completion.choices[0].message.content) ;
}

main() ;