var express = require('express');
var app = express();
var ws = require('ws');
var port = 3000;

app.listen(port, ()=>{
  console.log('Served on port: ' + port);
})
app.use(express.static('./public'));

var server = new ws.Server({port: 3200});
var users = [];
server.on('connection', (socket, req)=>{
  users.push(socket)  
  var r = Math.floor(Math.random() * Math.floor(255));
  var g = Math.floor(Math.random() * Math.floor(255));
  var b = Math.floor(Math.random() * Math.floor(255));
  socket.backgroundColor = "rgb(" + r + "," + g + "," + b+ ")";

  socket.on('close',(index)=>{
    var removeId = '{"removeId":' + users.indexOf(socket) + '}';
      server.clients.forEach(remainingClient =>{
        remainingClient.send(removeId)
      })
    }).setMaxListeners(0)

  socket.on('message',(msg)=>{
    var newMsg = msg.slice(0,-1,0)
    newMsg = newMsg +  ', "id":' + users.indexOf(socket) + ',"backgroundColor":'+ '"' +  socket.backgroundColor + '"' +'}';

    server.clients.forEach(client =>{
      client.send(newMsg)
    })
  })

  
})