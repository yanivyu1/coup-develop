var React = require('react');

var chellangeCard = React.createClass({
  getInitialState: function() {
    return {
      action:null
    };
  },
  componentWillMount: function() {
    this.setState({
      card:this.props.action
    });
  },
  _chellange:function(){
    socket.emit('chellange',this.state.action);
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
