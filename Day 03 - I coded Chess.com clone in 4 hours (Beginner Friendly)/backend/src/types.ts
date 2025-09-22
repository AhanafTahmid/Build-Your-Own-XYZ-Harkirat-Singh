import { WebSocket } from "ws";

// Extend WebSocket interface to include id
export interface WebSocketWithId extends WebSocket {
    id: string;
}

