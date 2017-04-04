var React = require('react');
var clickTemp = [0,0,0,0];
var countTemp = 0;
var ExchangeCards = React.createClass({
  getInitialState: function() {
    return {
      cards:[],
      busted:false,
      count:0,
      click:[0,0,0,0],
      swipeCount:0
    };
  },
  componentWillMount: function() {
    console.log(this.props.cards);
    this.setState({
      cards:this.props.cards,
      swipeCount:this.props.length
    });
  },
  _click:function(index,trg){
    console.log(index);
    if(this.state.click[index] === 0){
      countTemp++;
      clickTemp[index] = 1;
      this.setState({
        count:countTemp,
        click:clickTemp
      });
      console.log(this.state);
      // trg.target.attributes.style.opacity = 0.5;
    }
    else{
      clickTemp[index] = 0;
      countTemp--;
      this.setState({
        count:countTemp,
        click:clickTemp
      });
      console.log(this.state);
      // trg.target.attributes.style.opacity = 1;
    }
  },
  _submit:function(){
    socket.emit('swipeCards',[{"name":this.state.cards[0],"swipe":this.state.click[0]},{"name":this.state.cards[1],"swipe":this.state.click[1]},{"name":this.state.cards[2],"swipe":this.state.click[2]},{"name":this.state.cards[3],"swipe":this.state.click[3]}]);
    this.setState({
      count:0,
      click:[0,0,0,0],
      cards:[]
    });
    clickTemp = [0,0,0,0];
    countTemp = 0;
  },
  render:function(){
    return(
      <div className="exchangeCards">
        {this.state.cards.map(function(card,index){
          return(
            <img onClick={this._click.bind(this,index)} id={card} disabled={this.state.busted} src={"/public/"+card+".png"} alt={card}/>
          )
        }.bind(this))}
        <div>
          {countTemp === this.state.swipeCount-2 ? <button className="UIButton" onClick={this._submit}>SUBMIT</button> : null}
        </div>
      </div>
    );
  }
});
module.exports=ExchangeCards;
