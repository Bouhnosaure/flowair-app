/**
 * Created by Alexandre on 29/05/2015.
 */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('flowair', ['ionic', 'ngCordova', 'ngMessages', 'nvd3ChartDirectives','flowair.controllers', 'flowair.services'])

    .run(function ($ionicPlatform, $rootScope) {

        $ionicPlatform.ready(function () {
            //check internet
            $rootScope.$on('$cordovaNetwork:offline', function () {
                $ionicPopup.confirm({
                    title: "Internet",
                    content: "L'application a besoin d'internet pour fonctionner."
                }).then(function (result) {
                    if (!result) {
                        ionic.Platform.exitApp();
                    }
                });
            });

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    //Routes
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            //conteneur principal des vues
            //c'est pour �a qu'il est abstract
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/sidemenu.html",
                controller: 'MainCtrl'
            })

            //accueil de l'application
            .state('app.home', {
                cache: true,
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home.html",
                        controller: 'HomeCtrl'
                    }
                }
            })

            //mon jardin
            .state('app.garden', {
                cache: false,
                url: "/garden",
                views: {
                    'menuContent': {
                        templateUrl: "templates/garden.html",
                        controller: 'GardenCtrl'
                    }
                }
            })

            //une plante de mon jardin et ses stats (edit, delete)
            .state('app.garden-item', {
                cache: false,
                url: "/garden/:GardenItemId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/garden-item.html",
                        controller: 'GardenItemCtrl'
                    }
                }
            })

            //une plante de mon jardin et ses stats (edit, delete)
            .state('app.garden-item-stats', {
                cache: false,
                url: "/garden/:GardenItemId/stats",
                views: {
                    'menuContent': {
                        templateUrl: "templates/garden-item-stats.html",
                        controller: 'GardenItemStatsCtrl'
                    }
                }
            })

            //une plante de mon jardin et ses stats (edit, delete)
            .state('app.garden-item-edit', {
                cache: false,
                url: "/garden/:GardenItemId/edit",
                views: {
                    'menuContent': {
                        templateUrl: "templates/garden-item-edit.html",
                        controller: 'GardenItemEditCtrl'
                    }
                }
            })


            //mes devices connect�s pour ajouer une fleur
            .state('app.devices', {
                cache: false,
                url: "/devices",
                views: {
                    'menuContent': {
                        templateUrl: "templates/devices.html",
                        controller: 'DevicesCtrl'
                    }
                }
            })

            //Liste de toutes les fleurs pour en choisir une pour mon jardin ( create + alias )
            .state('app.flowers', {
                cache: true,
                url: "/flowers/:DeviceIp",
                views: {
                    'menuContent': {
                        templateUrl: "templates/flowers.html",
                        controller: 'FlowersCtrl'
                    }
                }
            })

            //Recuperation d'une fleur pour l'ajouer au jardin
            .state('app.flowers-item', {
                url: "/flowers-item/:DeviceIp/:FlowersItemId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/flowers-item.html",
                        controller: 'FlowersItemCtrl'
                    }
                }
            })


            //A propos
            .state('app.about', {
                cache: true,
                url: "/about",
                views: {
                    'menuContent': {
                        templateUrl: "templates/about.html"
                    }
                }
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });
