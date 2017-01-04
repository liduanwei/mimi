'use strict';

angular.module('app')
    .controller('controllerController', ['$scope', '$rootScope', '$state', '$timeout', 'toaster',
        function ($scope, $rootScope, $state, $timeout, toaster) {
            var title = "控制台";

            document.title = $scope.title = $rootScope.title = title;

            $scope.pageInfo = {};

            $scope.param = {};

            $scope.loading = true;
            
        }]);