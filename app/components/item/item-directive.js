'use strict';

angular.module('appLolIse.item.item-directive', [])

.directive('item', ['ddragon', function(ddragon) {
    var url = ddragon.getBaseUrl() + "img";

    return {
        link: function(scope, elmt){
            scope.url = url;
            elmt.click(function(){
                console.log(scope.item);
            })
        },
        restrict: 'E',
        scope: {
            item: '=value',
            count: '='
        },
        template: '<div class="ise-item-img" style="background-image: url({{url + \'/sprite/\' + item.image.sprite}}); background-position: -{{item.image.x}}px -{{item.image.y}}px;"/>' +
            '<div class="ise-item-count" ng-show="item.stacks && count">{{count}}</div>'
    }
}]);
