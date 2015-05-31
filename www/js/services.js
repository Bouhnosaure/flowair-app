/**
 * Created by Alexandre on 29/05/2015.
 */
angular.module('flowair.services', [])

    /*
     |
     | Gestion du cache
     |
     */
    .factory('FlowersCache', function ($cacheFactory) {
        return $cacheFactory('FlowersData');
    })

    /*
     |
     | Service Global Pour les flowers
     |
     */
    .service('FlowersService', ['$http', function ($http) {

        this.getFlowers = function () {
            return $http.get("http://couchdb.ovh/appdata/plant/list");
        };

        this.getFlower = function (id) {
            return $http.get("http://couchdb.ovh/appdata/plant/" + id);
        };

    }])

    /*
     |
     | Service Global Pour les flowers de mon jardin
     |
     */
    .service('LocalFlowersService', ['$http', function ($http) {

        this.getFlowers = function () {
            return $http.get("http://couchdb.ovh/appdata/local");
        };

        this.getFlower = function (id) {
            return $http.get("http://couchdb.ovh/appdata/local/" + id);
        };

        this.postFlower = function (params) {
            return $http.post('http://couchdb.ovh/appdata/local', params);
        };

        this.putFlower = function (id, params) {
            return $http.put("http://couchdb.ovh/appdata/local/" + id, params);
        };

        this.deleteFlower = function (id) {
            return $http.delete("http://couchdb.ovh/appdata/local/" + id);
        };

    }])

    /*
     |
     | Service Global Pour les devices connectés
     |
     */
    .service('StatsService', ['$http', function ($http) {

        this.getStats = function () {
            return $http.get("http://couchdb.ovh/appdata/histogram");
        };

    }])

    /*
     |
     | Service Global Pour les devices connectés
     |
     */
    .
    service('DevicesService', ['$http', function ($http) {
        var device = '';

        this.getDevices = function () {
            return $http.get("http://couchdb.ovh/appdata/device/list");
        };
    }]);