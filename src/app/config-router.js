'use strict';
//

var app = angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // 默认地址
        $urlRouterProvider.otherwise('/access/login');
        // 状态配置
        $stateProvider
        //登录
            .state('access', {
                url: '/access',
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })

            .state('access.login', {
                url: '/login',
                templateUrl: 'src/app/mm/login.html',
                controller: 'loginController',
                resolve: {
                    deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
                        return uiLoad.load('src/app/mm/loginController.js');
                    }]
                }
            })

            //
            .state('main', {
                abstract: true, // 公共模板, 抽象, 路径中不显示?
                url: '',
                templateUrl: 'src/tpl/app.html' //公共模板
            })


            .state("main.work", { // 模板继承自 main
                url: "/work",
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })

            .state('main.work.list', {
                url: "/list",
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })

            .state('main.work.list.all', {
                url: "/all",
                templateUrl: "src/app/mm/workList.html?t=" + new Date().getMilliseconds(),
                controller: "listController",
                css: "/res/css/index.css", //angularCSS
                resolve: {
                    deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
                        return uiLoad.load('src/app/mm/workListController.js').then(function () {
                            return $ocLazyLoad.load('toaster');
                        });
                    }]
                }
            })

            //选择歌曲
            .state("main.selectSong", {
                abstract: true,
                url: "/selectSong",
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })

            .state("main.selectSong.list", {
                url: "/list",
                templateUrl: "src/app/mm/selectSong.html",
                controller: "selectSongController",
                css: "/res/css/selectSong.css",
                resolve: {
                    deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
                        return uiLoad.load('src/app/mm/selectSongController.js').then(function () {
                            return $ocLazyLoad.load('toaster');
                        });
                    }]
                }
            })

            // 视频片段
            .state("main.videoClips", {
                abstract: true,
                url: "/videoClips",
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })

            .state("main.videoClips.list", {
                url: "/{workId}/list/{workTitle}",
                templateUrl: "src/app/mm/videoClips.html",
                controller: "videoClipsController",
                css: "/res/css/videoClips.css",
                resolve: {
                    deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
                        return uiLoad.load('src/app/mm/videoClipsController.js').then(function () {
                            return $ocLazyLoad.load('toaster');
                        });
                    }]
                }
            })


            // 视频详细
            .state("main.videoDetail", {
                abstract: true,
                url: "",
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })
            .state("main.videoDetail.home", {
                url: "/videoDetail/{subWorkId}",
                templateUrl: "src/app/mm/videoDetails.html",
                controller: "videoDetailController",
                css: "/res/css/videoDetails.css",
                resolve: {
                    deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
                        return uiLoad.load('src/app/mm/videoDetailController.js').then(function () {
                            return $ocLazyLoad.load('toaster');
                        });
                    }]
                }
            })

            // 控制台
            .state("main.controller", {
                abstract: true,
                url: "",
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })
            .state("main.controller.home", {
                url: "/controller/{songName}/{singerName}",
                templateUrl: "src/app/mm/controller.html",
                controller: "controllerController",
                css: "/res/css/controller.css",
                resolve: {
                    deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
                        return uiLoad.load('src/app/mm/controllerController.js').then(function () {
                            return $ocLazyLoad.load('toaster');
                        });
                    }]
                }
            })

        ;

    }])
    .controller("navCtrl", function ($rootScope, $state) {
        $.ajax({
            url: '/user/current',
            success: function (result) {
                if (result.httpCode == 200) {
                    $rootScope.userInfo = result.data;
                    // $rootScope.menuList = result.menus;
                    $rootScope.$apply();
                }
            }
        });
    })

    .run(['$rootScope', '$state', '$stateParams', '$timeout', '$templateCache',
        function ($rootScope, $state, $stateParams, $timeout, $templateCache) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                var from = fromState.name, to = toState.name;
                if (from && to) { // 解决 相应模块从列表进入编辑后 状态丢失问题
                    var s1 = from.substring(0, from.lastIndexOf(".")),
                        g1 = from.substring(from.lastIndexOf(".") + 1),
                        s2 = to.substring(0, to.lastIndexOf(".")),
                        g2 = to.substring(to.lastIndexOf(".") + 1);
                    if (s1 == s2) {
                        if (g1 == 'list' && (g2 == 'update' || g2 == 'view')) { //进行编辑
                            toParams['params'] = window.location.hash;
                        }
                        //返回列表
                        if ((g1 == "update" || g1 == 'view') && g2 == 'list') {
                            var h = fromParams['params'];
                            if (h) {
                                $timeout(function () {
                                    window.location.hash = h;
                                });
                            }
                        }
                    }
                }
            });
        }
    ]);



