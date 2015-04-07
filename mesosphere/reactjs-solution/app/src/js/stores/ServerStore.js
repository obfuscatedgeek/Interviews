var Fluxxor = require('fluxxor')
,constants = require('./../constants');

var ServerStore = Fluxxor.createStore({
  initialize: function() {
    this._servers = [
      {id: ++window.SERVERID}
      ,{id: ++window.SERVERID}
      ,{id: ++window.SERVERID}
      ,{id: ++window.SERVERID}];

    this.bindActions(
      constants.ADD_SERVER, this.onAddServer
      ,constants.REMOVE_SERVER, this.onRemoveServer
    );
  }

  ,onAddServer: function(payload) {
    this._servers.push(payload);
    this.emit('change');
  }

  ,onRemoveServer: function() {
    this._servers.pop();
    this.emit('change');
  }

  ,getState: function() {
    return this._servers;
  }
});

module.exports = ServerStore;
