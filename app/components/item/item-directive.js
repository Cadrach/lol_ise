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
