var React = require('react');

var UserInterface = React.createClass({
  getInitialState: function() {
    return {
      income:false,foreignAid:false,tax:false,steal:false,exchange:false,assassinate:false,coup:false,coins:0
    };
  },
  getIncome:function(){
    this.setState({
        income:true,foreignAid:true,tax:true,steal:true,exchange:true,assassinate:true,coup:true
    });
    socket.emit('getIncome');
    console.log("get income");
  },
  foreignAid:function(){
    this.setState({
        income:true,foreignAid:true,tax:true,steal:true,exchange:true,assassinate:true,coup:true
    });
    socket.emit('getForeignAid');
  },
  componentDidMount: function() {
    socket.on('recivedCoins',this._recivedCoins);
  },
  _recivedCoins:function(num){
    this.setState({
      coins:num
    });
  },
  render:function(){
    return(
      <div className="userInterface">
        <div className="actions">
          <button className="UIButton" disabled={this.state.income} onClick={this.getIncome}>Income</button>
          <button className="UIButton" disabled={this.state.foreignAid} onClick={this.getForeignAid}>Foreign Aid</button>
          <button className="UIButton" disabled={this.state.tax} onClick={this.getTax}>Tax</button>
          <button className="UIButton" disabled={this.state.steal} onClick={this.steal}>Steal</button>
          <button className="UIButton" disabled={this.state.exchange} onClick={this.exchange}>Exchange</button>
          <button className="UIButton" disabled={this.state.assassinate} onClick={this.assassinate}>Assassinate</button>
          <button className="UIButton" disabled={this.state.coup} onClick={this.coup}>Coup</button>
        </div>
        <div className="sims">
          <div className="coinsImage">
          </div>
          <h1>{this.state.coins}</h1>
        </div>
    </div>
    );
  }
});

module.exports = UserInterface;
