/**
 * League of Legends Item Set Editor
 * Copyright (C) 2016  Rachid Al-Owairdi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Contact: https://github.com/Cadrach
 */
'use strict';

angular.module('appLolIse.champion.champion-directive', [])

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
        templateUrl: 'app/template/directive-champion.html?v=' + codeVersion

    }
}]);
