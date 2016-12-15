'use strict';

angular.module('appLolIse.ddragon.ddragon-service', [])

.factory('ddragon', ['$http', '$q', function($http, $q) {
    var version = '6.24.1';
    var url = "http://ddragon.leagueoflegends.com/cdn/"+version+"/";

    function getBaseUrl(){
        return url;
    }
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }
    function getData(){
        //We will wait for the second http call to complete
        var defer = $q.defer();
        $http.get('source/config.json').then(function(response){
            //We got the configuration information
            var config = response.data;

            //Now we fetch the correct source for our languate
            return $http.get('source/data_en_US.json').then(function(response){
                defer.resolve({
                    config: config,
                    data: response.data
                });
            })
        })

        return defer.promise;
    }

    return {
        getBaseUrl: getBaseUrl,
        getData: getData
    };
}])
.factory('ddTranslate', function(){
    var language;
    function setLanguage(o){
        language = o;
    }

    function translate(string){
        try{
            return language[string] ? language[string]:string;
        }
        catch(e){
            return string;
        }
    }

    return {
        get: translate,
        setLanguage: setLanguage
    }
})
;