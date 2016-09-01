var React = require('react');
var ReactDOM = require('react-dom');
var socket = io.connect();
var Main = React.createClass({
  render:function(){
    return(
      <h1>Welcom to coup treason</h1>
    );
  }
});

ReactDOM.render(<Main/>,document.getElementById('main'));
