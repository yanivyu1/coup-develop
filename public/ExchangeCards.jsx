var React = require('react');
var ExchangeCards = React.createClass({
  getInitialState: function() {
    return {
      cards:[],
      busted:false,
      count:0,
      click:[0,0,0,0]
    };
  },
  componentWillMount: function() {
    console.log(this.props.cards);
    for(var i=0;i<this.props.cards.length;i++){

    }
    this.setState({
      cards:this.props.cards
    });
  },
  _click:function(index,trg){
    console.log(index);
    if(this.state.click[index] === 0){
      this.setState({
        count:this.state.count++,
        // click[index]:1
      });
      console.log(this.state.count);
      trg.target.attributes.style.opacity = 0.5;
    }
  },
  render:function(){
    var i = 0;
    return(
      <div className="exchangeCards">
        {this.state.cards.map(function(card,index){
          return(
            <img onClick={this._click.bind(this,index)} id={card} disabled={this.state.busted} src={"/public/"+card+".png"} alt={card}/>
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
