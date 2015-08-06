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


/**
 * this is the schema structure that we will store in DB
 * @type {*|exports}
 */
var mongoose = require('mongoose');

var mdSchema = new mongoose.Schema({
    markDownText: {
        type: String
        ,default: ''
    }
    ,htmlText: {
        type: String
        ,default: ''
    }
});

var MdModel = module.exports = mongoose.model('MdModel', mdSchema);