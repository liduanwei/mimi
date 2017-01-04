'use strict';

var app = angular.module('app');

app.controller('videoClipsController', ['$scope', '$rootScope', '$state', '$timeout', 'toaster', 'PageItemsLoader', '$stateParams', '$sce',
    function ($scope, $rootScope, $state, $timeout, toaster, PageItemsLoader, $stateParams, $sce) {
        var title = $stateParams.workTitle;

        console.log($stateParams);

        document.title = $scope.title = $rootScope.title = title;


        // $scope.pageItemsLoader = new PageItemsLoader($scope, "/user/subwork/" + $stateParams.workId + "/list");

        $scope.pageInfo = {};

        $scope.param = {};

        $scope.loading = false;

        $scope.param.pageSize = 20;

        console.log("workId:" + ($stateParams.workId));

        $scope.workId = $stateParams.workId;

        $scope.search = function () {
            $scope.loading = true;
            $.ajax({
                url: '/user/subwork/' + $scope.workId + '/list',
                data: $scope.param,
                dataType: "text",
                success: function (result) {
                    result = $.handleJSON(result);
                    // result = JSON.parse(result);
                    $scope.loading = false;
                    if (result['httpCode'] == 200) {
                        $scope.pageInfo = result.data;
                        // $scope.pageInfo.records.records.forEach(function (e) {
                        //     console.log("r:" + e.videoId);
                        // });
                    } else {
                        $scope.msg = result.msg;
                    }
                    $scope.$apply();
                }
            }).then(function (result) {

            });
        };

        $scope.search();
        console.log("workId:" + $stateParams.workId);

        $scope.stateTo = function (subWorkId) {
            $state.go("main.videoDetail.home", {subWorkId: subWorkId});
        };

        // http://blog.csdn.net/qq_36020545/article/details/53406061
        //在angularJs中为了避免安全漏洞，一些ng-src或者ng-include都会进行安全校验，因此常常会遇到一个iframe中的ng-src无法使用
        /*
         人话就是  我们用angular里面的 ng-src 时会进行安全检查  因为我们是访问资源服务器上面的视频  所以他不给你这个url通过 所以我们就不放不了视频
         这里有人要说了  为什么我用 src="{{item.url}}" 也不行 我想说的是 因为我们使用了{{item.url}} 这个在页面加载的时候 angularjs 会把src变成ng-src  这样所以不能通过
         那么我们怎么解决这个url问题
         简单直接 我们直接告诉angularJs 这个url是安全的  你信任他

         方法是 $sce服务把一些地址变成安全的、授权的链接...简单地说，就像告诉门卫，这个陌生人其实是我的好朋友，很值得信赖，不必拦截它！
         */
        $scope.trustVideoUrl = function (videoId) {
            return $sce.trustAsResourceUrl(videoId);
        };

    }]);