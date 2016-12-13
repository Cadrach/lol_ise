'use strict';

angular.module('appLolIse.ddragon.ddragon-service', [])

.factory('ddragon', function() {
    var version = '6.24.1';
    var url = "http://ddragon.leagueoflegends.com/cdn/"+version+"/";

    function getBaseUrl(){
        return url;
    }

    return {getBaseUrl: getBaseUrl};
})
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