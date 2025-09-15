site: https://chess.com/

# Tutorial
chess assets - conditional mapping kra chess.js packages er sathe    
system design in chess  
chess validation npm package(chess.js)  
stateless vs statefull  
statefull and also push the states in the database as well
recovery of the game using database if server crashes at any point
 
saving state: statefull state -> Redis queue -> database e save
for 142 k people 142 ws server, knowing ws server limit is important
how to scale ws server is important? Publisher Subscriber


# Todo 
Let's create a simple postgres table + Prisma for ORM which stores all the game information

Whenever a new game is started, create an entry in the game table

As the users make moves, store it in a moves DB which has a foreign key to the game table

Add ids to every created game and add a new event that let's users re-join a game with a given id if their wifi went down/ws conn reset

If a user wants to join a game and there is no in memory Game object for it, recover the game from the DB and put it back in memory