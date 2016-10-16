var React = require('react');
var ReactDOM = require('react-dom');
import UserInterface from "UserInterface";
import Chellange from "Chellange";
import Join from "Join";
import RoomInterface from "RoomInterface";
var Main = React.createClass({
  getInitialState: function() {
    return {
      join:true,
      myTurn:false,
      appear:false
    };
  },
  _play:function(){
    console.log("play your turn");
    this.setState({
      myTurn:true,
      join:false
    });
  },
  _chellange:function(){
    this.setState({
      appear:true
    });
  },
  _joined:function(){
    this.setState({
      join:false
    });
  },
  componentDidMount: function() {
    socket.on('playTurn',this._play);
    socket.on('chellange',this._chellange);
    socket.on('joined',this._joined);
  },
  render:function(){
    return(
      <div>
        <h1 className="title">Welcom to coup treason</h1>
        <div className="roomInterface">
          <RoomInterface/>
        </div>
        <div>
          {this.state.join ? <Join/> : <Start/>}
        </div>
        <div>
          {this.state.myTurn ? <UserInterface/> : null}
        </div>
        <div>
          {this.state.appear ? <Chellange/> : null}
        </div>
      </div>
    );
  }
});
var Start = React.createClass({
  startGame:function(){
    socket.emit('startGame');
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
