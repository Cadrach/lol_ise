import angular from 'angular';

import ddragon from '../ddragon/ddragon';

export default 'appLolIse.champion';
angular.module('appLolIse.champion', [ddragon])

.directive('champion', ['ddragon', function(ddragon) {
    var url = ddragon.getBaseUrl() + "img";

    return {
        link: function(scope, elmt){
            scope.url = url;

            scope.$watch('champion', function(){
                if( ! scope.champion){
                    scope.backgroundStyle = '';
                }
                else if(scope.small){
                    scope.backgroundStyle = 'background-position: -'+scope.champion.image.x/2+'px -'+scope.champion.image.y/2+'px; background-size: 240px;';
                }
                else{
                    scope.backgroundStyle = 'background-position: -'+scope.champion.image.x+'px -'+scope.champion.image.y+'px;';
                }
            })
        },
        restrict: 'E',
        scope: {
            champion: '=value',
            small: '@'
        },
        templateUrl: 'app/champion/champion.html'

    }
}]);
