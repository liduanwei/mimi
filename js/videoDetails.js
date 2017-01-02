/**
 * 评论、分享页
 * Created by Administrator on 2017/1/2.
 */
$(function(){
    // 点赞
    $(".approval").on('click',function(){
        zanCaiFun(12,zan);
    });
    // 踩
    $(".tread").on("click",function(){
        zanCaiFun(12,cai);
    });

        // 踩和赞方法
    var zanCaiFun = function(wordId,sendType){
        $.ajax({
            type:'POST',
            url:'http://mm1.jinrustar.com/swagger-ui.html#!/user-work-comment-controller/destroyUsingPOST',
            data:{id:wordId,type:sendType},
            success:function(){
                $(this).css({
                    color:'#20cc85'
                })
            },
            error:function(){
                console.log("服务器错误,点赞失败");
            }
        })
    };

    // 分享
    $(".share").on("click",function(){
        alert("点击右上角三个点分享给朋友或分享到朋友圈吧！")
    });

    // 发表评论
    $("#sendComment").on("click",function(){
       var commentVal = $("#commentIpt").val();
       if(commentVal!=""){
           // 测试代码 --start--
           result = '<div class="row-comment">'+
               '<div class="user-pic user-pic1">'+
               '</div>'+
               '<div class="coment-content">'+
               ' <div class="user-name">'+
               '<span class="overflow-point">回忆、勾勒的曾经</span>'+
               '<i>2小时前</i>'+
               '</div>'+
               '<div class="comment-text">'+commentVal +'</div></div></div>'
           $(".comment-box").prepend(result);
           $("#commentIpt").val("")
           // 测试代码 --end--

           // 生产代码 --start--
           // $.ajax({
           //     type: 'GET',
           //     url: '../data/comment.json',
           //     //          url:'http://mm1.jinrustar.com/user/subwork/comment'
           //     dataType: 'json',
           //     data:{subWorkId:12,content:commentVal,replyCommentId:1290},
           //     success: function(data){
           //         var result = '';
           //         commentData = data.commentData;
           //         result = '<div class="row-comment">'+
           //             '<div class="user-pic" style="background-image:url('+commentData[i].userPic+')"></div>'+
           //             '<div class="coment-content">'+
           //             '<div class="user-name">'+
           //             '<span class="overflow-point">'+commentData[i].userName+'</span>'+
           //             '<i>'+commentData[i].status+'</i></div>'+
           //             '<div class="comment-text">'+commentData[i].comment+' </div> </div> </div>'
           //         $(".comment-box").prepend(result);
           //     }
           // })
       }
    });

    // 加载评论、实现上拉加载、下拉刷新
    // 页数
    var page = 0;
    // 每页展示10个
    var size = 10;
    // dropload
    $('.comment-container').dropload({
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
                url: '../data/comment.json',
                //          url:'http://mm1.jinrustar.com/user/subwork/comment/1/list',
                dataType: 'json',
                success: function(data){
                    var result = '';
                    var commentData = data.commentData;
                                     for(var i = 0; i < commentData.length; i++){
                                         result += '<div class="row-comment">'+
                                             '<div class="user-pic" style="background-image:url('+commentData[i].userPic+')"></div>'+
                                             '<div class="coment-content">'+
                                             '<div class="user-name">'+
                                             '<span class="overflow-point">'+commentData[i].userName+'</span>'+
                                             '<i>'+commentData[i].status+'</i></div>'+
                                             '<div class="comment-text">'+commentData[i].comment+' </div> </div> </div>'
                                     }
                    // 为了测试，延迟2秒加载
                    setTimeout(function(){
                        $('.comment-box').html(result);
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
                url: '../data/comment.json',
                dataType: 'json',
                success: function(data){
                    var commentData = data.commentData;
                    if(commentData.length > 0){
                        for(var i = 0; i < commentData.length; i++){
                            result +=  '<div class="row-comment">'+
                                '<div class="user-pic" style="background-image:url('+commentData[i].userPic+')"></div>'+
                                '<div class="coment-content">'+
                                '<div class="user-name">'+
                                '<span class="overflow-point">'+commentData[i].userName+'</span>'+
                                '<i>'+commentData[i].status+'</i></div>'+
                                '<div class="comment-text">'+commentData[i].comment+' </div></div></div>'
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
                        $('.comment-box').append(result);
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