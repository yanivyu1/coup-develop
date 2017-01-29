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
      cards:[{name:"card-back",shown:false,style:{opacity:1}},{name:"card-back",shown:false,style:{opacity:1}}],
      name:this.props.name,
      sims:this.props.sims
    });
  },
  render:function(){
    return(
      <div>
        {this.state.cards.map(function(card){
          return(
              <img  id={card.name} src={"/public/"+card.name+".png"} alt={card.name} style={card.style}/>
          )
        })};
        <h2>{this.state.name}</h2>
        <h1>{this.state.sims}</h1>
      </div>
    );
  }
});
module.exports = OtherPlayer;
