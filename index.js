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
var targetPlayer;
io.on('connection',function(socket){
  console.log(socket.id+" is connected");
  socket.on('disconnect',function(){
    console.log(socket.id+" is disconnected");
    players.splice(getIndex(socket.id),1);
  });
	socket.on('join',function(name){
			console.log(name+" has joined");
			players.push({playerInfo:{type:"human",name:name,coins:2,cards:[],hits:0},playerId:socket});
			console.log(players);
			socket.broadcast.emit('hasJoined',players[players.length-1].playerInfo);
			console.log("1");
			socket.emit('joined',players[players.length-1].playerInfo.name);
	});
  socket.on('addAiPlayer',function(){
		var nameInd = Math.round(Math.random()*AINames.length);
		console.log(nameInd);
    players.push({playerInfo:{type:"npc",name:AINames[nameInd],coins:2,cards:[],hits:0},playerId:"npc_"+players.length});
		startGame++;
		console.log(players);
		AINames.splice(nameInd,1);
		io.emit('hasJoined',players[players.length-1].playerInfo);
  });
  socket.on('startGame',function(){
    startGame++;
    if(startGame === players.length){
      for(var i=0;i<players.length;i++){
				console.log("start");
        while(players[i].playerInfo.cards.length<2){
          var num = Math.floor(Math.random()*5);
          switch(num){
            case 0:
            if(cards[0]>0){
              players[i].playerInfo.cards[0] === null ? players[i].playerInfo.cards.push("Duke") : players[i].playerInfo.cards.push("Duke");
              cards[0]--;
            }
            break;
            case 1:
            if(cards[1]>0){
              players[i].playerInfo.cards[0] === null ? players[i].playerInfo.cards.push("Ambessador") : players[i].playerInfo.cards.push("Ambessador");
              cards[1]--;
            }
            break;
            case 2:
            if(cards[2]>0){
              players[i].playerInfo.cards[0] === null ? players[i].playerInfo.cards.push("Captain") : players[i].playerInfo.cards.push("Captain");
              cards[2]--;
            }
            break;
            case 3:
            if(cards[3]>0){
              players[i].playerInfo.cards[0] === null ? players[i].playerInfo.cards.push("Assassin") : players[i].playerInfo.cards.push("Assassin");
              cards[3]--;
            }
            break;
            case 4:
            if(cards[4]>0){
              players[i].playerInfo.cards[0] === null ? players[i].playerInfo.cards.push("Contesa") : players[i].playerInfo.cards.push("Contesa");
              cards[4]--;
            }
            break;
          }
					console.log(players);
        }
				players[i].playerId.emit('begin',players[i].playerInfo);
				console.log(players[i]);
      }
			players[turn].playerId.emit('playTurn');
    }
  });
	socket.on('getIncome',function(){
		console.log(players[getIndex(socket.id)].playerInfo.name+" took income");
		players[getIndex(socket.id)].playerInfo.coins++;
		console.log(players[getIndex(socket.id)]);
		socket.emit('recivedCoins',players[getIndex(socket.id)].playerInfo.coins);
		socket.broadcast.emit('otherRecivedCoins',players[getIndex(socket.id)].playerInfo.coins);
		io.emit('turnEnd');
		while(players[turn].playerInfo.hits<2){
			turn = (turn + 1)%players.length;
			break;
		}
		console.log(turn);
		players[turn].playerId.emit('playTurn');
	});
	socket.on('getForeignAid',function(){
		console.log("foreign aid");
		chellangedPlayer = socket;
		console.log(chellangedPlayer);
		socket.broadcast.emit('chellange',"foreign aid");
	});
	socket.on('getTax',function(){
		console.log("tax");
		chellangedPlayer = socket;
		console.log(chellangedPlayer);
		socket.broadcast.emit('chellange',"tax");
	});
	socket.on('exchange',function(){
		chellangedPlayer = socket;
		console.log(chellangedPlayer);
		socket.broadcast.emit('chellange',"exchange");
	});
	socket.on('steal',function(){
		chellangedPlayer = socket;
		socket.emit('choose_a_player','steal');
	});
	socket.on('stealAction',function(name){
		targetPlayer = players[getIndexByName(name)].playerId;
		console.log(targetPlayer);
		socket.broadcast.emit('chellange',"steal");
	});
	socket.on('allow',function(action){
		switch(action){
			case "foreign aid":
				players[turn].playerInfo.coins+=2;
				console.log(players[getIndex(socket.id)]);
				players[turn].playerId.emit('recivedCoins',players[turn].playerInfo.coins);
				io.emit('turnEnd');
				turn = (turn + 1)%players.length;
				players[turn].playerId.emit('playTurn');
				break;
			case "tax":
				players[turn].playerInfo.coins+=3;
				console.log(players[getIndex(socket.id)]);
				players[turn].playerId.emit('recivedCoins',players[turn].playerInfo.coins);
				io.emit('turnEnd');
				turn = (turn + 1)%players.length;
				players[turn].playerId.emit('playTurn');
				break;
			case "steal":
				console.log("steal from "+targetPlayer);
				players[turn].playerInfo.coins+=2;
				players[getIndexByName(targetPlayer)]-=2;
				players[turn].playerId.emit('recivedCoins',players[turn].playerInfo.coins);
				targetPlayer.emit('recivedCoins',players[getIndexByName(targetPlayer)].playerInfo.coins);
				io.emit('turnEnd');
				turn = (turn + 1)%players.length;
				players[turn].playerId.emit('playTurn');
				console.log(players[getIndex(socket.id)]);
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
				var swipeCardsTemp = players[getIndex(chellangedPlayer.id)].playerInfo.cards;
				swipeCardsTemp.push(swipeCards[0]);
				swipeCardsTemp.push(swipeCards[1]);
				console.log(players[getIndex(chellangedPlayer.id)].playerInfo.cards.length);
				chellangedPlayer.emit('newCards',{cards:swipeCardsTemp,length:players[getIndex(chellangedPlayer.id)].playerInfo.cards.length});
				break;
		}
	});
	socket.on('accept',function(){
		io.emit('turnEnd');
		turn = (turn + 1)%players.length;
		players[turn].playerId.emit('playTurn');
	});
	socket.on('block',function(action){
		console.log("block "+action);
		blocked = true;
		chellangedPlayer = socket;
		console.log(chellangedPlayer);
		socket.broadcast.emit('chellangeCard',action);
	});
	socket.on('chellangeAction',function(action){
		console.log(action+" chellanged");
		switch(action){
			case "foreign aid":
				if(players[getIndex(chellangedPlayer.id)].playerInfo.cards[0] != "Duke" && players[getIndex(chellangedPlayer.id)].playerInfo.cards[1] != "Duke"){
					players[getIndex(chellangedPlayer.id)].playerInfo.hits++;
					chellangedPlayer.emit('busted');
				}
				else{
					players[getIndex(socket.id)].playerInfo.hits++;
					socket.emit('busted');
 					console.log(players[getIndex(chellangedPlayer.id)]);
				}
				break;
			case "tax":
				if(players[getIndex(chellangedPlayer.id)].playerInfo.cards[0] != "Duke" && players[getIndex(chellangedPlayer.id)].playerInfo.cards[1] != "Duke"){
					chellangedPlayer.emit('busted');
				}
				else {
					socket.emit('busted');
					console.log(players[getIndex(chellangedPlayer.id)]);
				}
				break;
			case "exchange":
				if(players[getIndex(chellangedPlayer.id)].playerInfo.cards[0] != "Ambessador" && players[getIndex(chellangedPlayer.id)].playerInfo.cards[1] != "Ambessador"){
					players[getIndex(chellangedPlayer.id)].playerInfo.hits++;
					chellangedPlayer.emit('busted');
				}
				else{
					players[getIndex(socket.id)].playerInfo.hits++;
					socket.emit('busted');
					console.log(players[getIndex(chellangedPlayer.id)]);
				}
				break;
			case "steal":
				if(blocked && (players[getIndex(chellangedPlayer.id)].card[0] != "Ambessador" && players[getIndex(chellangedPlayer.id)].card[1] != "Ambessador")){
					players[getIndex(chellangedPlayer.id)].hits++;
					chellangedPlayer.emit('busted');
				}
				else if(blocked == false && (players[getIndex(chellangedPlayer.id)].card[0] != "Captain" && players[getIndex(chellangedPlayer.id)].card[1] != "Captain")){
					players[getIndex(chellangedPlayer.id)].hits++;
					chellangedPlayer.emit('busted');
				}
		}
	});
	socket.on('showCard',function(card){
		console.log(players[getIndex(socket.id)].playerInfo.name+" "+card+" revelead");
		players[getIndex(socket.id)].playerInfo.cards[0] === card ? players[getIndex(socket.id)].playerInfo.cards.splice(0,1) : players[getIndex(socket.id)].playerInfo.cards.splice(1,1);
		console.log(players[getIndex(socket.id)]);
		socket.broadcast.emit('revealCard',card);
		io.emit('turnEnd');
		while(players[turn].hits<2){
			turn = (turn + 1)%players.length;
			break;
		}
		io.to(players[turn].playerId).emit('playTurn');
	});
	socket.on('swipeCards',function(object){
		console.log(object);
		var swipeCount = 0;
		players[getIndex(socket.id)].playerInfo.cards = [];
		for(var i=0;i<object.length;i++){
			if(object[i].swipe == 1){
					players[getIndex(socket.id)].playerInfo.cards.push(object[i].playerInfo.name);
					swipeCount++;
					cards[getName(object[i].name)]--;
			}
			else {
				cards[getName(object[i].name)]++;
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
		if(players[i].playerId.id === id){
			return i;
		}
	}
}
function getIndexByName(name){
	for(var i=0;i<players.length;i++){
		if(players[i].playerInfo.name === name){
			console.log("getIndexByName"+i);
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
