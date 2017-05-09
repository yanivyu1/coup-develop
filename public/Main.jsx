var React = require('react');
var ReactDOM = require('react-dom');
import UserInterface from "UserInterface";
import Chellange from "Chellange";
import Join from "Join";
import RoomInterface from "RoomInterface";
import Cards from "Cards";
import ChellangeCard from "ChellangeCard";
import OtherPlayer from "OtherPlayer";
import ExchangeCards from "ExchangeCards";
var actionTemp;
var hand;
var playersTemp = [];
var namesTemp = [];
var cardsTemp = [];
var cardsLength = 0;
var Main = React.createClass({
  getInitialState: function() {
    return {
      join:true,
      myTurn:false,
      appear:false,
      start:false,
      chellangeCard:false,
      addAiPlayer:true,
      play:false,
      busted:false,
      coins:2,
      action:null,
      otherPlayers:[],
      names:[],
      exchange:false,
      player:[],
      choosePlayer:false
    };
  },
  _play:function(){
    console.log("play your turn");
    this.setState({
      myTurn:true,
      join:false,
      addAiPlayer:false,
      appear:false,
      chellangeCard:false,
      chellange:false,
      action:null
    });
  },
  _chellange:function(action){
    actionTemp = action;
    console.log("chellange "+actionTemp);
    this.setState({
      appear:true,
      action:action
    });
  },
  _chellangeAction:function(action){
    actionTemp = action;
    console.log("chellange "+actionTemp);
    this.setState({
      chellangeCard:true,
      action:action
    });
  },
  _setAction:function(player,name){
    console.log(player);
    this.setState({
      choosePlayer:false
    });
    socket.emit(this.state.action+'Action',player)
  },
  _joined:function(name){
    namesTemp.push(name);
    this.setState({
      join:false,
      start:true,
      names:namesTemp
    });
    console.log(this.state.names);
  },
  _start:function(player){
    hand = player;
    console.log(player);
    this.setState({
      start:false,
      addAiPlayer:false,
      play:true,
      player:player
    });
  },
  _recivedCoins:function(num){
    this.setState({
      coins:num,
      myTurn:false
    });
  },
  _busted:function(){
    console.log("busted");
    this.setState({
      busted:true,
      appear:false
    });
  },
  _endTurn:function(){
    console.log("turn ended");
    this.setState({
      appear:false,
      chellangeCard:false,
      myTurn:false,
      busted:false,
      chellange:false,
      action:null
    });
  },
  _hasJoined:function(player){
    playersTemp.push(player)
    this.setState({
      otherPlayers:playersTemp
    });
    console.log(this.state.otherPlayers);
  },
  _exchangeCards:function(object){
    cardsTemp = object.cards;
    cardsLength = object.length;
    this.setState({
      exchange:true
    });
  },
  _swiped:function(player){
    this.setState({
      play:false
    });
    hand = player;
    this.setState({
      play:true,
      player:hand
    });
    console.log(this.state);
  },
  _choose:function(){
    this.setState({
      choosePlayer:true
    });
  },
  componentDidMount: function() {
    socket.on('swiped',this._swiped);
    socket.on('busted',this._busted);
    socket.on('playTurn',this._play);
    socket.on('chellange',this._chellange);
    socket.on('chellangeCard',this._chellangeAction);
    socket.on('joined',this._joined);
    socket.on('begin',this._start);
    socket.on('recivedCoins',this._recivedCoins);
    socket.on('turnEnd',this._endTurn);
    socket.on('hasJoined',this._hasJoined);
    socket.on('newCards',this._exchangeCards);
    socket.on('choose_a_player',this._choose);
  },
  render:function(){
    return(
      <div>
        <h1 className="title">Welcom to coup treason</h1>
        <div>

        </div>
        <div className="roomInterface">
          <RoomInterface names={this.state.names} visible={this.state.addAiPlayer}/>
        </div>
        <div className="otherPlayers">
          {this.state.otherPlayers.map(function(player,i){
            return(
              <OtherPlayer className={"otherPlayer"} name={player.name} sims={player.coins} click={this._setAction.bind(this,player.name)}/>
            )
          }.bind(this))}
        </div>
        <div>
          {this.state.join ? <Join/> : null}
          {this.state.start ? <Start/> : null}
        </div>
        <div>
          {this.state.myTurn ? <UserInterface play={this.state.myTurn} coins={this.state.coins}/> : null}
        </div>
        <div>
          {this.state.exchange ? <ExchangeCards cards={cardsTemp} length={cardsLength}/> : null}
          {this.state.busted ? <Busted/> : null}
          {this.state.choosePlayer ? <ChoosePlayer/> : null}
          {this.state.appear ? <Chellange action={this.state.action}/> : null}
          {this.state.chellangeCard ? <ChellangeCard action={this.state.action}/> : null}
        </div>
        <div className="sims">
          <div className="coinsImage">
          </div>
          <h1 className="coins">{this.state.coins}</h1>
        </div>
        <div className="cards">
          {this.state.play ? <Cards cards={this.state.player} busted={this.state.busted}/> : null}
        </div>
      </div>
    );
  }
});
var Start = React.createClass({
  getInitialState: function() {
    return {
      visible:true
    };
  },
  startGame:function(){
    socket.emit('startGame');
    this.setState({
      visible:false
    });
  },
  render:function(){
    return(
      <div className="start">
        {this.state.visible ? <button className="startButton" onClick={this.startGame}>START</button> : null}
      </div>
    );
  }
});
var Busted = React.createClass({
  render:function(){
    return(
      <h1 className="bustedTitle">Choose a Card</h1>
    );
  }
});
var ChoosePlayer = React.createClass({
  render:function(){
    return(
      <h1 className="bustedTitle">Choose a Player</h1>
    );
  }
});
ReactDOM.render(<Main/>,document.getElementById('main'));
