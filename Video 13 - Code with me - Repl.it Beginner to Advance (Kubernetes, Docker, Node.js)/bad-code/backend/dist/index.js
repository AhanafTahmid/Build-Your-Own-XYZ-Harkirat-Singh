"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = require("./ws");
const http_2 = require("./http");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
// Create tmp directory if it doesn't exist
const tmpDir = path_1.default.join(__dirname, '../tmp');
if (!fs_1.default.existsSync(tmpDir)) {
    fs_1.default.mkdirSync(tmpDir, { recursive: true });
    console.log('Created tmp directory');
}
(0, ws_1.initWs)(httpServer);
(0, http_2.initHttp)(app);
const port = 3001;
httpServer.listen(port, () => {
    console.log(`listening on *:${port}`);
});
