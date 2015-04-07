var Fluxxor = require('fluxxor')
,contants = require('./../constants')
;


var AppStore = Fluxxor.createStore({

  initialize: function() {
    this._apps = [
    {name: 'Hadoop', id: 1}
    ,{name: 'Chrono OS', id: 2}
    ,{name: 'Mongo DB', id: 3}
    ];
  }

  ,getState: function() {
    return this._apps;
  }

});

module.exports = AppStore;
