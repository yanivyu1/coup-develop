var React = require('react');

var RoomInterface = React.createClass({
    getInitialState: function() {
      return {
        names:[],
        join:true,
        leave:false
      };
    },
    componentDidMount: function() {
      socket.on('hasJoined',this._joined);
      socket.on('jasLeft',this._left);
    },
    _joined:function(name){
      names.push(name);
    },
    _left:function(name){
      var ind = names.indexOf(name);
      names.splice(ind,1);
    },
    _addAiPlayer:function(){
      socket.emit('addAiPlayer');
      console.log("added AI player");
    },
    render:function(){
      return(
        <div className="nameSpace">
          {this.state.names.map(function(child){
            <h3>{child}</h3>
          })}
          <br/><button onClick={this._addAiPlayer}>ADD AIPLAYER</button>
        </div>
      );
    }
});

module.exports = RoomInterface;
