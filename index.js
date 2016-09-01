var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname));
var players = [];
var startGame = 0;
var cards = [2,2,2,2,2];
io.on('connection',function(socket){
  console.log(socket.id+" is connected");
  socket.on('disconnect',function(){
    console.log(socket.id+" is disconnected");
    players.pull();
  });
  players.push({type:"human",playerId:socket.id,coins:2,card1:null,card2:null});
  socket.on('addAiPlayer',function(){
    players.push({type:"npc",playerId:"npc_"+players.length,coins:2,card1:null,card2:null});
    startGame++;
    console.log(players);
  });
  socket.on('startGame',function(){
    startGame++;
    if(startGame == players.length){
      for(var i=0;i<players.length;i++){
        while(players[i].card1 !== null && players[i].card2 !== null){
          var num = Math.random()*5;
          switch(num){
            case 0:
            if(cards[0]>0){
              players[i].card1 === null ? players[i].card1 = "Duke" : players[i].card2 = "Duke";
              cards[0]--;
            }
            break;
            case 1:
            if(cards[1]>0){
              players[i].card1 === null ? players[i].card1 = "Ambessador" : players[i].card2 = "Ambessador";
              cards[1]--;
            }
            break;
            case 2:
            if(cards[2]>0){
              players[i].card1 === null ? players[i].card1 = "Captain" : players[i].card2 = "Captain";
              cards[2]--;
            }
            break;
            case 3:
            if(cards[3]>0){
              players[i].card1 === null ? players[i].card1 = "Assassian" : players[i].card2 = "Assassian";
              cards[3]--;
            }
            break;
            case 4:
            if(cards[4]>0){
              players[i].card1 === null ? players[i].card1 = "Contase" : players[i].card2 = "Contase";
              cards[4]--;
            }
            break;
          }
        }
      }
      io.emit('begin',players);
    }
  });
});
server.listen(8080);

function shuffle(player){

}
