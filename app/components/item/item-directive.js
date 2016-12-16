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

angular.module('appLolIse.item.item-directive', [])

.directive('item', ['$sce', 'ddragon', function($sce, ddragon) {
    var url = ddragon.getBaseUrl() + "img";

    return {
        link: function(scope, elmt){
            scope.url = url;
            scope.popoverTplUrl = 'app/template/directive-item-popover.html';
            scope.description = $sce.trustAsHtml(scope.item.description);
            elmt.click(function(){
                console.log(scope.item);
            })
        },
        restrict: 'E',
        transclude: true,
        scope: {
            item: '=value',
            count: '='
        },
        templateUrl: 'app/template/directive-item.html'
    }
}]);
