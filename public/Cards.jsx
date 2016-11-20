var React = require('react');
var click = false;
var Cards = React.createClass({
  getInitialState: function() {
    return {
      cards:[{name:"Captain",shown:false,style:{opacity:1}},{name:"Ambessador",shown:false,style:{opacity:1}}]
    };
  },
  componentDidMount: function() {

  },
  render:function(){
    return(
      <div className="cards">
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
