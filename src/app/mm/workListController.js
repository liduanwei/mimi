'use strict';

var app = angular.module('app');

app.controller('listController', ['$scope', '$rootScope', '$state', '$timeout', 'toaster', 'PageItemsLoader',
    function ($scope, $rootScope, $state, $timeout, toaster, PageItemsLoader) {
        var title = "作品广场";
        document.title = $scope.title = $rootScope.title = title;

        $scope.pageItemsLoader = new PageItemsLoader({
            $sp: $scope,
            url: "/user/work/list",
            onPageFinished: function (sp, dataJson, items) {
                $scope.loading = $scope.pageItemsLoader.busy;
                $scope.pageInfo.records = items;
                $scope.param.pageNum = $scope.pageItemsLoader.page;
                $scope.$apply();
            }
        });

        $scope.pageInfo = {};


        $scope.param = {};

        $scope.loading = $scope.pageItemsLoader.busy;

        $scope.param.pageNum = $scope.pageItemsLoader.page;
        $scope.param.pageSize = 10;


        $scope.stateTo = function (item) {
            $state.go("main.videoClips.list", {workId: item.id, workTitle: item.title});
        };


        $scope.stateGo = function (url, params) {
            $state.go(url, params);
        }


    }]);





