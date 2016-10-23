var React = require('react');

var Join = React.createClass({
    getInitialState: function() {
      return {
        name:""
      };
    },
    _setName:function(event){
      console.log(event.target.value);
      this.setState({
        name:event.target.value.substr(0, 140)
      });
    },
    _submit:function(){
      console.log(this.state.name+" requested to join");
      socket.emit('join',this.state.name);
    },
    render:function(){
      return(
        <div className="join">
          <input className="textArea" type="text" value={this.state.name} onChange={this._setName}/>
          <br/><button className="joinButton" onClick={this._submit}>JOIN</button>
        </div>
      );
    }
});

module.exports = Join;
