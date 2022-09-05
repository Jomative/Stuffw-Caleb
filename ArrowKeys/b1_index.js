const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(process.cwd() + '/public'));

let players = {};

io.on('connection', (socket) => {
  socket.on("initJoin",(name,x,y,col)=>{
    let id = socket.id;
    let p = {
      id,name,
      x,y,col
    };
    players[id] = p;
    io.emit("join",name,id,players);
  });

  socket.on("pos",(x,y)=>{
    let p = players[socket.id];
    if(!p) return;
    p.x = x;
    p.y = y;
    let id = socket.id;
    io.emit("pos",id,x,y);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit("leave",socket.id);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});