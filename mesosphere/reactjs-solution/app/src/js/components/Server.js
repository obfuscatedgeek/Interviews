var React = require('react');

var Server = React.createClass({

  render: function() {
    return (
      <li className="server">{this.props.data.id}</li>
    );
  }
});


module.exports = Server;
