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
 Date:     18/02/15

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */

var fs = require('fs');

/**
 * send the response back
 * @param res
 * @param isSuccess
 * @param data
 * @param message
 */
var sendResponse = function(res, isSuccess, data, message) {
    res.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
    res.write(JSON.stringify({success: isSuccess, data: data || message}));
    res.end();
}

/**
 * return the requested id from the list of data
 * @param id
 * @param al
 * @returns {*}
 */
var getById = function(id, al) {
    var objRet = null;
    al.forEach(function(da) {
        var item = da.split(',');
        if(parseInt(item[0], 10) === parseInt(id, 10)) {
            objRet = da;
        }
    });
    return objRet;
}

/**
 * converts the csv into an array
 * @param file
 * @returns {string[]}
 */
var readLines  = function(file) {
    var fs = require('fs');
    var array = fs.readFileSync(file).toString().split("\n");
    return array;
}

/**
 * does sorting on the data provided, based on the field and direction
 * @param data
 * @param sortOn
 * @param sortDirection
 * @returns {Array.<T>}
 */
var doSorting = function(data, sortOn, sortDirection) {

    var alFields = {
        id: 0
        ,createdAt: 1
        ,customerName: 2
        ,address: 3
        ,items: 4
    };

    if(!alFields[sortOn] && alFields[sortOn] !== 0) {
        return null;
    }

    return data.sort(function(a, b) {
        var data1 = a.split(',')
            ,data2 = b.split(',')
            ;

        if(sortOn === 'items') {
            if(data1[alFields[sortOn]].split('/').length > data2[alFields[sortOn]].split('/').length) {
                return sortDirection === 'A' ? 1: -1;
            }

            if (data1[alFields[sortOn]].split('/').length < data2[alFields[sortOn]].split('/').length) {
                return sortDirection === 'A' ? -1: 1;
            }
        } else {

            if(data1[alFields[sortOn]] > data2[alFields[sortOn]]) {
                return sortDirection === 'A' ? 1: -1;
            }

            if (data1[alFields[sortOn]] < data2[alFields[sortOn]]) {
                return sortDirection === 'A' ? -1: 1;
            }
            // a must be equal to b
            return 0;
        }
    });
};

module.exports = {
    sendResponse: sendResponse
    ,getById: getById
    ,readLines: readLines
    ,doSorting: doSorting
};