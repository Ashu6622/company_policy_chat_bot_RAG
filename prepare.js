import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";

// const embeddings = new OpenAIEmbeddings({
//   model: "text-embedding-3-small",
// });

const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: "Xenova/all-MiniLM-L6-v2", // free, small & fast
});

const pinecone = new PineconeClient();

const pineconeIndex = pinecone.Index('company-chat-bot');

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function indexTheDocument(filePath){

    const loader = new PDFLoader(filePath, {splitPages:false});
    const docs = await loader.load();

    // console.log(docs[0]);

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    const texts = await textSplitter.splitText(docs[0].pageContent);
    
    const documents = texts.map((chunk)=>{
        return{
            pageContent: chunk,
            metadata : docs[0].metadata,
        }
    })

    await vectorStore.addDocuments(documents);
    // console.log(documents);
    // console.log(texts.length);
    console.log("✅ Document indexed successfully!");

}