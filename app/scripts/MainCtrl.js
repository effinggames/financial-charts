(function () {
    'use strict';
    const angular = window.angular;

    angular.module('app')
        .controller('MainCtrl', function($scope, $window) {
            $scope.$window = $window;
        });
})();