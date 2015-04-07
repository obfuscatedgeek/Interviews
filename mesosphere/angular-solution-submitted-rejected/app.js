// vim: sw=4:ts=4:nu:nospell:fdc=4
/*global Ext:true */
/*global _:true */
/*global angular:true */
/*jslint browser: true, devel:true, sloppy: true, white: true, plusplus: true */

/*
 This file is part of ___ Package

 Copyright (c) 2014, Ejaz Bawasa

 Package:  ___
 Author:   Ejaz Bawasa
 Contact:  http://extjs.eu/contact
 Date:     26/03/15

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */

(function () {
    'use strict';

    angular.module('mesosphere', [
    ])
        .controller('AppCtrl', ['$scope', 'EVENTS', function ($scope, EVENTS) {

            // PRIMARY KEYS FOR SERVERS AND APPS
            var SERVERID = -1
                ,APPID = -1
                ,Server = function(name) {
                    this.config = {
                        name: name
                        ,apps: []
                        ,id: ++SERVERID
                    };

                    this.addApp = function(app) {
                        this.config.apps.push(app);
                    };

                    this.removeApp = function(appId) {
                        var appIndex;
                        this.config.apps.forEach(function(app, ind) {
                            if(app.id === appId) {
                                appIndex = ind;
                            }
                        });
                        this.config.apps.splice(appIndex, 1);
                    };
                }
                ,App = function(title) {
                    this.title = title;
                    this.id = ++APPID;
                }
                ,serverStatus = {}
                ,APPS = {
                    Hadoop: []
                    ,Chronos: []
                    ,Rails: []
                    ,Spark: []
                    ,Storm: []
                }
            ;

            // Contruct the possible apps
            $scope.apps = (function() {
                var apps = [];
                _.each(APPS, function(al, key) {
                   apps.push({title:  key});
                });
                return apps;
            }());

            // this is where we store all the variables.
            $scope.servers = [];

            // Event listener which is used to monitor the server status
            $scope.$on(EVENTS.RECAL, function() {
                serverStatus = _.groupBy($scope.servers, function(n) {
                    return n.config.apps.length;
                });
            });

            /**
             * Handler for add server
             * We just create a new server and push to the server variable
             */
            $scope.addServer = function() {
                $scope.servers.push(new Server({name: new Date()}));
                $scope.$emit(EVENTS.RECAL);
            };

            /**
             * Handler for destroy server
             * @returns {boolean}
             */
            $scope.destroyServer = function() {

                var servers = $scope.servers
                    ,serverToPop = servers[servers.length-1]
                    ,alApps
                ;

                // check if the server to be destroyed has any apps
                // if not just remove the server
                if(serverToPop.config.apps.length === 0) {
                    $scope.servers.pop();
                    $scope.$emit(EVENTS.RECAL);
                    return true;
                }

                // if the server had apps try to add the app to different servers available
                alApps = serverToPop.config.apps.slice();
                alApps.forEach(function(a) {
                    $scope.addApp(a);
                });

                // finally remove the server
                $scope.servers.pop();
                $scope.$emit(EVENTS.RECAL);
            };


            /**
             * Handler to add Apps to servers
             * @param a
             * @returns {boolean}
             */
            $scope.addApp = function(a) {


                // check if the monitoring is initialised
                if(!serverStatus) {
                    return;
                }

                var objApp = new App(a.title)
                    ,iServerAvailable;

                // check if we have any servers with 0 apps, if yes add app to that server
                if(serverStatus['0'] && serverStatus['0'].length > 0) {
                        iServerAvailable = serverStatus['0'][0]
                        iServerAvailable.addApp(objApp);
                        APPS[a.title].push([objApp.id, iServerAvailable]);
                        $scope.$emit(EVENTS.RECAL);
                        return true;
                }

                // check if we have any servers with 1 app, if yes add app to that server
                if(serverStatus['1'] && serverStatus['1'].length > 0) {
                    iServerAvailable = serverStatus['1'][0]
                    iServerAvailable.addApp(objApp);
                    APPS[a.title].push([objApp.id, iServerAvailable]);
                    $scope.$emit(EVENTS.RECAL);
                    return true;
                }

                console.log('ALL SERVERS ARE FULL');
                // else alert all the servers are full
                return false;
            };

            /**
             * Handler for removing apps
             * @param a
             */
            $scope.removeApp = function(a) {
                var alApps = APPS[a.title]
                    ,server
                    ,appId
                ;

                if(alApps.length === 0) {
                    return;
                }
                alApps = alApps[alApps.length-1];
                appId = alApps[0];
                server = alApps[1];
                server.removeApp(appId);
                APPS[a.title].pop();
                $scope.$emit(EVENTS.RECAL);
            };

            // add the initial 4 servers/
            (function() {
                $scope.addServer('A');
                $scope.addServer('B');
                $scope.addServer('C');
                $scope.addServer('D');

            }());


        }])

    /**
     * constant to hold event names
     */
        .constant('EVENTS', {
            RECAL: 'RECAL'
        });


        angular.element(document).ready(function () {
        angular.bootstrap(document, ['mesosphere']);

    });

}());

