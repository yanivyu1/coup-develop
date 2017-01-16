var React = require('react');
var click = false;
var Cards = React.createClass({
  getInitialState: function() {
    return {
      cards:[{name:"Card Back",shown:false,style:{opacity:1}},{name:"Card Back",shown:false,style:{opacity:1}}]
    };
  },
  componentDidMount: function() {

  },
  componentWillMount: function() {
    this.setState({
      cards: [{name:this.props.cards.card1,shown:false,style:{opacity:1}},{name:this.props.cards.card2,shown:false,style:{opacity:1}}]
    });
  },
  _click:function(trg){
    trg.setState({
      opacity:0.5
    });
    socket.emit('showCard',trg.name);
  },
  render:function(){
    return(
      <div>
        {this.state.cards.map(function(card){
          return(
            <img onClick={this._click} src={"/public/"+card.name+".png"} alt={card.name} style={card.style}/>
          )
        }.bind(this))}
      </div>
    );
  }
});
module.exports = Cards;
