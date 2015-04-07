var React = require('react')
  ,Fluxxor = require('Fluxxor')
  ,Server = require('./Server')
  ,App = require('./App')
  ,FluxMixin = Fluxxor.FluxMixin(React)
  ,StoreWatchMixin = Fluxxor.StoreWatchMixin
;

var Application = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('ServerStore', 'AppStore')]

  ,getInitialState: function() {
    return {servers: [], apps: []};
  }

  ,getStateFromFlux: function() {
    var flux = this.getFlux();

    return {
      _servers: flux.store('ServerStore').getState()
      ,_apps: flux.store('AppStore').getState()
      ,_config: {}
    }
  }

  ,addServer: function() {
    this.getFlux().actions.addServer();

  }

  ,removeServer: function() {
    this.getFlux().actions.removeServer();
  }

  ,render: function() {
    return (
      <div className="row">
        <div className="columns large-4">
          <p className="panel text-center">
            <a className="button tiny round" onClick={this.addServer}>Add server</a> <a className="button tiny round" onClick={this.removeServer}>Remove server</a>
          </p>
          <p className="panel">
            <h3 className="">Available apps</h3>
            <div>
                {this.state._apps.map(function(app) {
                  return <App data={app} flux={this.getFlux()}/>
                }, this)}
            </div>
          </p>
        </div>
        <div className="columns large-8">
          <h1>Available servers !!</h1>
          <ul className="small-block-grid-4">
            {this.state._servers.map(function(server) {
              return <Server data={server}/>;
            })}
          </ul>
        </div>

      </div>
    );
  }
});

module.exports = Application;
