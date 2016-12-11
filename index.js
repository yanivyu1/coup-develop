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
var AINames = ["Robert","Patrick","Donna","James","Alex","Gil"];
var turn = 0;
var chellangedPlayer;
var blocked = false;
io.on('connection',function(socket){
  console.log(socket.id+" is connected");
  socket.on('disconnect',function(){
    console.log(socket.id+" is disconnected");
    players.splice(getIndex(socket.id),1);
  });
	socket.on('join',function(name){
			console.log(name+" has joined");
			players.push({type:"human",name:name,playerId:socket.id,coins:2,card1:null,card2:null,hits:0});
			io.emit('hasJoined',name);
			socket.emit('joined');
	});
  socket.on('addAiPlayer',function(){
		var nameInd = Math.round(Math.random()*AINames.length);
		console.log(nameInd);
    players.push({type:"npc",name:AINames[nameInd],playerId:"npc_"+players.length,coins:2,card1:null,card2:null});
		startGame++;
		console.log(players);
		AINames.splice(nameInd,1);
		io.emit('hasJoined',players[players.length-1].name);
  });
  socket.on('startGame',function(){
    startGame++;
    if(startGame === players.length){
      for(var i=0;i<players.length;i++){
				console.log("start");
        while(players[i].card2 === null){
          var num = Math.floor(Math.random()*4);
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
              players[i].card1 === null ? players[i].card1 = "Assassin" : players[i].card2 = "Assassin";
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
				io.to(players[i].playerId).emit('begin',players[i]);
				console.log(players[i]);
      }
			io.to(players[turn].playerId).emit('playTurn');
    }
  });
	socket.on('getIncome',function(){
		console.log(players[getIndex(socket.id)].name+" took income");
		players[getIndex(socket.id)].coins++;
		console.log(players[getIndex(socket.id)]);
		socket.emit('recivedCoins',players[getIndex(socket.id)].coins);
		while(players[turn].hits<2){
			turn = (turn + 1)%players.length;
			break;
		}
		io.to(players[turn].playerId).broadcast.emit('turnEnd');
		io.to(players[turn].playerId).emit('playTurn');
	});
	socket.on('getForeignAid',function(){
		console.log("foreign aid");
		chellangedPlayer = getIndex(socket.id);
		console.log(chellangedPlayer);
		socket.broadcast.emit('chellange',"foreign aid");
	});
	socket.on('allow',function(){
		players[turn].coins+=2;
		console.log(players[getIndex(socket.id)]);
		io.to(players[turn].playerId).emit('recivedCoins',players[turn].coins);
		turn = (turn + 1)%players.length;
		io.to(players[turn].playerId).emit('playTurn');
	});
	socket.on('block',function(action){
		console.log("block "+action);
		blocked = true;
		chellangedPlayer = getIndex(socket.id);
		console.log(chellangedPlayer);
		socket.broadcast.emit('chellangeCard',action);
	});
	socket.on('chellangeAction',function(action){
		console.log(action+" chellanged");
		switch(action){
			case "foreign aid":
			console.log(blocked);
				if(blocked && (players[chellangedPlayer].card1 != "Duke" && players[chellangedPlayer].card2 != "Duke")){
					console.log("player "+chellangedPlayer+" is busted");
					players[chellangedPlayer].emit('busted');
				}
				else{
					players[getIndex(socket.id)].coins+=2;
					console.log(players[getIndex(socket.id)]);
					socket.emit('recivedCoins',players[getIndex(socket.id)].coins);
					while(players[turn].hits<2){
						turn = (turn + 1)%players.length;
						break;
					}
					socket.emit('turnEnd');
					io.to(players[turn].playerId).emit('playTurn');
				}
				break;
			case "tax":
				if(blocked && (players[chellangedPlayer].card1 != "Duke" || players[chellangedPlayer].card2 != "Duke")){
					console.log("player "+chellangedPlayer+" is busted");
					players[chellangedPlayer].emit('busted');
				}
				if(!blocked && (players[chellangedPlayer].card1 != "Duke" || players[chellangedPlayer].card2 != "Duke")){
					console.log("player "+chellangedPlayer+" is busted");
					players[chellangedPlayer].emit('busted');
				}
				else{
					players[getIndex(socket.id)].coins+=3;
					console.log(players[getIndex(socket.id)]);
					socket.emit('recivedCoins',players[getIndex(socket.id)].coins);
					while(players[turn].hits<2){
						turn = (turn + 1)%players.length;
						break;
					}
					io.to(players[turn].playerId).broadcast.emit('turnEnd');
					io.to(players[turn].playerId).emit('playTurn');
				}
				break;
		}
	});
});
server.listen(8080);
function passTurn(){

}
function getIndex(id){
	for(var i=0;i<players.length;i++){
		if(players[i].playerId === id){
			return i;
		}
	}
}
