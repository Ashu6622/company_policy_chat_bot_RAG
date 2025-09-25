import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
import {vectorStore} from './prepare.js'

import readline from 'node:readline/promises'

async function main(){

    const rl = readline.createInterface({input: process.stdin, output: process.stdout});

    while(true){

        const question = await rl.question('You : ');
            if(question === 'exit' || question === 'quit'){
            break;
        }


        // retrival
        const relevantChunks = await vectorStore.similaritySearch(question, 3);

        const context = relevantChunks.map((chunk)=> chunk.pageContent).join('\n\n');
        // console.log(context)

        const SYSTEM_PROMPT = `YOU are an assistant for question-answering tasks. Use the following
        relevant pieces of retrieved context to answer the question. provide the answer in very polite way ans use appropriate emogies if needed. If you don't the answer say I don't know.`

        const userQuery = `Queestion: ${question}
        Relevant context: ${context}
        Answer:`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role:"system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: userQuery,
                },
            ],
             model: "openai/gpt-oss-20b",
         });

         console.log(completion.choices[0].message.content);

    }

    rl.close()
}

main();