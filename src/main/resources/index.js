layui.use(['layer'], function(){
    var $ = layui.$
        ,layer=layui.layer; //导航的hover效果、二级菜单等功能，需要依赖element模块

    /**
     * 页面初始化
     */
    $(document).ready(function(){
        $.ajax({
            type: 'POST',
            url:"/scanner/getController",
            async:false,
            datatype:"json",
            success:function (data) {
                var serviceName=data.serviceName.toUpperCase()+"微服务";
                var controllerList=data.controllerList;
                $("#servicename").text(serviceName);
                $("#controllerlist").empty();
                var $controllercontainer=$("#controllercontainer");
                for(var i in controllerList){
                    var $newControllerContainer=$controllercontainer.clone();
                    $newControllerContainer.find(".contentLeft").text(controllerList[i].url);
                    $newControllerContainer.find(".contentRight").text(controllerList[i].comment);
                    $newControllerContainer.attr("classpath",controllerList[i].classPath);
                    $newControllerContainer.show();
                    $("#controllerlist").append($newControllerContainer);
                }
            }
        });
    });

    /**
     * controlleURL点击事件
     */
    $("#controllerlist").on("click",".mouse",function(){
        $(".mouse").removeClass("mouse-click");
        $(this).addClass("mouse-click");
        var classPath=$(this).attr("classpath");
        $.ajax({
            type: 'POST',
            url:"/scanner/getControllerMethod",
            data:{classPath:classPath},
            async:false,datatype:"json",
            success:function(data){
                $("#methodlist").empty();
                var $methodcontainer=$("#methodcontainer");
                for(var i in data){
                    var url=data[i].url;
                    var comment=data[i].comment;
                    $methodcontainer.find("#methodurlcontainer").text(url);
                    $methodcontainer.find("#methodtitlecontainer").attr("methodurl",url);
                    $methodcontainer.find("#methodcommentcontainer").text(comment);
                    var $newMethodContainer=$methodcontainer.clone();
                    $newMethodContainer.show();
                    $("#methodlist").append($newMethodContainer);
                }
            }
        });
    });

    /**
     * 方法URL单击事件
     */
    $("#methodlist").on("click",".method-valign",function(){
        var $inlineContent=$(this).parent().children(".inline-content");
        if($inlineContent.is(":hidden")){
            $(".inline-content").hide();
            $inlineContent.show();
            var methodUrl=$(this).attr("methodurl");
            $.ajax({
                type: 'POST',
                url:"/scanner/getMethodParam",
                data:{methodUrl:methodUrl},
                async:false,
                datatype:"json",
                success:function(data){
                    console.log(data);
                    var $url=$inlineContent.find(".url-text");
                    $url.text(data.url);
                    var $request=$inlineContent.find(".request-param");
                    $request.text(data.paramJson);
                    var $response=$inlineContent.find(".response-param");
                    $response.text(data.returnJson);
                }
            })
        }else{
            $inlineContent.hide();
        }

    });

    /**
     * 请求参数复制到剪贴板
     */
    $(document).ready(function(){
        var clipboard = new ClipboardJS(".request-copy",{
            text: function(trigger) {
                var $parent=$(trigger).parents(".param-content");
                var $paramContainer=$parent.find(".request-param");
                var paramContext=$paramContainer.text();
                return paramContext;
            }
        });
        clipboard.on('success', function (e) {
            console.log(e);
            layer.msg("请求参数复制成功");
        });
        clipboard.on('error', function (e) {
            console.log(e);
            layer.error("请求参数复制失败");
        });
    });

    /**
     * 响应参数复制到剪贴板
     */
    $(document).ready(function(){
        var clipboard1 = new ClipboardJS(".response-copy",{
            text: function(trigger) {
                var $parent=$(trigger).parents(".param-content");
                var $paramContainer=$parent.find(".response-param");
                var paramContext=$paramContainer.text();
                return paramContext;
            }
        });
        clipboard1.on('success', function (e) {
            console.log(e);
            layer.msg("响应参数复制成功");
        });
        clipboard1.on('error', function (e) {
            console.log(e);
            layer.error("响应参数复制失败");
        });
    });

});