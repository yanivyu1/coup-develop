var React = require('react');
var namesTemp = [];
var RoomInterface = React.createClass({
    getInitialState: function() {
      return {
        names:[],
        join:true,
        leave:false
      };
    },
    componentDidMount: function() {
      socket.on('jasLeft',this._left);
    },
    componentWillMount: function() {
      namesTemp.push(this.props.name);
      this.setState({
        names:namesTemp
      });
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
        <div>
          <div className="nameSpace">
            {this.state.names.map(function(child){
              return(<h3 id={child}>{child}</h3>)
            })}
          </div>
          <br/>{this.props.visible ? <button className="aiButton" disabled={this.state.names.length >= 5} onClick={this._addAiPlayer}>ADD AI PLAYER</button> : null}
      </div>
      );
    }
});

module.exports = RoomInterface;
