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



var MdParser = require('./MdParser')
    ,mongoose = require('mongoose')
;


/**
 * Does the insert into DB
 * @param output
 * @returns {Promise}
 */
var insertDoc = function(output) {
    var mdModel = mongoose.model('MdModel');
    return mdModel.create({
        markDownText: output.markDownText
        ,htmlText: output.htmlText

    });
};

/**
 * handler for POST /markdown/save
 * @param request
 * @param reply
 */
var saveFacade = function(request, reply) {

    var formData = request.payload
        ,strText = formData.mdtext
        ,output
    ;

    // check if we have markdown text
    if(!strText) {
        reply({success: false, message: 'Please enter a markdown text.'});
        return;
    }

    // parse the markdown and get html
    output = MdParser.toHtml(strText);

    // insert the parsed doc and markdown text into DB.
    insertDoc(output)
        .then(function(doc) {
            var jsn = {
                id: doc._id
                ,html: doc.htmlText
                ,success: true
            }

            // reply back to same page with the id, markdown text, parsed html and JSON as requested in the assignment.
            reply.view('index', {md: doc.markDownText, id: doc._id, htmlText: doc.htmlText, jsonText: JSON.stringify(jsn)});

        }, function(err) {

            reply(err);

        });
};


/**
 * hanlder for GET /markdown/get/{id?}
 * @param request
 * @param reply
 */
var getRecord = function(request, reply) {
    var id = request.params.id;

    // check if id param passed
    if(!id) {
        reply({success: false, message: 'Id is missing'});
        return;
    }

    var mdModel = mongoose.model('MdModel');

    // retrieve the requested id from db
    mdModel.find({_id: id}, function(err, doc) {
        if(err) {
            reply({success: false, message: 'No record available for provided Id'});
            return;
        } else {

            // send response
            if(!doc) {
                reply({success: false, message: 'No record available for provided Id'});
            } else {
                reply({success: true, root: [doc[0]]});
            }
        }
    });
};

module.exports = {
    saveFacade: saveFacade
    ,getRecord: getRecord
};