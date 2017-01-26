var React = require('react');
var OtherPlayer = React.createClass({
  getInitialState:function(){
    name:null,
    cards:[],
    sims:0
  },
  componentWillMount: function() {
    this.setState({
      cards:[{name:"Card Back",shown:false,style:{opacity:1}},{name:"Card Back",shown:false,style:{opacity:1}}],
      name:this.props.name,
      sims:this.props.sims
    });
  },
  render:function(){
    return(
      <div>
        this.state.cards.map(function(card){
          return(
              <img  id={card.name} src={"/public/"+card.name+".png"} alt={card.name} style={card.style}/>
          );
        });
        <h2>{this.state.name}</h1>
        <h1>{this.state.sims}</h1>
      </div>
    );
  }
});
module.exports = OtherPlayer;
