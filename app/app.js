'use strict';

// Declare app level module which depends on views, and components
angular.module('appLolIse', [
    'ngRoute',
    'ui.bootstrap',
    'ui.sortable',

    'appLolIse.ddragon',
    'appLolIse.item',
    'appLolIse.set',
    'appLolIse.viewMain',
    'appLolIse.view2'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/viewMain'});
}]);
