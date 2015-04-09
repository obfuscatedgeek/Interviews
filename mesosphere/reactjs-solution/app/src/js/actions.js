var constants = require('./constants');

var actions = {
  addServer: function() {
    this.dispatch(constants.ADD_SERVER, {id: ++window.SERVERID, apps: []});
  }

  ,removeServer: function() {
    this.dispatch(constants.REMOVE_SERVER);
  }

  ,removeApp: function(payload) {
    this.dispatch(constants.REMOVE_APP, payload);
  }

  ,addApp: function(payload) {
    this.dispatch(constants.ADD_APP, _.merge(payload, {pid: new Date().toJSON()}));
  }
};

module.exports = actions;
