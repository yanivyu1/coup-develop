var React = require('react');

var Cards = React.createClass({
  getInitialState: function() {
    return {
      cards:[{name:null,shown:false},{name:null,shown:false}];
    };
  },
  render:function(){
    return(
      <div>
        <div className={this.state.cards[0].name}></div>
      </div>
    );
  }
});
