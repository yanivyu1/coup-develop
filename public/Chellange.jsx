var React = require('react');

var Chellange = React.createClass({
  _block:function(){
    console.log("block");
    socket.emit('block');
    this.setState({
      appear:false
    });
  },
  _chellangeAction:function(){
    console.log("chellange");
    socket.emit('chellangeAction');
    this.setState({
      appear:false
    });
  },
  _allow:function(){
    console.log("allow");
    socket.emit('allow');
    this.setState({
      appear:false
    });
  },
  render:function(){
    return(
      <div className="chellange">
        <button className="UIButton" onClick={this._block}>BLOCK</button>
        <button className="UIButton" onClick={this._chellangeAction}>CHELLANGE</button>
        <button className="UIButton" onClick={this._allow}>ALLOW</button>
      </div>
    );
  }
});

module.exports = Chellange;
