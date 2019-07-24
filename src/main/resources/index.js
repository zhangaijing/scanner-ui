layui.use(['layer','element'], function(){
    var $ = layui.$
        ,element = layui.element
        ,layer=layui.layer;

    //定时器ID
    var intervalId;

    /**
     * 页面初始化处理
     */
    var initPage=function(){
        var jsonData=buildJson();
        if(!jsonData){
            return;
        }
        showLoad();
        $.ajax({
            type: 'POST',
            url:"/scanner/getController",
            data:jsonData,
            async:true,
            datatype:"json",
            success:function (data) {
                hideLoad();
                if(data){
                    var serviceName=data.serviceName.toUpperCase()+"微服务";
                    var controllerList=data.controllerList;
                    $("#servicename").text(serviceName);
                    $("#controllerlist").empty();
                    var $controllercontainer=$("#controllercontainer");
                    var commentVal=" ";
                    for(var i in controllerList){
                        var $newControllerContainer=$controllercontainer.clone();
                        $newControllerContainer.find(".contentLeft").text(controllerList[i].url);
                        if(controllerList[i].comment){
                            commentVal=controllerList[i].comment;
                        }else{
                            commentVal="无";
                        }
                        commentVal=commentVal+"【"+removeAuthorMoreChar(controllerList[i].author)+"】"
                        $newControllerContainer.find(".contentRight").text(commentVal);
                        $newControllerContainer.attr("classpath",controllerList[i].classPath);
                        $newControllerContainer.show();
                        $("#controllerlist").append($newControllerContainer);
                    }
                }
            },
            error:function(data){
                layer.alert("数据获取失败！");
                hideLoad();
            }
        });
    }

    /**
     * controlleURL点击事件
     */
    $("#controllerlist").on("click",".mouse",function(){
        $(".mouse").removeClass("mouse-click");
        $(this).addClass("mouse-click");
        var classPath=$(this).attr("classpath");
        var jsonData=buildJson();
        if(!jsonData){
            return;
        }
        jsonData.classPath=classPath;
        showLoad();
        $.ajax({
            type: 'POST',
            url:"/scanner/getControllerMethod",
            data:jsonData,
            async:true,
            datatype:"json",
            success:function(data){
                hideLoad();
                if(data){
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
            },
            error:function(){
                layer.alert("数据获取失败！");
                hideLoad();
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
            var jsonData=buildJson();
            if(!jsonData){
                return;
            }
            jsonData.methodUrl=methodUrl;
            showLoad(86);
            $.ajax({
                type: 'POST',
                url:"/scanner/getMethodParam",
                data:jsonData,
                async:true,
                datatype:"json",
                success:function(data){
                    hideLoad();
                    if(data){
                        console.log(data);
                        var $url=$inlineContent.find(".url-text");
                        $url.text(data.url);
                        var $request=$inlineContent.find(".request-param");
                        $request.text(data.paramJson);
                        var $response=$inlineContent.find(".response-param");
                        $response.text(data.returnJson);
                    }
                },
                error:function(){
                    layer.alert("数据获取失败！");
                    hideLoad();
                }
            })
        }else{
            $inlineContent.hide();
        }
    });

    /**
     * 微服务选择弹出框单击事件
     */
    $("#servicedialogbtn").click(function(){
        showServiceDlg();
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

    /**
     * 显示微服务选择框
     */
    var showServiceDlg=function(){
        var storeIp=window.localStorage.getItem("ip");
        var storePort=window.localStorage.getItem("port");
        if(storeIp && storePort){
            return;
        }
        layer.open({
            "title":"请选择微服务",
            "type":2,
            "content":"/selectservice.html",
            "scrollbar": false,
            "area":['650px','auto'],
            "btn":["确定","取消"],
            "yes":function(index, layero){
                var $serviceContent=layero;
                var ipVal=$serviceContent.find("iframe").contents().find("#ip").val();
                var servicePort=$serviceContent.find("iframe").contents().find(".serviceactive").attr("port");
                var serviceName=$serviceContent.find("iframe").contents().find(".serviceactive").text();
                if(!ipVal){
                    $serviceContent.find("iframe").contents().find("#ip").focus();
                    return;
                }
                window.localStorage.setItem("ip",ipVal);
                window.localStorage.setItem("serviceName",serviceName);
                window.localStorage.setItem("servicePort",servicePort);
                layer.closeAll();
                //重新加载页面数据
                initPage();
            },
            "btn2":function(){
                layer.closeAll();
            }
        })
    }

    /**
     * 显示loading
     */
    var showLoad=function(n) {
        $("#mask").show();
        $("#loadcontent").show();
        if(!n){
            n=0;
        }else{
            element.progress('load', n + '%');
        }
        intervalId = setInterval(function () {
            var randomNum=Math.floor((Math.random()*5)+10);
            n = n + randomNum;
            if (n > 96) {
                n = 96;
            }
            element.progress('load', n + '%');
        }, 200);
    };

    /**
     * 隐藏loading
     */
    var hideLoad=function(){
        clearInterval(intervalId);
        element.progress('load', 100+'%');
        var t = window.setTimeout(function(){
            $("#loadcontent").hide();
            $("#mask").hide();
            element.progress('load', 0+'%');
        },10);
    }

    /**
     * JSON拼接
     */
    var buildJson=function(){
        var storeIp=window.localStorage.getItem("ip");
        var storeServicePort=window.localStorage.getItem("servicePort");
        if(storeIp && storeServicePort){
            var jsonData={};
            jsonData.ip="192.168.1."+storeIp;
            jsonData.port=storeServicePort;
            return jsonData;
        }else{
            hideLoad();
            showServiceDlg();
        }
    }

    /**
     * 去除作者多余的字符
     * @param author
     */
    var removeAuthorMoreChar=function(author){
        var charIndex=author.indexOf(">");
        if(charIndex>0){
            var rightCharIndex=author.lastIndexOf("<");
            if(rightCharIndex>charIndex){
                author=author.substring(charIndex+1,rightCharIndex);
            }else{
                author=author.substring(charIndex+1);
            }
        }
        return author;
    }

    /**
     * 页面初始化
     */
    $(document).ready(function(){
        initPage();
    });
});