var React = require('react');

var chellangeCard = React.createClass({
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
    console.log(this.state.action);
  },
  _chellange:function(){
    socket.emit('chellangeAction',this.state.action);
  },
  _accept:function(){
    socket.emit('accept',this.state.action);
  },
  render:function(){
    return(
      <div className="chellangeCard">
        <button onClick={this._chellange} className="UIButton">Chellange</button>
        <button onClick={this._accept} className="UIButton">Accept</button>
      </div>
    );
  }
});
module.exports = chellangeCard;
