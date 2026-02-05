import dotenv from "dotenv"
dotenv.config()
import express from "express";
import { createServer } from "http";
import { initWs } from "./ws";
import { initHttp } from "./http";
import cors from "cors";
import path from "path"
import fs from "fs"

const app = express();
app.use(cors());
const httpServer = createServer(app);


// Create tmp directory if it doesn't exist
const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
  console.log('Created tmp directory');
}

initWs(httpServer);
initHttp(app);

const port = 3001;
httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});