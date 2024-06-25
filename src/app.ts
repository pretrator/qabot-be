// src/index.ts
import express from 'express';
import 'dotenv/config'
import { PORT } from './settings'
import uploadFile from './routes/upload'
import conversation from './routes/conversation'
import cors from 'cors';
import { fileCache, attachCache, attachModel } from './utility';


const globalFileCache = fileCache();

const app = express();

app.use(express.json());
app.use(cors());
app.use(attachCache(globalFileCache))
app.use(attachModel())


app.use("/upload", uploadFile)
app.use("/conversation", conversation)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
