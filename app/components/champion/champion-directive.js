'use strict';

angular.module('appLolIse.champion.champion-directive', [])

.directive('champion', ['ddragon', function(ddragon) {
    var url = ddragon.getBaseUrl() + "img";

    return {
        link: function(scope, elmt){
            scope.url = url;

            if(scope.small){
                scope.backgroundStyle = 'background-position: -'+scope.champion.image.x/2+'px -'+scope.champion.image.y/2+'px; background-size: 240px;';
            }
            else{
                scope.backgroundStyle = 'background-position: -'+scope.champion.image.x+'px -'+scope.champion.image.y+'px;';
            }

            elmt.click(function(){

            })
        },
        restrict: 'E',
        transclude: true,
        scope: {
            champion: '=value',
            small: '@'
        },
        template: '<div class="ise-champion-img {{small?\'small\':null}}" style="background-image: url({{url + \'/sprite/\' + champion.image.sprite}}); {{backgroundStyle}}"/>' +
        '<div class="ise-champion-name">{{champion.name}}</div>' +
        '<div class="ise-champion-title" ng-show="!small">{{champion.title}}</div>'

    }
}]);
