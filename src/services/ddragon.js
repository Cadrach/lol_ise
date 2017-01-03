import _ from 'lodash';

export default 'appLolIse.ddragon';

angular.module('appLolIse.ddragon', [])

  .factory('ddragon', ['$http', '$q', 'ddTranslate', function($http, $q, ddTranslate) {
    var version = '6.24.1'; //default version, should be overwritten
    var interfaceLanguage = null;

    function getBaseUrl(){
      return "http://ddragon.leagueoflegends.com/cdn/"+version+"/";
    }

    function getData(language){
      //We will wait for the second http call to complete
      var defer = $q.defer();
      $http.get('source/config.json?' + new Date).then(function(response){
        //We got the configuration information
        var config = response.data;
        var defaultLanguage = 'en_US';
        version = config.version;

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

        //Store language
        interfaceLanguage = language;

        //Now we fetch the correct source for our languate
        return $http.get('source/data_'+language+'.json?' + version).then(function(response){
          //Set language
          ddTranslate.setLanguage(response.data.language.data);
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
      getData: getData,
      getLanguage: function(){return interfaceLanguage}
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
