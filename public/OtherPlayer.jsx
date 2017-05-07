var React = require('react');
var OtherPlayer = React.createClass({
  getInitialState:function(){
    return{
      name:null,
      cards:[],
      sims:0
    };
  },
  componentWillMount: function() {
    this.setState({
      cards:[{name:"card-back.jpg",shown:false,style:{opacity:1}},{name:"card-back.jpg",shown:false,style:{opacity:1}}],
      name:this.props.name,
      sims:this.props.sims
    });
  },
  componentDidMount: function() {
    socket.on('revealCard',this._revealCard);
    socket.on('otherRecivedCoins',this._recivedCoins);
  },
  recivedCoins:function(num){
    this.setState({
      sims:num
    });
  },
  _revealCard:function(card){
    if(!this.state.cards[0].shown){
      var cardsTemp = [{name:card+".png",shown:true,style:{opacity:1}},{name:"card-back.jpg",shown:false,style:{opacity:1}}];
    }
    else{
      var cardsTemp = [{name:"card-back.jpg",shown:false,style:{opacity:1}},{name:card+".png",shown:true,style:{opacity:1}}];
    }
    this.setState({
      cards:cardsTemp
    });
  },
  render:function(){
    return(
      <div>
        {this.state.cards.map(function(card){
          return(
              <img  id={card.name} src={"/public/"+card.name} alt={card.name} style={card.style}/>
          )
        })}
        <h2>{this.state.name}</h2>
        <h1>{this.props.sims}</h1>
      </div>
    );
  }
});
module.exports = OtherPlayer;
