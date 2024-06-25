import { Router } from 'express';
import multer from 'multer';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GLOBAL_CACHE_KEY } from './../constants'

const upload = multer({ dest: './uploads' })

let router = Router()

const loaders : any = {
  "pdf": (path: string) => new PDFLoader(path)
}

router.post('/uploadFile', upload.single('file'), async (req: any, res) => {
  // Need to think over file handling over disk
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  const { originalname, path, filename } = req.file;
  const splitName = originalname.split(".")
  const extension = splitName[splitName.length - 1]
  const loader: any = loaders[extension]
  const fileLoader = loader(path)
  const docs = await fileLoader.load()
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.splitDocuments(docs);
  const fileObj = {
    fileName: originalname,
    processedPart: splits,
    conversationId: filename
  }
  req[GLOBAL_CACHE_KEY].set(filename, fileObj)
  res.json({
    conversationId: filename,
  })
})

export default router
