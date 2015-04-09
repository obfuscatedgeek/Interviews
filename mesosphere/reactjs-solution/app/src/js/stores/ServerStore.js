var Fluxxor = require('fluxxor')
,constants = require('./../constants');

var ServerStore = Fluxxor.createStore({
  initialize: function() {
    this._servers = [
      {id: ++window.SERVERID, apps: []}
      ,{id: ++window.SERVERID, apps: []}
      ,{id: ++window.SERVERID, apps: []}
      ,{id: ++window.SERVERID, apps: []}
      ];

    this._currentServerState = _.groupBy(this._servers, function(n) {
        return n.apps.length;
    });

    this._appStatus = {};


    this.bindActions(
      constants.ADD_SERVER, this.onAddServer
      ,constants.REMOVE_SERVER, this.onRemoveServer
      ,constants.ADD_APP, this.onAddApp
      ,constants.REMOVE_APP, this.onRemoveApp
    );

    // re-check the current state after every change
    this.on('change', function() {
      this._currentServerState = _.groupBy(this._servers, function(n) {
          return n.apps.length;
      });
    }, this);
  }

  ,onAddServer: function(payload) {
    this._servers.push(payload);
    this.emit('change');
  }

  ,onRemoveServer: function() {
    var serverToRemove = this._servers[this._servers.length-1];

    // return if no server found
    if(!serverToRemove) {
      return;
    }

    // if server contains apps, add it to next available server.
    if(serverToRemove.apps.length > 0) {
      serverToRemove.apps.forEach(this.onAddApp);
    }

    // remove server
    this._servers.pop();


    this.emit('change');
  }

  ,onAddApp: function(app) {

    var availableServer = null;

    // get the best available server based on no. of apps running in each server.
    if(this._currentServerState[0] && this._currentServerState[0].length > 0) {
      availableServer = this._currentServerState[0][0];
    } else if(this._currentServerState[1] && this._currentServerState[1].length > 0) {
      availableServer = this._currentServerState[1][0];
    }

    // continue only if a server found
    if(!availableServer) {
      return;
    }

    // track which server did the app get last added to
    if(this._appStatus[app.name]) {
      this._appStatus[app.name].lastModified.push(availableServer.id);
    } else {
      this._appStatus[app.name] = {
        lastModified: [availableServer.id]
      };
    }

    // add app to server
    availableServer.apps.push(app);


    this.emit('change');
  }

  ,onRemoveApp: function(app) {

    var lastModifiedServer = null
    ,lastModifiedServerId =  null
    ,appIndex = null
    ;

    if(!this._appStatus[app.name]) {
      return;
    }

    if(this._appStatus[app.name].lastModified.length === 0) {
      return;
    }

    // get the id of last modified server
    lastModifiedServerId = _.last(this._appStatus[app.name].lastModified);

    // find the exact server based on id
    lastModifiedServer = this._servers[_.findIndex(this._servers, 'id', lastModifiedServerId)];

    // find the index of app
    appIndex = _.findLastIndex(lastModifiedServer.apps, 'name', app.name);

    //remove app
    lastModifiedServer.apps.splice(appIndex, 1);

    // remove the server from lastModified array
    this._appStatus[app.name].lastModified.pop();

    this.emit('change');
  }

  ,getState: function() {
    return this._servers;
  }
});



module.exports = ServerStore;
