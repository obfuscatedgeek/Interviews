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
 * get handler, return the entire data or the requested data
 * @param req
 * @param res
 */
var getBox = function(req, res) {
    var strUrl = req.url
        ,queryParams = null;

    // get the url parameters.
    if(req.url.indexOf('?') > 0) {
        queryParams = url.parse(strUrl.substr(strUrl.indexOf('?')), true).query;
    }

    // return a particular item
    if(queryParams && queryParams.id) {

        var item = utils.getById(queryParams.id, DATA);

        if(item) {
            utils.sendResponse(res, true, item);
        } else {
            // response with error message if no id found
            utils.sendResponse(res, false, null, 'Requested item does not exist');
        }
    };

    utils.sendResponse(res, true, DATA);
    return;
};


/**
 * post handler, adds data to the array
 * @param req
 * @param res
 */
var postBox = function(req, res) {
    var strUrl = req.url
        ,body = ''
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

            // formulate the data
            var alItems = [];
            if(DATA.length > 0) {
                alItems.push(parseInt(DATA[(DATA.length)-1].split(',')[0], 10)+1);
            } else {
                alItems.push(DATA.length+1);
            }
            alItems.push(new Date());
            alItems.push(post.customerName);
            alItems.push(post.address);
            alItems.push(post.items);

            // insert the data & send response
            DATA.push(alItems.join(', '));
            utils.sendResponse(res, true, DATA[(DATA.length -1)]);
        });
};

/**
 * delete handler, deletes a particular record from array
 * @param req
 * @param res
 */
var deleteBox = function(req, res) {

    var strUrl = req.url
        ,queryParams = null;

    // get the url parameters.
    if(req.url.indexOf('?') > 0) {
        queryParams = url.parse(strUrl.substr(strUrl.indexOf('?')), true).query;
    }

    if(queryParams && queryParams.id) {
        var item = utils.getById(queryParams.id, DATA);

        if(item) {
            DATA.splice(DATA.indexOf(item), 1);
            utils.sendResponse(res, true, DATA);
        } else {
            utils.sendResponse(res, false, 'Item does not exist');
        }
    } else {
        utils.sendResponse(res, false, 'Need id of item to be removed');
    }
};


/**
 * find handler, returns a sorted data based on sortedOn, sortedDirection parameters in request
 * @param req
 * @param res
 */
var findBox = function(req, res) {

    var strUrl = req.url
        ,queryParams = null
        ,retObj
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
        retObj = utils.doSorting(DATA, sortOn, sortDirection)

        if(!retObj) {
            utils.sendResponse(res, true, 'Incorrect field to sort on');
        } else {
            utils.sendResponse(res, true, retObj);
        }
        return;

    } else {
        utils.sendResponse(res, true, DATA);
        return;
    }
};

module.exports = {
    getBox: getBox
    ,postBox: postBox
    ,deleteBox: deleteBox
    ,findBox: findBox
}