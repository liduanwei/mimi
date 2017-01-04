'use strict';

angular.module('app')
    .controller('controllerController', ['$scope', '$rootScope', '$state', '$timeout', 'toaster', '$stateParams',
        function ($scope, $rootScope, $state, $timeout, toaster, $stateParams) {
            var title = "控制台";

            document.title = $scope.title = $rootScope.title = title;

            $scope.pageInfo = {};

            $scope.param = {};

            $scope.loading = true;

            $scope.pageInfo.song = {};
            $scope.pageInfo.song.title = $stateParams.songName;
            $scope.pageInfo.song.singer = $stateParams.singerName;


        }]);