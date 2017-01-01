
$(function(){
    // 跳转
    $(".my-song-row").click(function () {
        window.location.href = "view/videoClips.html";
    });
    $(".text-active").click(function () {
        window.location.href = "view/selectSong.html"
    });
    // 页数
    var page = 0;
    // 每页展示10个
    var size = 10;
    // dropload
    $('.content-body').dropload({
        scrollArea : window,
        domUp : {
            domClass   : 'dropload-up',
            domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
            domUpdate  : '<div class="dropload-update">↑释放更新</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">暂无数据</div>'
        },
        loadUpFn : function(me){
            $.ajax({
                type: 'GET',
                url: '../data/works.json',
                dataType: 'json',
                success: function(data){
                    var result = '',
                    songData = data.data;
                    for(var i = 0; i < songData.length; i++){
                        result += '<div class="my-song-row">' +
                            '<div class="song-pic" style="background-image:url('+songData[i].imgUrl+')">' +
                            '</div><div class="song-info">' +
                            '<div class="song-name overflow-point">'+songData[i].songName+'</div>' +
                            '<div class="song-data">' +
                            '<span>浏览<b id="lookNbr">'+songData[i].lookNumber+'</b>次</span>' +
                            '<span class="update">'+songData[i].status+'</span>' +
                            '</div></div></div>'
                    }
                    // 为了测试，延迟2秒加载
                    setTimeout(function(){
                        $('.content-list').html(result);
                        // 每次数据加载完，必须重置
                        me.resetload();
                        // 重置页数，重新获取loadDownFn的数据
                        page = 0;
                        // 解锁loadDownFn里锁定的情况
                        me.unlock();
                        me.noData(false);
                    },2000);
                },
                error: function(xhr, type){
                    alert('Ajax error!');
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        },
        loadDownFn : function(me){
            page++;
            // 拼接HTML
            var result = '';
            $.ajax({
                type: 'GET',
                // 分页加载
                // url: 'http://mm1.jinrustar.com/user/work/curr/list?page='+page+'&size='+size,
                url: '../data/works.json',
                dataType: 'json',
                success: function(data){
                    songData = data.data;
                    if(songData > 0){
                        for(var i = 0; i < songData.length; i++){
                            result += '<div class="my-song-row">' +
                                '<div class="song-pic" style="background-image:url('+songData[i].imgUrl+')">' +
                                '</div><div class="song-info">' +
                                '<div class="song-name overflow-point">'+songData[i].songName+'</div>' +
                                '<div class="song-data">' +
                                '<span>浏览<b id="lookNbr">'+songData[i].lookNumber+'</b>次</span>' +
                                '<span class="update">'+songData[i].status+'</span>' +
                                '</div></div></div>'
                        }
                        // 如果没有数据
                    }else{
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                    // 为了测试，延迟2秒加载
                    setTimeout(function(){
                        // 插入数据到页面，放到最后面
                        $('.content-list').append(result);
                        // 每次数据插入，必须重置
                        me.resetload();
                    },2000);
                },
                error: function(xhr, type){
                    alert('Ajax error!');
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        },
        // 提前加载距离
        threshold : 50
    });
});





