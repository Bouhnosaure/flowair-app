/**
 * Created by Alexandre on 29/05/2015.
 */
//Controllers for app
//all controllers be here


//this controller allow to use sidemenu
angular.module('flowair.controllers', [])

    /*
     |
     |Controlleur Global de l'application
     |
     */
    .controller('MainCtrl', function ($scope, $ionicSideMenuDelegate) {

        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

    })

    /*
     |
     |Home Page
     |
     */
    .controller('HomeCtrl', function ($scope) {

    })

    /*
     |
     |Controlleur Mon jardin qui liste MES plantes (capteurs) + suppressions on hold
     |
     */
    .controller('GardenCtrl', function ($scope, $state, $ionicLoading, $ionicActionSheet, FlowersService, LocalFlowersService) {

        $ionicLoading.show();

        LocalFlowersService.getFlowers().then(function (flowers) {
            $scope.flowers = flowers.data.data;
            $ionicLoading.hide();
        });

        $scope.goto = function (id_flower) {
            $state.go('app.garden-item', {GardenItemId: id_flower});
        };

        $scope.show = function (id_flower) {
            $ionicActionSheet.show({
                titleText: 'Que souhaitez vous faire ?',
                destructiveText: 'Supprimer ma plante',
                cancelText: 'Annuler',
                destructiveButtonClicked: function () {
                    LocalFlowersService.deleteFlower(id_flower).then(function () {
                        $state.go($state.current, {}, {reload: true});
                        $scope.doRefresh();
                    });
                }
            });
        };

        $scope.doRefresh = function () {
            LocalFlowersService.getFlowers().then(function (flowers) {
                $scope.flowers = flowers.data.data;
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

    })

    /*
     |
     |Une fleur de mon jardin SHOW
     |
     */
    .controller('GardenItemCtrl', function ($scope, $stateParams, $ionicLoading, LocalFlowersService) {
        $scope.GardenItemId = $stateParams.GardenItemId;

        $ionicLoading.show();

        LocalFlowersService.getFlower($scope.GardenItemId).then(function (flower) {
            $scope.flower = flower.data.data;
            $ionicLoading.hide();
        });

        $scope.doRefresh = function () {
            LocalFlowersService.getFlower($scope.GardenItemId).then(function (flower) {
                $scope.flower = flower.data.data;
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };


    })

    /*
     |
     |Une fleur de mon jardin SHOW
     |
     */
    .controller('GardenItemRealtimeCtrl', function ($scope, $stateParams, $ionicLoading, LocalFlowersService) {
        $scope.GardenItemId = $stateParams.GardenItemId;

        var updateData = function () {
            LocalFlowersService.getFlower($scope.GardenItemId).then(function (flower) {
                $scope.flower = flower.data.data;
            });
        };
        var timer = setInterval(function () {
            $scope.$apply(updateData);
        }, 1000);
        updateData();

    })

    /*
     |
     |Une fleur de mon jardin STATS
     |
     */
    .controller('GardenItemStatsCtrl', function ($scope, $http, $stateParams, $ionicLoading) {
        $scope.GardenItemId = $stateParams.GardenItemId;

        $ionicLoading.show();

        $http.get("http://couchdb.ovh/appdata/local/" + $scope.GardenItemId).then(function (flower) {
            $scope.flower = flower.data.data;
            return $http.get("http://couchdb.ovh/appdata/histogram");
        }).then(function (stats) {
            $scope.stats = stats.data.data[$scope.flower.current['ip']];
            $scope.generateCharts();
            $ionicLoading.hide();
        });

        $scope.generateCharts = function () {
            var stats = $scope.stats;

            var chartTemperature = [];
            var chartBrightness = [];
            var chartMoisture = [];

            for (var key in stats) {
                if (stats.hasOwnProperty(key)) {
                    chartTemperature.push([moment(stats[key].datetime), stats[key].temperature]);
                    chartBrightness.push([moment(stats[key].datetime), stats[key].brightness]);
                    chartMoisture.push([moment(stats[key].datetime), stats[key].moisture]);
                }
            }

            $scope.xAxisTickFormatFunction = function () {
                return function (d) {
                    return d3.time.format('%H:%M')(moment(d).toDate());
                }
            };

            //Temperature
            $scope.dataTemperature = [{
                "key": "Temperature",
                "values": chartTemperature
            }];

            $scope.colorTemperature = function () {
                return function (d, i) {
                    return '#e74c3c'
                };
            }

            //Brightness
            $scope.dataBrightness = [{
                "key": "Humidité",
                "values": chartBrightness
            }];
            $scope.colorBrightness = function () {
                return function (d, i) {
                    return '#f1c40f'
                };
            }

            //Moisture
            $scope.dataMoisture = [{
                "key": "Luminosité",
                "values": chartMoisture
            }];
            $scope.colorMoisture = function () {
                return function (d, i) {
                    return '#1abc9c'
                };
            }
        };


        $scope.doRefresh = function () {
            $http.get("http://couchdb.ovh/appdata/local/" + $scope.GardenItemId).then(function (flower) {
                $scope.flower = flower.data.data;
                return $http.get("http://couchdb.ovh/appdata/histogram");
            }).then(function (stats) {
                $scope.stats = stats.data.data[$scope.flower.current['ip']];
                $ionicLoading.hide();
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

    })

    /*
     |
     |Une fleur de mon jardin EDIT
     |
     */
    .controller('GardenItemEditCtrl', function ($scope, $state, $stateParams, $ionicHistory, $ionicLoading, LocalFlowersService) {
        $scope.GardenItemId = $stateParams.GardenItemId;
        $scope.flowerData = {alias: ''};

        $ionicLoading.show();
        LocalFlowersService.getFlower($scope.GardenItemId).then(function (flower) {
            $scope.flower = flower.data.data;
            $ionicLoading.hide();
        });


        $scope.editFlower = function (form) {
            if (form.$valid) {
                LocalFlowersService.putFlower($scope.GardenItemId, $scope.flowerData).then(function (result) {
                    $ionicHistory.nextViewOptions({disableBack: true});
                    $state.go('app.garden', {reload: true});
                });
            }
        };


    })

    /*
     |
     |Liste de mes devices pour ajouter une plante
     |
     */
    .controller('DevicesCtrl', function ($scope, DevicesService) {

        DevicesService.getDevices().then(function (devices) {
            $scope.devices = devices.data.data;
        });

        $scope.doRefresh = function () {
            DevicesService.getDevices().then(function (devices) {
                $scope.devices = devices.data.data;
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
    })


    /*
     |
     |Liste de toutes le plantes pour en ajouter une
     |mie en place d'un systeme de cache ou ne pas a avoir aller chercher les donn�es a chaque fois
     |
     */
    .
    controller('FlowersCtrl', function ($scope, $stateParams, $ionicLoading, FlowersCache, FlowersService) {

        $scope.DeviceIp = $stateParams.DeviceIp;

        var cache = FlowersCache.get('FlowersData');

        if (cache) {
            $scope.flowers = cache;
        } else {
            $ionicLoading.show();
            FlowersService.getFlowers().then(function (flowers) {
                $scope.flowers = flowers.data.data;
                FlowersCache.put('FlowersData', flowers.data.data);
                $ionicLoading.hide();
            });
        }

    })

    /*
     |
     |Liste une seule plante avec un formulaire
     |
     */
    .controller('FlowersItemCtrl', function ($scope, $state, $stateParams, $ionicHistory, FlowersService, LocalFlowersService) {

        FlowersService.getFlower($stateParams.FlowersItemId).then(function (flower) {
            $scope.flower = flower.data.data;
        });

        $scope.flowerData = {
            alias: '',
            ip: $stateParams.DeviceIp,
            plant_id: $stateParams.FlowersItemId
        };

        $scope.addFlower = function (form) {
            if (form.$valid) {
                LocalFlowersService.postFlower($scope.flowerData).then(function (result) {
                    $ionicHistory.nextViewOptions({disableBack: true});
                    $state.go('app.garden');
                });
            }
        };
    })
















