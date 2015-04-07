var React = require('react')
,Fluxxor = require('fluxxor')
;

window.SERVERID = 0;

var ServerStore = require('./stores/ServerStore')
,AppStore = require('./stores/AppStore')
,Application = require('./components/Application')
;

var stores = {
  ServerStore: new ServerStore()
  ,AppStore: new AppStore()
};

var actions = require('./actions');


var flux = new Fluxxor.Flux(stores, actions);

window.flux = flux;


flux.on('dispatch', function(type, payload) {
  console.log("Dispatch: ", type, payload);
});

React.render(<Application flux={flux}/>, document.getElementById('container'));
