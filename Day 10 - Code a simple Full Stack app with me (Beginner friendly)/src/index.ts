import { OutgoingMessage, SupportedMessage as OutgoingSupportedMessages } from "./messages/outgoingMessages";
import {server as WebSocketServer, connection} from "websocket"
import * as http from 'http';
import { UserManager } from "./UserManager";
import { IncomingMessage, SupportedMessage } from "./messages/incomingMessages";

import { InMemoryStore } from "./store/InMemoryStore";
import { date } from "zod";
import { RateLimiter } from './RateLimiting';

const server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

// server

const userManager = new UserManager();
const store = new InMemoryStore();

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

 const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  return true;
}

wsServer.on('request', function(request) {
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

    connection.on('message', function(message) {

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

        const rt = new RateLimiter ({maxMessages:5,windowSeconds:6 })

        console.log("hola, ", rt.checkLimit());
        if(!rt.checkLimit()){
            console.log("ABORTTTTTTTT");
            return;
        }
    
        //console.log(rt.checkLimit());

        if (message.type === 'utf8') {
            try {
                messageHandler(connection, JSON.parse(message.utf8Data));
               // console.log("ooooo", message.utf8Data);
            } catch(e) {

            }
        }
    });
});

function messageHandler(ws: connection, message: IncomingMessage) {
    

    if (message.type == SupportedMessage.JoinRoom) {
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    }

    if (message.type === SupportedMessage.SendMessage) {
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

        const outgoingPayload: OutgoingMessage= {
            type: OutgoingSupportedMessages.AddChat,
            payload: {
                chatId: chat.id,
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvotes: 0
            }
        }
        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }

    if (message.type === SupportedMessage.UpvoteMessage) {
        const payload = message.payload;
        const chat = store.upvote(payload.userId, payload.roomId, payload.chatId);
        console.log("inside upvote")
        if (!chat) {
            return;
        }
        console.log("inside upvote 2")

        const outgoingPayload: OutgoingMessage= {
            type: OutgoingSupportedMessages.UpdateChat,
            payload: {
                chatId: payload.chatId,
                roomId: payload.roomId,
                upvotes: chat.upvotes.length
            }
        }

        console.log("inside upvote 3")
        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }
}
