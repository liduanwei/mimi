'use strict';

angular.module('app')
    .controller('selectSongController', ['$scope', '$rootScope', '$state', '$timeout', 'toaster',
        function ($scope, $rootScope, $state, $timeout, toaster) {
            var title = "点歌台";

            document.title = $scope.title = $rootScope.title = title;

            $scope.pageInfo = {};

            $scope.param = {};

            $scope.loading = true;

            $scope.pageInfo.songsTotal = 500;

            // 加载当前企业的所有成员

            $scope.param.pageSize = 20;

            $scope.search = function () {
                $scope.loading = true;
                $.ajax({
                    url: '/company/list?t=' + Math.random(),
                    data: $scope.param,
                    dataType: "text",
                    success: function (result) {

                        result = $.handleJSON(result);
                        // result = JSON.parse(result);
                        $scope.loading = false;
                        if (result['httpCode'] == 200) {
                            $scope.pageInfo = result.data;
                            $scope.selectedCompany = $scope.pageInfo.records[0];
                        } else {
                            $scope.msg = result.msg;
                        }
                        $scope.$apply();
                    }
                }).then(function (result) {

                });
            };

            // $scope.search();

            $scope.pageInfo.records = [1, 2, 3, 4, 5, 6];
            // $scope.$apply();

            $scope.stateGo = function (url, params) {
                $state.go(url, params);
            }
        }]);