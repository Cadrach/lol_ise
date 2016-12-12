'use strict';

angular.module('appLolIse.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'app/view1/view1.html',
    controller: 'View1Ctrl',
    resolve: {
        items: function($http){
            //TODO: Use system language for locale
            return $http.get('https://global.api.pvp.net/api/lol/static-data/euw/v1.2/item?locale=en_US&itemListData=colloq,consumed,gold,image,into,maps,requiredChampion,tags,tree&api_key=RGAPI-c12afc1e-2d25-4388-959d-b1e9eb797d44')
                .then(function(response){return response.data;});
        }
    }
  });
}])

.controller('View1Ctrl', ['$scope', 'items', function($scope, items) {
        /**
         * **************************************************************************************
         * LOCAL VARS
         */
        var defaultSet = {
            title: 'Custom Item Set',
            map: 'any',
            mode: 'any',
            priority: false,
            sortrank: null,
            blocks: [
                {
                    type: "A block with just boots",
                    showIfSummonerSpell: "",
                    hideIfSummonerSpell: "",
                    items: [
                        {id: "1001", count: 1}
                    ]
                }
            ]
        }

        /**
         * **************************************************************************************
         * SCOPE VARS
         */
        $scope.url = "http://ddragon.leagueoflegends.com/cdn/"+items.version+"/img";
        $scope.items = items.data;
        $scope.set = angular.copy(defaultSet);

        //Maps
        //Img: http://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map11.png
        $scope.maps = {
            //1:	"Original Summoner's Rift",
            any: {name: "Any", code: null},
            TT:	{name: "Twisted Treeline", code: 10},
            SR:	{name: "Summoner's Rift", code: 11},
            HA:	{name: "Howling Abyss", code: 12}
        }

        /**
         * **************************************************************************************
         * SCOPE METHODS
         */
        $scope.selectItem = function(item){
            console.log(item);
        }
        $scope.addBlock = function(){
            $scope.set.blocks.push({
                type: "New Block",
                items: []
            })
        }
}]);