import angular from 'angular';

import _ from 'lodash';

export default 'appLolIse.item';
angular.module('appLolIse.item', [])

.directive('item', ['$sce', '$timeout', 'ddragon', function($sce, $timeout, ddragon) {
    var url = ddragon.getBaseUrl() + "img";

    return {
        link: function(scope, elmt){
            if(scope.item){
                scope.url = url;
                scope.popoverPlacement = scope.popoverPlacement ? scope.popoverPlacement:'auto';
                scope.size = scope.size ? scope.size:48;
                scope.popoverTplUrl = 'app/item/item-popover.html';
                scope.description = $sce.trustAsHtml(scope.item.description);

                scope.popoverId = _.uniqueId('popover-item-');

                //compute background position
                scope.background = 'background-position: ' + (scope.size / -48 * scope.item.image.x) + 'px ' + (scope.size / -48 * scope.item.image.y) +'px;'
                    + 'background-size:' + (scope.size * 10) + 'px;'
                    + 'width: ' + (scope.size) + 'px;'
                    + 'height: ' + (scope.size) + 'px;'
                ;
            }
            elmt.click(function(){
                console.log(scope.item);
            })



            scope.loadChart = function(){
                $timeout(function(){
                    var popover = angular.element('.' + scope.popoverId);
                    var e = popover.find('.ise-item-popover-hierarchy');
                    e.hide();
                    e.jOrgChart({
                        chartElement: popover.find('.ise-item-popover-chart')
                    });
                })

            }
        },
        restrict: 'E',
        transclude: true,
        scope: {
            item: '=value',
            items: '=',
            count: '=',
            popoverPlacement: '@',
            size: '@'
        },
        templateUrl: 'app/item/item.html'
    }
}]);
