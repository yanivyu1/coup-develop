var React = require('react');
var click = false;
var Cards = React.createClass({
  getInitialState: function() {
    return {
      cards:[{name:"card-back",shown:false,style:{opacity:1}},{name:"card-back",shown:false,style:{opacity:1}}],
      busted:true,
      exchange:false
    };
  },
  _exchangeCards:function(cards){
    var cardsTemp = this.state.cards;
    cardsTemp.push({name:cards[0],shown:false,style:{opacity:1}});
    cardsTemp.push({name:cards[1],shown:false,style:{opacity:1}});
    this.setState({
      cards:cardsTemp,
      exchange:true
    });
  },
  componentWillMount: function() {
    this.setState({
      cards: [{name:this.props.cards.card1,shown:false,style:{opacity:1}},{name:this.props.cards.card2,shown:false,style:{opacity:1}}],
      busted:this.props.busted
    });
    console.log(this.state.busted);
  },
  _click:function(trg){
    console.log(trg.target.attributes.getNamedItem('alt').value);
    if(this.state.cards[0].name == trg.target.attributes.getNamedItem('alt').value){
      this.setState({
        cards:[{name:this.props.cards.card1,shown:true,style:{opacity:0.5}},{name:this.props.cards.card2,shown:false,style:{opacity:1}}]
      });
    }
    else{
      this.setState({
        cards:[{name:this.props.cards.card1,shown:false,style:{opacity:1}},{name:this.props.cards.card2,shown:true,style:{opacity:0.5}}]
      });
    }
    socket.emit('showCard',trg.target.attributes.getNamedItem('alt').value);
  },
  render:function(){
    return(
      <div>
        {this.state.cards.map(function(card){
          return(
            <img onClick={this._click} id={card} disabled={this.state.busted} src={"/public/"+card.name+".png"} alt={card.name} style={card.style}/>
          )
        }.bind(this))}
      </div>
    );
  }
});
module.exports = Cards;
