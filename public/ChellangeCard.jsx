var React = require('react');

var chellangeCard = React.createClass({
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
    console.log(this.state.action);
  },
  _chellange:function(){
    socket.emit('chellangeAction',this.state.action);
    this.setState({
      play:false
    });
  },
  _accept:function(){
    socket.emit('accept',this.state.action);
    this.setState({
      play:false
    });
  },
  render:function(){
    return(
      <div>
        {this.state.play ? <div className="chellangeCard">
          <button onClick={this._chellange} className="UIButton">Chellange</button>
          <button onClick={this._accept} className="UIButton">Accept</button>
        </div> : null}
      </div>
    );
  }
});
module.exports = chellangeCard;
