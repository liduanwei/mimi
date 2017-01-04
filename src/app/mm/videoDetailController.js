'use strict';

angular.module('app')
    .controller('videoDetailController', ['$scope', '$rootScope', '$state', '$timeout', 'toaster', '$stateParams', 'PageItemsLoader', '$sce',
        function ($scope, $rootScope, $state, $timeout, toaster, $stateParams, PageItemsLoader, $sce) {
            var title = "详情";

            document.title = $scope.title = $rootScope.title = title;

            $scope.subWorkId = $stateParams.subWorkId;

            console.log("subWorkId:" + $scope.subWorkId);

            $scope.pageInfo = {};

            $scope.commentPageItemsLoader = new PageItemsLoader({
                $sp: $scope,
                url: "/user/subwork/comment/" + $scope.subWorkId + "/list",
                onPageFinished: function (sp, data, items) {
                    console.log("info:" + JSON.stringify(data));
                    $scope.pageInfo.commentsInfo = data;
                    $scope.pageInfo.comments = items;
                    $scope.param.pageNum = $scope.commentPageItemsLoader.page;
                    $scope.loading = $scope.commentPageItemsLoader.busy;
                    $scope.$apply();
                }
            });

            $scope.param = {};


            $scope.param.pageNum = $scope.commentPageItemsLoader.page;

            $scope.param.pageSize = 10;


            $scope.pageInfo.comments = $scope.commentPageItemsLoader.items;
            $scope.param.pageNum = $scope.commentPageItemsLoader.page;
            $scope.loading = $scope.commentPageItemsLoader.busy;

            $scope.queryWork = function () {
                $.ajax({
                    url: "/user/subwork/query/" + $scope.subWorkId,
                    data: {},
                    dataType: "text"
                }).then(function (result) {
                    result = $.handleJSON(result);
                    if (result.httpCode == 200) {
                        $scope.pageInfo.subWork = result.data;
                    } else {
                        alert(result.msg);
                    }

                    $scope.$apply();
                });
            };

            $scope.queryWork();

            $scope.trustVideoUrl = function (videoId) {
                return $sce.trustAsResourceUrl(videoId);
            };


            $scope.submit = function () {
                var m = $scope.record;
                if (m) {
                    $scope.isDisabled = true;//提交disabled
                    $.ajax({
                        url: $scope.record.id ? '/user/subwork/comment/' + $scope.subWorkId + '/post' : '/user/subwork/comment/' + $scope.subWorkId + '/post',
                        data: $scope.record
                    }).then(callback);
                }
                function callback(result) {
                    if (result.httpCode == 200) {//成功
                        toaster.clear('*');
                        toaster.pop('success', '', "保存成功");
                        $timeout(function () {
                            $state.go('main.videoDetail.home', {subWorkId: $scope.subWorkId}, {reload: true});
                        }, 1000);
                    } else {
                        toaster.clear('*');
                        toaster.pop('error', '', result.msg);
                        $scope.isDisabled = false;
                    }
                }
            };


            // 初始化页面
            function activate(id) {
                $scope.loading = true;
                $.ajax({
                    url: '/company/read/detail',
                    data: {'id': id}
                }).then(function (result) {
                    $scope.loading = false;
                    if (result.httpCode == 200) {
                        $scope.record = result.data;
                    } else {
                        $scope.msg = result.msg;
                    }
                    $scope.$apply();
                });
            }

            $scope.record = {};


            // activate(0);

            validate(null);

            //表单验证
            function validate(userId) {
                jQuery('form').validate({
                    rules: {
                        content: {
                            required: true,
                            // stringCheck: [],
                            maxLengthB: [500]
                        }
                    },
                    messages: {
                        content: {
                            required: '请填写评论内容',
                            maxLengthB: "内容不得超过{0}个字符"
                        }
                    },
                    submitHandler: function () {
                        $scope.submit();
                    }
                });
            }
        }]);