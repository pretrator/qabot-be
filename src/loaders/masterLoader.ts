import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const masterLoaders: any = {
    "pdf": (path: string) => new PDFLoader(path)
}

export const getLoader = (extension: string) => {
    const loader = masterLoaders[extension]
    return loader;
}
