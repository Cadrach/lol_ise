import angular from 'angular';

import main from './app/main';

export const app = 'appLolIse';
export const codeVersion = '0.6';

import customScrollbar from 'malihu-custom-scrollbar-plugin'; // This import is required to load the JQuery plugin.
import jOrgChart from 'wesnolte/jOrgChart/jquery.jOrgChart'; // This import is required to load the JQuery plugin.

angular
  .module(app, [main])
  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/editor'});
  }]);
