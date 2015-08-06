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
 Date:     22/03/15

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */
// vim: sw=4:ts=4:nu:nospell:fdc=4
/*global Ext:true */
/*jslint browser: true, devel:true, sloppy: true, white: true, plusplus: true */

/*
 This file is part of ___ Package

 Copyright (c) 2014, Ejaz Bawasa

 Package:  ___
 Author:   Ejaz Bawasa
 Contact:  http://extjs.eu/contact
 Date:     14/10/14

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */


/**
 * Connection to MongoDB
 * @type {*|string}
 */
var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '8080';

var mongoose = require('mongoose')    ;
var connection_string = '127.0.0.1:27017/kreditech';

mongoose.connect(connection_string);

mongoose.connection.on('connected', function() {
    console.log('Mongoose default connection open to '+connection_string);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose connection disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose connection closed due to app termination');
        process.exit(0);
    });
});

require('./MdModel');
