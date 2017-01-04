'use strict';

var app = angular.module('app', ['ui.load', 'ui.router', 'ngStorage', 'brantwills.paging', 'oc.lazyLoad', /*'ngImgCrop',*/ 'angularCSS', 'infinite-scroll']);

/* Controllers */
app = angular.module('app');

app.controller('AppCtrl', ['$scope', '$localStorage', '$window', '$http', '$state', '$rootScope',
    function ($scope, $localStorage, $window, $http, $state, $rootScope) {
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        isIE && angular.element($window.document.body).addClass('ie');
        isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

        // config
        $scope.app = {
            name: 'MIMI',
            version: '0.0.1',
            // for chart colors
            color: {
                primary: '#64b52f',
                info: '#23b7e5',
                success: '#27c24c',
                warning: '#fad733',
                danger: '#f05050',
                light: '#e8eff0',
                dark: '#3a3f51',
                black: '#1c2b36'
            },
            settings: {
                themeID: 1,
                navbarHeaderColor: 'bg-black-only',
                navbarCollapseColor: 'bg-dark-blue-only',
                asideColor: 'bg-black',

                headerFixed: true,
                asideFixed: true,
                asideFolded: false,
                asideDock: false,
                container: false
            }
        };
        $scope.defaultAvatar = $rootScope.defaultAvatar = 'https://dreamspacex.com/image/index/logo.png';

        $scope.logout = function () {
            return $http({
                method: 'POST',
                url: '/logout'
            }).then(function (result) {
                var d = result.data;
                if (d.httpCode == 200) {//注销成功
                    deleteUserInfo();
                    $state.go('access.login');
                }
            });
            function deleteUserInfo() {
                $.cookie('_ihome_uid', null);
            }
        };

        $localStorage.settings = $scope.app.settings;

        // save settings to local storage  暂不支持自定义布局
        /*if (angular.isDefined($localStorage.settings)) {
         $scope.app.settings = $localStorage.settings;
         } else {
         $localStorage.settings = $scope.app.settings;
         }*/
        $scope.$watch('app.settings', function () {
            if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                // aside dock and fixed must set the header fixed.
                $scope.app.settings.headerFixed = true;
            }
            // save to local storage
            $localStorage.settings = $scope.app.settings;
        }, true);

        // angular translate
        //$scope.lang = { isopen: false };
        //$scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        $.ajaxSetup({
            type: "POST",
            beforeSend: function (evt, request, settings) {
                //request.url = 'MC-Web' + request.url;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                switch (jqXHR.status) {
                    case (404):
                        alert("未找到请求的资源");
                        break;
                }
            }
        });
        $(document).ajaxSuccess(function (event, xhr, settings) {

            if (xhr.responseText) {
                xhr.responseJSON = $.handleJSON(xhr.responseText);
            }

            if (xhr.responseJSON == undefined) {
                return;
            }

            console.log("j:" + JSON.stringify(xhr.responseJSON));

            if (xhr.responseJSON.httpCode == 401) { //未登录
                $state.go('access.login');
                $.ajax({
                    url: "/login",
                    data: {account: "William", password: "admin"},
                    dataType: "text"
                }).then(function (result) {
                    result = $.handleJSON(result);
                    if (result.httpCode == 200) {
                        $state.go("main.work.list.all");
                    }
                    return null;
                });
                return null;
            } else if (xhr.responseJSON.httpCode == 303) {
            } else if (xhr.responseJSON.httpCode != 200) {
                alert(xhr.responseJSON.msg);
            }
            return event;
        });
    }]);

/*无限自动分页加载*/
app.factory('PageItemsLoader', function () {
    var PageItemsLoader = function (options) {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.page = 1;
        this.filterKeyword = "";

        var config = {
            $sp: null,
            url: "",
            onPageFinished: function (sp, dataJson, items) {
            }

        };
        config = $.extend({}, config, options);
        this.config = config;
    };


    PageItemsLoader.prototype.nextPage = function () {
        if (this.busy) return;
        this.busy = true;

        // var url = "/user/work/list";
        $.ajax({
            url: this.config.url,
            method: "get",
            data: this.config.$sp.param,
            dataType: "text"
        }).then(function (data) {
            console.log("json:" + data);
            try {
                data = $.handleJSON(data);
            } catch (e) {
                return;
            }

            if (data.httpCode != 200) {
                alert(data.msg);
                return;
            }
            var items = data.data.records;
            document.querySelector("#btnLoadMore").innerText = items.length == 0 ? "没有更多" : "加载更多";
            console.log(data);
            for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
            }
            if (this.items.length != 0) {
                this.after = "t3_" + this.items[this.items.length - 1].id;
            }

            this.busy = false;
            this.page += 1;

            //
            if (this.config.onPageFinished) {
                this.config.onPageFinished(this.$sp, data, this.items);
            }


        }.bind(this));
    };

    return PageItemsLoader;
});
