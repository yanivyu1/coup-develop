var React = require('react');

var UserInterface = React.createClass({
  getInitialState: function() {
    return {
      income:false,foreignAid:false,tax:false,steal:false,exchange:false,assassinate:true,coup:true,play:false
    };
  },
  getIncome:function(){
    this.setState({
        income:true,foreignAid:true,tax:true,steal:true,exchange:true,assassinate:true,coup:true,play:false
    });
    socket.emit('getIncome');
    console.log("get income");
  },
  getForeignAid:function(){
    this.setState({
        income:true,foreignAid:true,tax:true,steal:true,exchange:true,assassinate:true,coup:true,play:false
    });
    socket.emit('getForeignAid');
  },
  getTax:function(){
    console.log("get tax");
    socket.emit('getTax');
    this.setState({
      play:false
    });
  },
  exchange:function(){
    console.log("exchange");
    socket.emit('exchange');
    this.setState({
      play:false
    });

  },
  steal:function(){
    console.log("steal");
    socket.emit('steal');
    this.setState({
      play:false
    });
  },
  componentWillMount: function() {
    console.log(this.props);
    this.setState({
      play:true,
      assassinate:this.props.coins > 3 ? true : false,
      coup:this.props.coins > 7 ? true : false,
    });
    console.log(this.state);
  },
  render:function(){
    return(
      <div className="userInterface">
        {this.state.play ? <div className="actions">
          <button className="UIButton" disabled={this.state.income} onClick={this.getIncome}>Income</button>
          <button className="UIButton" disabled={this.state.foreignAid} onClick={this.getForeignAid}>Foreign Aid</button>
          <button className="UIButton" disabled={this.state.tax} onClick={this.getTax}>Tax</button>
          <button className="UIButton" disabled={this.state.steal} onClick={this.steal}>Steal</button>
          <button className="UIButton" disabled={this.state.exchange} onClick={this.exchange}>Exchange</button>
          <button className="UIButton" disabled={this.state.assassinate} onClick={this.assassinate}>Assassinate</button>
          <button className="UIButton" disabled={this.state.coup} onClick={this.coup}>Coup</button>
        </div> : null}
    </div>
    );
  }
});

module.exports = UserInterface;
