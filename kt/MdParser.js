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
var fs = require('fs')

/**
 * this contains all the rules for parsing the markdown text
 * @type {{Rules: *[], HeaderBlock: Function, EmphasizeBlock: Function, BoldBlock: Function, ABlock: Function, ParaBlock: Function}}
 */
var Parsers = {
    Rules: [
        [/(#+)(.*)/, 'HeaderBlock']
        ,[/(\*\*|__)(.*?)\1/g, 'BoldBlock']
        ,[/(\*|_)(.*?)\1/g, 'EmphasizeBlock']
        ,[/\[([^\[]+)\]\(([^\)]+)\)/g, 'ABlock']
    ]
    ,HeaderBlock: function(str, r) {
        var hLength = str.match(r)[1].trim().length
            ,text = str.split(r)[2].trim();
        return '<h'+hLength+'>'+text+'</h'+hLength+'>';
    }
    ,EmphasizeBlock: function(str, r) {
        return str.replace(r, '<em>$2</em>');
    }
    ,BoldBlock: function(str,r) {
        return str.replace(r, '<strong>$2</strong>');
    }
    ,ABlock: function(str, r) {
        return str.replace(r, '<a href="$2">$1</a>')
    }
    ,ParaBlock: function(str) {
        return '<p>'+str+'</p>';
    }
};

/**
 * Facade where the parsing actually starts.
 * @param strText
 * @returns {{markDownText: *, htmlText}}
 */
var toHtml = function(strText) {
    var alLines
        ,regStandardizer = /\r\n/g
        ,strHtml
    ;

    // standardize the markdown
    alLines = strText.replace(regStandardizer, '\n' );

    // get individual lines
    alLines = alLines.split('\n');

    // begin processing
    strHtml = processLines(alLines);

    return {
        markDownText: strText
        ,htmlText: strHtml
    }
};

var processLines = function(lines) {

    var Final = []
        ,strFinal
    ;

    // go through each lines
    lines.forEach(function(l) {

        l = l.trim();

        if(l.length > 0) {

            if(l[0].match(/[a-zA-Z0-9]/)) {
                l = Parsers .ParaBlock(l);
            }

            // go through each Rule
            Parsers.Rules.forEach(function(rule) {

                // try the rule and call the parser only if the rule matches.
                if(l.match(rule[0])) {
                    l = Parsers[rule[1]](l, rule[0]);
                }

            });
        }

        // collect the parsed lines
        Final.push(l);
    });

    //formulate the output html
    strFinal = '<!DOCTYPE html> <html> <head lang="en"> <meta charset="UTF-8"> <title></title> </head> <body>'+Final.join('')+'</body></html>';

    // write to file
    fs.writeFile("./views/output.html", strFinal, function(err) {
        if(err) {
            return console.log(err);
        }
    });

    // return string.
    return strFinal;
};

module.exports = {
    toHtml: toHtml
};
