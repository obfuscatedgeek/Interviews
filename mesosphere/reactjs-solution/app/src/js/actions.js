var constants = require('./constants');

var actions = {
  addServer: function() {
    this.dispatch(constants.ADD_SERVER, {id: ++window.SERVERID});
  }

  ,removeServer: function() {
    this.dispatch(constants.REMOVE_SERVER);
  }

  ,removeApp: function() {
    console.log('we are going to remove app');
  }

  ,addApp: function() {
    console.log('we are going to add some app somewhere');
  }
};

module.exports = actions;
