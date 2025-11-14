"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const outgoingMessages_1 = require("./messages/outgoingMessages");
const websocket_1 = require("websocket");
const http = __importStar(require("http"));
const UserManager_1 = require("./UserManager");
const incomingMessages_1 = require("./messages/incomingMessages");
const InMemoryStore_1 = require("./store/InMemoryStore");
const RateLimiting_1 = require("./RateLimiting");
const server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
// server
const userManager = new UserManager_1.UserManager();
const store = new InMemoryStore_1.InMemoryStore();
server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});
const wsServer = new websocket_1.server({
    httpServer: server,
    autoAcceptConnections: false
});
function originIsAllowed(origin) {
    return true;
}
wsServer.on('request', function (request) {
    console.log("inside connect");
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    // var connection = request.accept('echo-protocol', request.origin);
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    let start = new Date().getTime();
    let totMessages = 0;
    connection.on('message', function (message) {
        //console.log("mmmmssssg", message);
        //if(message.type === 'utf8')
        //console.log("tomader msg: ", JSON.parse(message.utf8Data)[0], new Date() );
        //console.log(typeof(message))
        // Todo add rate limitting logic here 
        // finish this, then watch video
        // 6000ms e 12 ta msg ashle rate limiting kora
        // added custom rate limiter on my own
        // let last =  new Date().getTime();
        // let diff = (last - start)/1000; 
        // totMessages++;
        // console.log(totMessages + "Messages " + "in second: ", diff);
        // if( diff < 6.00 && totMessages>12){
        //     console.log("ABORTTTTTTTT");
        //     return;
        // }
        // if(diff>=6.00)totMessages = 1, start = last;
        const rt = new RateLimiting_1.RateLimiter({ maxMessages: 5, windowSeconds: 6 });
        console.log("hola, ", rt.checkLimit());
        if (!rt.checkLimit()) {
            console.log("ABORTTTTTTTT");
            return;
        }
        //console.log(rt.checkLimit());
        if (message.type === 'utf8') {
            try {
                messageHandler(connection, JSON.parse(message.utf8Data));
                // console.log("ooooo", message.utf8Data);
            }
            catch (e) {
            }
        }
    });
});
function messageHandler(ws, message) {
    if (message.type == incomingMessages_1.SupportedMessage.JoinRoom) {
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    }
    if (message.type === incomingMessages_1.SupportedMessage.SendMessage) {
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId, payload.userId);
        if (!user) {
            console.error("User not found in the db");
            return;
        }
        let chat = store.addChat(payload.userId, user.name, payload.roomId, payload.message);
        if (!chat) {
            return;
        }
        const outgoingPayload = {
            type: outgoingMessages_1.SupportedMessage.AddChat,
            payload: {
                chatId: chat.id,
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvotes: 0
            }
        };
        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }
    if (message.type === incomingMessages_1.SupportedMessage.UpvoteMessage) {
        const payload = message.payload;
        const chat = store.upvote(payload.userId, payload.roomId, payload.chatId);
        console.log("inside upvote");
        if (!chat) {
            return;
        }
        console.log("inside upvote 2");
        const outgoingPayload = {
            type: outgoingMessages_1.SupportedMessage.UpdateChat,
            payload: {
                chatId: payload.chatId,
                roomId: payload.roomId,
                upvotes: chat.upvotes.length
            }
        };
        console.log("inside upvote 3");
        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }
}
