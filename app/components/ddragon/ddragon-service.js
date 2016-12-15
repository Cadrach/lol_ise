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
    function getData(language){
        //We will wait for the second http call to complete
        var defer = $q.defer();
        $http.get('source/config.json').then(function(response){
            //We got the configuration information
            var config = response.data;
            var defaultLanguage = 'en_US';

            //Get language from URL or from brower, or default to english
            language = (language ? language: (navigator && navigator.language ? navigator.language:defaultLanguage)).replace('-','_');
            var languages = config.languages;
            if(language.length == 5 && languages.indexOf(language)>=0){
                //language is available, do nothing
            }
            else{
                //For a 2 letter language, find the first matching one
                language = _.find(languages, function(l){
                    return l.indexOf(language.slice(0, 2).toLowerCase())>=0;
                });
            }

            //Default language if nothing found
            if( ! language){
                language = defaultLanguage;
            }

            //Now we fetch the correct source for our languate
            return $http.get('source/data_'+language+'.json').then(function(response){
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