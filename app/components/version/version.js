'use strict';

angular.module('appLolIse.version', [
  'appLolIse.version.interpolate-filter',
  'appLolIse.version.version-directive'
])

.value('version', '0.1');
