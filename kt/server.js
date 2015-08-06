// vim: sw=4:ts=4:nu:nospell:fdc=4
/*global Ext:true */
/*global angular:true */
/*global $:true */
/*jslint browser: true, devel:true, sloppy: true, white: true, plusplus: true */

/*
 This file is part of ___ Package

 Copyright (c) 2014, Ejaz Bawasa

 Package:  ___
 Author:   Ejaz Bawasa
 Contact:  http://extjs.eu/contact
 Date:     21/03/15

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */
var Path = require('Path')
    ,Hapi = require('hapi')
    ,db = require('./models/dbConnection')
    ,Router = require('./router')
    ,server = new Hapi.Server()
;

server.connection({ port: 3000 });

// configure views
server.views({
    engines: {
        html: require('handlebars')

    }
    ,isCached: false
    ,path: Path.join(__dirname, 'views')
});


/**
 * Configure routes
 */
server.route({
    method: 'POST'
    ,path: '/markdown/save'
    ,handler: Router.saveFacade
});

server.route({
    method: 'GET'
    ,path: '/markdown/get/{id?}'
    ,handler: Router.getRecord

});

server.route({
    method: 'GET'
    ,path: '/'
    ,handler: function(request, reply) {
        reply.view('index');
    }
});

server.route({
    method: 'GET'
    ,path: '/output'
    ,handler: function(request, reply) {
        reply.view('output');
    }
});

/**
 * Start server
 */
server.start(function () {
    console.log('Server running at:', server.info.uri);
});