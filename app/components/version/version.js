'use strict';

angular.module('abzu.version', [
  'abzu.version.interpolate-filter',
  'abzu.version.version-directive'
])

.value('version', '0.1');
