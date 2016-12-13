'use strict';

angular.module('appLolIse.ddragon.ddragon-service', [])

.factory('ddragon', function() {
    var version = '6.24.1';
    var url = "http://ddragon.leagueoflegends.com/cdn/"+version+"/";

    function getBaseUrl(){
        return url;
    }

    return {getBaseUrl: getBaseUrl};
});