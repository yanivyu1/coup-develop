var React = require('react');
var ReactDOM = require('react-dom');
import UserInterface from "UserInterface";
import Chellange from "Chellange";
import Join from "Join";
import RoomInterface from "RoomInterface";
import Cards from "Cards";
import ChellangeCard from "ChellangeCard";
import OtherPlayer from "OtherPlayer";
var actionTemp;
var hand;
var nameTemp = null;
var coinsTemp = 0;
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
  _joined:function(){
    this.setState({
      join:false,
      start:true
    });
  },
  _start:function(player){
    hand = player;
    console.log(player);
    this.setState({
      start:false,
      addAiPlayer:false,
      play:true
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
  componentDidMount: function() {
    socket.on('busted',this._busted);
    socket.on('playTurn',this._play);
    socket.on('chellange',this._chellange);
    socket.on('chellangeCard',this._chellangeAction);
    socket.on('joined',this._joined);
    socket.on('begin',this._start);
    socket.on('recivedCoins',this._recivedCoins);
    socket.on('turnEnd',this._endTurn);
  },
  render:function(){
    return(
      <div>
        <h1 className="title">Welcom to coup treason</h1>
        <div>

        </div>
        <div className="roomInterface">
          <RoomInterface visible={this.state.addAiPlayer}/>
        </div>
        <div>
          {this.state.join ? <Join/> : null}
          {this.state.start ? <Start/> : null}
        </div>
        <div>
          {this.state.myTurn ? <UserInterface/> : null}
        </div>
        <div>
          {this.state.busted ? <Busted/> : null}
          {this.state.appear ? <Chellange action={this.state.action}/> : null}
          {this.state.chellangeCard ? <ChellangeCard action={this.state.action}/> : null}
        </div>
        <div className="sims">
          <div className="coinsImage">
          </div>
          <h1 className="coins">{this.state.coins}</h1>
        </div>
        <div className="cards">
          {this.state.play ? <Cards cards={hand} busted={this.state.busted}/> : null}
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
ReactDOM.render(<Main/>,document.getElementById('main'));
