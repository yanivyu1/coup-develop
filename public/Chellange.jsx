var React = require('react');

var Chellange = React.createClass({
  getInitialState: function() {
    return {
      action:null
    };
  },
  componentWillMount: function() {
    console.log(this.props.action);
    this.setState({
      action:this.props.action
    });
  },
  _block:function(){
    console.log("block "+this.state.action);
    socket.emit('block',this.state.action);
  },
  _chellangeAction:function(){
    console.log("chellange "+this.state.action);
    socket.emit('chellangeAction',this.state.action);
  },
  _allow:function(){
    console.log("allow "+this.state.action);
    socket.emit('allow',this.state.action);
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
