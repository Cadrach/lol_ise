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

.directive('item', ['$sce', '$timeout', 'ddragon', function($sce, $timeout, ddragon) {
    var url = ddragon.getBaseUrl() + "img";

    return {
        link: function(scope, elmt){
            if(scope.item){
                scope.url = url;
                scope.popoverTplUrl = 'app/template/directive-item-popover.html?v=' + codeVersion;
                scope.description = $sce.trustAsHtml(scope.item.description);

                scope.popoverId = _.uniqueId('popover-item-');
            }
            elmt.click(function(){
                console.log(scope.item);
            })

            scope.loadChart = function(){
                $timeout(function(){
                    var popover = angular.element('.' + scope.popoverId);
                    var e = popover.find('.ise-item-popover-chart');
                    e.hide();
                    e.jOrgChart({
                        chartElement: popover
                    });
                })

            }
        },
        restrict: 'E',
        transclude: true,
        scope: {
            item: '=value',
            items: '=',
            count: '='
        },
        templateUrl: 'app/template/directive-item.html?v=' + codeVersion
    }
}]);
