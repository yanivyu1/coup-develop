var React = require('react');
var ReactDOM = require('react-dom');
import UserInterface from "UserInterface";
import Chellange from "Chellange";
import Join from "Join";
import RoomInterface from "RoomInterface";
import Cards from "Cards";
import chellangeCard from "ChellangeCard";
var actionTemp;
var hand;
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
      coins:2
    };
  },
  _play:function(){
    console.log("play your turn");
    this.setState({
      myTurn:true,
      join:false,
      addAiPlayer:false,
      appear:false
    });
  },
  _chellange:function(action){
    console.log("chellange "+action);
    actionTemp = action;
    this.setState({
      appear:true
    });
  },
  _chellangeAction:function(action){
    this.setState({
      chellangeCard:true 
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
  componentDidMount: function() {
    socket.on('playTurn',this._play);
    socket.on('Chellange',this._chellange);
    socket.on('chellangeCard',this._chellangeAction);
    socket.on('joined',this._joined);
    socket.on('begin',this._start);
    socket.on('recivedCoins',this._recivedCoins);
  },
  render:function(){
    return(
      <div>
        <h1 className="title">Welcom to coup treason</h1>
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
          {this.state.appear ? <Chellange action={actionTemp}/> : null}
          {this.state.chellangeCard ? <ChellangeCard action={actionTemp}/> : null}
        </div>
        <div className="sims">
          <div className="coinsImage">
          </div>
          <h1 className="coins">{this.state.coins}</h1>
        </div>
        <div className="cards">
          {this.state.play ? <Cards cards={hand}/> : null}
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
        <button className="startButton" onClick={this.startGame}>START</button>
      </div>
    );
  }
});
ReactDOM.render(<Main/>,document.getElementById('main'));
