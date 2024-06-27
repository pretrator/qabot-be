import { Router } from 'express';
import multer from 'multer';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { FILE_SPLIT_CHAR_DOT, GLOBAL_CACHE_KEY } from './../constants'
import fs from 'fs';
import { CHUNK_OVERLAP, CHUNK_SIZE } from '../settings';
import { getLoader } from '../loaders/masterLoader';

const upload = multer({ dest: './uploads' })

let router = Router()

router.post('/uploadFile', upload.single('file'), async (req: any, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Extract Extension
  const { originalname, path, filename } = req.file;
  const splitName = originalname.split(FILE_SPLIT_CHAR_DOT)
  const extension = splitName[splitName.length - 1]

  // Get Loader
  const loader: any = getLoader(extension)
  const fileLoader = loader(path)

  //Load File
  const docs = await fileLoader.load()

  //Process File
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });
  const splits = await textSplitter.splitDocuments(docs);
  const fileObj = {
    fileName: originalname,
    processedPart: splits,
    conversationId: filename
  }
  req[GLOBAL_CACHE_KEY].set(filename, fileObj)
  
  // Delete the file. Need to rethink to a in memory way as this takes IO to complete the request
  fs.unlink(path, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    }
  });

  res.json({
    conversationId: filename,
  })
})

export default router
