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
			players.push({type:"human",name:name,playerId:socket.id,coins:2,cards:[],hits:0});
			socket.broadcast.emit('hasJoined',players[getIndex(socket.id)]);
			socket.emit('joined',players[getIndex(socket.id)].name);
	});
  socket.on('addAiPlayer',function(){
		var nameInd = Math.round(Math.random()*AINames.length);
		console.log(nameInd);
    players.push({type:"npc",name:AINames[nameInd],playerId:"npc_"+players.length,coins:2,cards:[],hits:0});
		startGame++;
		console.log(players);
		AINames.splice(nameInd,1);
		io.emit('hasJoined',players[players.length-1]);
  });
  socket.on('startGame',function(){
    startGame++;
    if(startGame === players.length){
      for(var i=0;i<players.length;i++){
				console.log("start");
        while(players[i].cards.length<2){
          var num = Math.floor(Math.random()*5);
          switch(num){
            case 0:
            if(cards[0]>0){
              players[i].cards[0] === null ? players[i].cards.push("Duke") : players[i].cards.push("Duke");
              cards[0]--;
            }
            break;
            case 1:
            if(cards[1]>0){
              players[i].cards[0] === null ? players[i].cards.push("Ambessador") : players[i].cards.push("Ambessador");
              cards[1]--;
            }
            break;
            case 2:
            if(cards[2]>0){
              players[i].cards[0] === null ? players[i].cards.push("Captain") : players[i].cards.push("Captain");
              cards[2]--;
            }
            break;
            case 3:
            if(cards[3]>0){
              players[i].cards[0] === null ? players[i].cards.push("Assassin") : players[i].cards.push("Assassin");
              cards[3]--;
            }
            break;
            case 4:
            if(cards[4]>0){
              players[i].cards[0] === null ? players[i].cards.push("Contesa") : players[i].cards.push("Contesa");
              cards[4]--;
            }
            break;
          }
					console.log(players);
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
		io.emit('turnEnd');
		while(players[turn].hits<2){
			turn = (turn + 1)%players.length;
			break;
		}
		io.to(players[turn].playerId).emit('playTurn');
	});
	socket.on('getForeignAid',function(){
		console.log("foreign aid");
		chellangedPlayer = getIndex(socket.id);
		console.log(chellangedPlayer);
		socket.broadcast.emit('chellange',"foreign aid");
	});
	socket.on('getTax',function(){
		console.log("tax");
		chellangedPlayer = getIndex(socket.id);
		console.log(chellangedPlayer);
		socket.broadcast.emit('chellange',"tax");
	});
	socket.on('exchange',function(){
		chellangedPlayer = getIndex(socket.id);
		console.log(chellangedPlayer);
		socket.broadcast.emit('chellange',"exchange");
	});
	socket.on('allow',function(action){
		switch(action){
			case "foreign aid":
				players[turn].coins+=2;
				console.log(players[getIndex(socket.id)]);
				io.to(players[turn].playerId).emit('recivedCoins',players[turn].coins);
				io.emit('turnEnd');
				turn = (turn + 1)%players.length;
				io.to(players[turn].playerId).emit('playTurn');
				break;
			case "tax":
				players[turn].coins+=3;
				console.log(players[getIndex(socket.id)]);
				io.to(players[turn].playerId).emit('recivedCoins',players[turn].coins);
				io.emit('turnEnd');
				turn = (turn + 1)%players.length;
				io.to(players[turn].playerId).emit('playTurn');
				break;
			case "exchange":
				var swipeCards = [];
				for(var j=0;j<2;j++){
					while(swipeCards.length<2){
						var num = Math.floor(Math.random()*5);
						switch(num){
							case 0:
							if(cards[0]>0){
								swipeCards[0] === null ? swipeCards.push("Duke") : swipeCards.push("Duke");
								cards[0]--;
							}
							break;
							case 1:
							if(cards[1]>0){
								swipeCards[0] === null ? swipeCards.push("Ambessador") : swipeCards.push("Ambessador");
								cards[1]--;
							}
							break;
							case 2:
							if(cards[2]>0){
								swipeCards[0] === null ? swipeCards.push("Captain") : swipeCards.push("Captain");
								cards[2]--;
							}
							break;
							case 3:
							if(cards[3]>0){
								swipeCards[0] === null ? swipeCards.push("Assassin") : swipeCards.push("Assassin");
								cards[3]--;
							}
							break;
							case 4:
							if(cards[4]>0){
								swipeCards[0] === null ? swipeCards.push("Contesa") : swipeCards.push("Contesa");
								cards[4]--;
							}
							break;
						}
					}
				}
				console.log(swipeCards[0] +","+swipeCards[1]);
				var swipeCardsTemp = players[chellangedPlayer].cards;
				swipeCardsTemp.push(swipeCards[0]);
				swipeCardsTemp.push(swipeCards[1]);
				io.to(players[chellangedPlayer].playerId).emit('newCards',{cards:swipeCardsTemp,length:players[chellangedPlayer].cards.length});
				break;
		}
	});
	socket.on('accept',function(){
		io.emit('turnEnd');
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
				if(players[chellangedPlayer].cards[0] != "Duke" && players[chellangedPlayer].cards[1] != "Duke"){
					players[chellangedPlayer].hits++;
					io.to(players[chellangedPlayer].playerId).emit('busted');
				}
				else{
					players[getIndex(socket.id)].hits++;
					socket.emit('busted');
 					console.log(players[chellangedPlayer]);
				}
				break;
			case "tax":
				if(blocked && (players[chellangedPlayer].cards[0] != "Duke" && players[chellangedPlayer].cards[1] != "Duke")){
					io.to(players[chellangedPlayer].playerId).emit('busted');
				}
				else{
					socket.emit('busted');
					console.log(players[chellangedPlayer]);
				}
				break;
			case "exchange":
			if(players[chellangedPlayer].cards[0] != "Ambessador" && players[chellangedPlayer].cards[1] != "Ambessador"){
				players[chellangedPlayer].hits++;
				io.to(players[chellangedPlayer].playerId).emit('busted');
			}
			else{
				players[getIndex(socket.id)].hits++;
				socket.emit('busted');
				console.log(players[chellangedPlayer]);
			}
			break;
		}
	});
	socket.on('showCard',function(card){
		console.log(players[getIndex(socket.id)].name+" "+card+" revelead");
		players[getIndex(socket.id)].cards[0] === card ? players[getIndex(socket.id)].cards.splice(0,1) : players[getIndex(socket.id)].cards.splice(1,1);
		console.log(players[getIndex(socket.id)]);
		socket.broadcast.emit('revealCard',card);
		io.emit('turnEnd');
		while(players[turn].hits<2){
			turn = (turn + 1)%players.length;
			break;
		}
		io.to(players[turn].playerId).emit('playTurn');
	});
	socket.on('swipeCards',function(swipeCards){
		console.log(swipeCards);
		var swipeCount = 0;
		for(var i=0;i<swipeCards.length;i++){
			if(swipeCards[i].swipe == 1){
				if(swipeCount === 0){
					players[getIndex(socket.id)].cards[0] = swipeCards[i].name;
					swipeCount++;
				}
				else {
					players[getIndex(socket.id)].cards[1] = swipeCards[i].name;
				}
				cards[getName(swipeCards[i].name)]--;
			}
			else {
				cards[getName(swipeCards[i].name)]++;
			}
		}
		socket.emit('swiped',players[getIndex(socket.id)]);
		io.emit('turnEnd');
		turn = (turn + 1)%players.length;
		io.to(players[turn].playerId).emit('playTurn');
	});
});
server.listen(8080);
function getIndex(id){
	for(var i=0;i<players.length;i++){
		if(players[i].playerId === id){
			return i;
		}
	}
}
function getName(name){
	switch (name){
		case "Duke":
			return 0;
			break;
		case "Ambessador":
			return 1;
			break;
		case "Captain":
			return 2;
			break;
		case "Assassin":
			return 3;
			break;
		case "Contesa":
			return 4;
			break;
	}
}
