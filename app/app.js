'use strict';

// Declare app level module which depends on views, and components
angular.module('appLolIse', [
    'ngRoute',
    'ui.bootstrap',
    'ui.sortable',

    'appLolIse.ddragon',
    'appLolIse.champion',
    'appLolIse.item',
    'appLolIse.set',
    'appLolIse.viewMain'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/viewMain'});
}]);
