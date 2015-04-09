var React = require('react');

var Server = React.createClass({

  render: function() {
    return (
      <li className="server">{this.props.data.id}


      {this.props.data.apps.map(function(app) {
        return <p>{app.name}</p>
      })}

      </li>


    );
  }
});


module.exports = Server;
