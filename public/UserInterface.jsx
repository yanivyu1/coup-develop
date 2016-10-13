var React = require('react');

var UserInterface = React.createClass({
  getInitialState: function() {
    return {
      income:false,foreignAid:false,tax:false,steal:false,exchange:false,assassinate:false,coup:false
    };
  },
  getIncome:function(){
    socket.emit('getIncome');
    console.log("get income");
  },
  render:function(){
    return(
      <div className="userInterface">
        <div className="actions">
          <button disabled={this.state.income} onClick={this.getIncome}>Income</button>
          <button disabled={this.state.foreignAid} onClick={this.getForeignAid}>Foreign Aid</button>
          <button disabled={this.state.tax} onClick={this.getTax}>Tax</button>
          <button disabled={this.state.steal} onClick={this.steal}>Steal</button>
          <button disabled={this.state.exchange} onClick={this.exchange}>Exchange</button>
          <button disabled={this.state.assassinate} onClick={this.assassinate}>Assassinate</button>
          <button disabled={this.state.coup} onClick={this.coup}>Coup</button>
        </div>
    </div>
    );
  }
});

module.exports = UserInterface;
