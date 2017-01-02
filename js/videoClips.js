/**
 * Created by Administrator on 2017/1/2.
 */
$(function(){
    // 评论和转发
    $(".comment").click(function(){
        window.location.href = "videoDetails.html"
    });
    $(".share").click(function(){
        window.location.href = "videoDetails.html"
    });

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
    }
});