var React = require('react');
var ExchangeCards = React.createClass({
  getInitialState: function() {
    return {
      cards:[],
      busted:false,
      count:0
    };
  },
  componentWillMount: function() {
    this.props.cards
    this.setState({
      cards:this.props.cards
    });
  },
  _click:function(index,trg){
    console.log(index);
  },
  render:function(){
    var i = 0;
    return(
      <div className="exchangeCards">
        {this.state.cards.map(function(card,index){
          return(
            <img onClick={this._click.bind(this,index)} id={card} disabled={this.state.busted} src={"/public/"+card.name+".png"} alt={card.name} style={card.style}/>
          )
        }.bind(this))}
        <div>
          {this.state.count == 2 ? <button className="UIButton" onClick={this._submit}>SUBMIT</button> : null}
        </div>
      </div>
    );
  }
});
module.exports=ExchangeCards;
