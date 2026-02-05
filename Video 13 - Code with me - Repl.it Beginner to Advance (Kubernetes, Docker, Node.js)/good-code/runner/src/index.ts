import dotenv from "dotenv"
dotenv.config()
import express from "express";
import { createServer } from "http";
import { initWs } from "./ws";
import cors from "cors";

const app = express();
app.use(cors());
const httpServer = createServer(app);

initWs(httpServer);

const HOST = '0.0.0.0'; // Important for Docker!

const port =  3000;

app.listen(port, HOST, () => {
    console.log(`Server is running on http://${HOST}:${port}`);
});