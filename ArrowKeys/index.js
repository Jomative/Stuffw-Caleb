const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//Use the public folder when loading a website
app.use(express.static(process.cwd() + '/public'));

//This is our scene basically for all the players connected at one time
let players = {};

//'connection' gets called either when someone loads the webpage OR when a message
// has been sent from (socket.emit) on the client side.
// This is why (on the server, index.js) you need to put your (socket.on) events within the (io.on('connection'))
io.on('connection', (socket) => {

  //Listening from initJoin and adds them to the players object
  socket.on("initJoin",(name,x,y,col)=>{
    let sid = socket.id;
    let p = {
      sid,name,
      x,y,col
    };
    players[sid] = p; //stores them by socket.id so we can retrieve them quickly later
    io.emit("join",name,sid,players);
  });

  //Listening for 'pos' from client that want to send their pos's over
  socket.on("pos",(x,y)=>{
    let p = players[socket.id];
    if(!p) return;
    p.x = x; //we update the position data on the server so when someone connects later, they still are synced up
    p.y = y;
    let sid = socket.id;
    io.emit("pos",sid,x,y); //and then we emit it back to everyone connected - (io.emit sends to everyone, socket.emit sends it just back to the person who originally sent it)
  });

  //This event gets fired when someone closes the website or refreshes the page
  // We will delete them from the scene here and then let everyone else know that
  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit("leave",socket.id);
  });
});

//Run the server on port 3001
server.listen(3001, () => {
  console.log('listening on *:3001');
});