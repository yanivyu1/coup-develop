var React = require('react');

var Chellange = React.createClass({
  getInitialState: function() {
    return {
      action:null,play:false
    };
  },
  componentWillMount: function() {
    console.log(this.props.action);
    this.setState({
      action:this.props.action,play:true
    });
  },
  _block:function(){
    console.log("block "+this.state.action);
    socket.emit('block',this.state.action);
    this.setState({
      play:false
    });
  },
  _chellangeAction:function(){
    console.log("chellange "+this.state.action);
    socket.emit('chellangeAction',this.state.action);
    this.setState({
      play:false
    });
  },
  _allow:function(){
    console.log("allow "+this.state.action);
    socket.emit('allow',this.state.action);
    this.setState({
      play:false
    });
  },
  render:function(){
    return(
      <div>
        {this.state.play ? <div className="chellange">
          <button className="UIButton" onClick={this._block}>BLOCK</button>
          <button className="UIButton" onClick={this._chellangeAction}>CHELLANGE</button>
          <button className="UIButton" onClick={this._allow}>ALLOW</button>
        </div>:null}
      </div>
    );
  }
});

module.exports = Chellange;
