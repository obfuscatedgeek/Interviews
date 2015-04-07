var React = require('react');

var App = React.createClass({

  removeApp: function() {
      this.props.flux.actions.removeApp(this.props.data);
  }

  ,addApp: function() {
    this.props.flux.actions.addApp(this.props.data);
  }

  ,render: function() {
    return (
      <p>
      <div className="row">
        <div className="columns large-6">{this.props.data.name}</div>
        <div className="columns large-2" onClick={this.removeApp}><a className="tiny button round alert"> - </a></div>
        <div className="columns large-2" onClick={this.addApp}><a className="tiny button round warning"> + </a></div>
        <div className="columns large-2">&nbsp;</div>
      </div>
      </p>
    );
  }
});

module.exports = App;
