'use strict';

// Declare app level module which depends on views, and components
angular.module('appLolIse', [
  'ngRoute',
  'ui.bootstrap',
  'ui.sortable',
  'appLolIse.item',
  'appLolIse.view1',
  'appLolIse.view2'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
