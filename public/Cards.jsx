var React = require('react');
var click = false;
var Cards = React.createClass({
  getInitialState: function() {
    return {
      cards:[{name:"Card Back",shown:false,style:{opacity:1}},{name:"Card Back",shown:false,style:{opacity:1}}],
      busted:false
    };
  },
  componentDidMount: function() {

  },
  componentWillMount: function() {
    this.setState({
      cards: [{name:this.props.cards.card1,shown:false,style:{opacity:1}},{name:this.props.cards.card2,shown:false,style:{opacity:1}}],
      busted:this.props.busted
    });
    console.log(this.state.busted);
  },
  _click:function(trg){
    console.log(trg.targetValue);
    this.setState({

    });
    socket.emit('showCard',trg.name);
    this.setState({
      busted:false
    });
  },
  render:function(){
    return(
      <div>
        {this.state.cards.map(function(card){
          return(
            <img onClick={this._click} id={card} disabled={!this.state.busted} src={"/public/"+card.name+".png"} alt={card.name} style={card.style}/>
          )
        }.bind(this))}
      </div>
    );
  }
});

module.exports = Cards;
