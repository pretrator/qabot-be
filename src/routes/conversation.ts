import { Router } from 'express';
import lodash from 'lodash';
import { GLOBAL_CACHE_KEY, SYSTEM_TEMPLATE, MODEL_KEY } from './../constants'
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const router = Router()

router.get('/get', (req: any, res) => {
    const globalCache = req[GLOBAL_CACHE_KEY];
    const values = lodash.values(globalCache.cache);
    const nameConvIDMap = values.map(fileData => ({ fileName: fileData.fileName, conversationId: fileData.conversationId }))
    res.send(nameConvIDMap)
})

router.post("/query", async (req: any, res) => {
    const { conversationId, query } = req.body;
    const fileObj = req[GLOBAL_CACHE_KEY].get(conversationId);
    const { processedPart } = fileObj

    const vectorstore = await MemoryVectorStore.fromDocuments(
        processedPart,
        new OpenAIEmbeddings()
      );
      
    const retriever = vectorstore.asRetriever();

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", SYSTEM_TEMPLATE],
        ["human", "{input}"],
      ]);
    
    const model = req[MODEL_KEY] 
    const questionAnswerChain = await createStuffDocumentsChain({ llm: model, prompt });
    const ragChain = await createRetrievalChain({
        retriever, 
        combineDocsChain: questionAnswerChain 
    });

    const ansStream: any = await ragChain.stream({ input: query });
    
    for await (const chunk of ansStream) {
        if(chunk.answer){
            res.write(JSON.stringify(chunk.answer))
        }
    }

    res.end()
})

export default router