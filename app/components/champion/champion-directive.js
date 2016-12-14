'use strict';

angular.module('appLolIse.champion.champion-directive', [])

.directive('champion', ['ddragon', function(ddragon) {
    var url = ddragon.getBaseUrl() + "img";

    return {
        link: function(scope, elmt){
            scope.url = url;
//            console.log(scope.champion);
            elmt.click(function(){

            })
        },
        restrict: 'E',
        transclude: true,
        scope: {
            champion: '=value'
        },
        template: '<div class="ise-champion-img" style="background-image: url({{url + \'/sprite/\' + champion.image.sprite}}); background-position: -{{champion.image.x}}px -{{champion.image.y}}px;"/>' +
        '<div class="ise-champion-name">{{champion.name}}</div>' +
        '<div class="ise-champion-title">{{champion.title}}</div>'

    }
}]);
