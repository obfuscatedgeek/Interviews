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
 Date:     17/02/15

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */

var fs = require('fs')
    ,url = require('url')
    ,utils = require('./utilities')
    ,qs = require('querystring');
;

/**
 * get handler, returns the entire data or a particular item
 * @param req
 * @param res
 */
var getBoxes = function(req, res) {
    var strUrl = req.url
        ,queryParams = null
        ,dataFile = utils.readLines('./examples.csv')
    ;

    // get the url parameters.
    if(req.url.indexOf('?') > 0) {
        queryParams = url.parse(strUrl.substr(strUrl.indexOf('?')), true).query;
    }

    // return a particular item
    if(queryParams && queryParams.id) {

        var item = utils.getById(queryParams.id, dataFile);

        if(item) {
            utils.sendResponse(res, true, item);
        } else {
            // response with error message if no id found
            utils.sendResponse(res, false, null, 'Requested item does not exist');
        }
    };

    utils.sendResponse(res, true, dataFile);
    return;
};

/**
 * post handler, adds a new line in the data file
 * @param req
 * @param res
 */
var postBoxes = function(req, res) {
    var strUrl = req.url
        ,body = ''
        ,dataFile = utils.readLines('./examples.csv')
        ;

    // collect the data
    req.on('data', function (data) {
        body += data;

        // if data length is big break;
        if (body.length > 1e6)
            request.connection.destroy();
    });

    // wait for request to get over
    req.on('end', function () {
        var post = qs.parse(body);

        // check for customer name
        if(!post.customerName) {
            utils.sendResponse(res, true, 'Customer name is required');
            return;
        }

        // check for address
        if(!post.address) {
            utils.sendResponse(res, true, 'Address is required');
            return;
        }

        // check for items
        if(!post.items) {
            utils.sendResponse(res, true, 'Items are required');
            return;
        }

        var alItems = [];
        if(dataFile.length > 0) {
            alItems.push(parseInt(dataFile[(dataFile.length)-1].split(',')[0], 10)+1);
        } else {
            alItems.push(dataFile.length+1);
        }
        alItems.push(new Date());
        alItems.push(post.customerName);
        alItems.push(post.address);
        alItems.push(post.items);


        // insert the data & send response
        fs.appendFile('./examples.csv', "\n"+alItems.join(', '), function (err) {
            if (err) throw err;
            utils.sendResponse(res, true, 'write successful');
        });
    });
};

/**
 * delete handler, deletes a particular item from data
 * @param req
 * @param res
 */
var deleteBoxes = function(req, res) {

    var strUrl = req.url
        ,queryParams = null
        ,dataFile = utils.readLines('./examples.csv')
    ;

    // get the url parameters.
    if(req.url.indexOf('?') > 0) {
        queryParams = url.parse(strUrl.substr(strUrl.indexOf('?')), true).query;
    }

    if(queryParams && queryParams.id) {
        var item = utils.getById(queryParams.id, dataFile);

        if(item) {
            dataFile.splice(dataFile.indexOf(item), 1);

            fs.writeFile('./examples.csv', "");

            dataFile.forEach(function(d, index) {
                fs.appendFileSync('./examples.csv', index === dataFile.length-1 ? d : d+" \n");
            });
            utils.sendResponse(res, true, dataFile);
        } else {
            utils.sendResponse(res, false, 'Item does not exist');
        }
    } else {
        utils.sendResponse(res, false, 'Need id of item to be removed');
    }
};

/**
 * findBoxes handler, returns sorted data based on sortedOn and sortedDirection parameters
 * @param req
 * @param res
 */
var findBoxes = function(req, res) {
    var strUrl = req.url
        ,queryParams = null
        ,dataFile = utils.readLines('./examples.csv')
        ,retObj = null
    ;

    // get the url parameters.
    if(req.url.indexOf('?') > 0) {
        queryParams = url.parse(strUrl.substr(strUrl.indexOf('?')), true).query;
    }

    // return sorted item
    if(queryParams && (queryParams.sort || queryParams.direction)) {

        var sortOn = queryParams.sort || null
            ,sortDirection = queryParams.direction || null
        ;

        if(!sortOn) {
            utils.sendResponse(res, false, null, 'Sorting field required to sort on');
            return;
        }

        if(!sortDirection) {
            utils.sendResponse(res, false, null, 'Sorting direction required to sort on');
            return;
        }

        // do the sorting
        retObj = utils.doSorting(dataFile, sortOn, sortDirection)
        if(!retObj) {
            utils.sendResponse(res, true, 'Incorrect field to sort on');
        } else {
            utils.sendResponse(res, true, retObj);
        }
        return;
    } else {
        utils.sendResponse(res, true, dataFile);
        return;
    }
};

module.exports = {
    getBoxes: getBoxes
    ,postBoxes: postBoxes
    ,deleteBoxes: deleteBoxes
    ,findBoxes: findBoxes
};