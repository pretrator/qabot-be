// src/index.ts
import express from 'express';
import 'dotenv/config'
import { PORT } from './settings'
import uploadFile from './routes/upload'
import conversation from './routes/conversation'
import cors from 'cors';
import { fileCache, attachCache, attachModel } from './utility';
import { SAY_HI } from './constants';

const app = express();
const globalFileCache = fileCache();

app.use(express.json());
app.use(cors());
app.use(attachCache(globalFileCache))
app.use(attachModel())


app.use("/upload", uploadFile)
app.use("/conversation", conversation)
app.get('/', (req, res) => res.send(SAY_HI))

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
