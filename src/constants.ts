export const GLOBAL_CACHE_KEY: any = "regieGlobalCache"
export const MODEL_KEY = "openAIModel"
export const SYSTEM_TEMPLATE = [
    `You are an assistant for question-answering tasks. `,
    `Use the following pieces of retrieved context to answer `,
    `the question. If you don't know the answer, say that you `,
    `don't know. Use three sentences maximum and keep the `,
    `answer concise.`,
    `\n\n`,
    `{context}`,
  ].join("");