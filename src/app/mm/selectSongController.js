'use strict';

angular.module('app')
    .controller('selectSongController', ['$scope', '$rootScope', '$state', '$timeout', 'toaster',
        function ($scope, $rootScope, $state, $timeout, toaster) {
            var title = "点歌台";

            document.title = $scope.title = $rootScope.title = title;

            $scope.pageInfo = {};

            $scope.loading = true;

            $scope.pageInfo.songsTotal = 500;

            $scope.param = {};
            $scope.param.pageSize = 20;

            $scope.search = function () {
                $scope.loading = true;
                $.ajax({
                    url: '/data/selectSong.json?t=' + Math.random(),
                    method: 'get',
                    data: $scope.param,
                    dataType: "text"
                }).then(function (result) {
                    result = $.handleJSON(result);
                    $scope.loading = false;
                    if (result['httpCode'] == 200) {
                        $scope.pageInfo.songs = result.data;
                    } else {
                        $scope.msg = result.msg;
                    }
                    $scope.$apply();
                });
            };

            $scope.search();


            $scope.stateGo = function (url, item) {
                $state.go(url, {songName: item.songName, singerName: item.singerName});
            }
        }]);