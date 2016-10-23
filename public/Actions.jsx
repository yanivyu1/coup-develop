var React = require('react');
var actionsTemp = [];
var Actions = React.createClass({
  getInitialState:{
    return{
        actions:[]
    }
  },
  componentDidMount: function() {
    socket.on('updateActions',this._update);
  },
  _update:function(object){
    actionsTemp.push(object);
    
  },
});
