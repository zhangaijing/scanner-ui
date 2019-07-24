layui.use(['layer','element'], function(){
    var $ = layui.$
        ,element = layui.element
        ,layer=layui.layer;

    /**
     * 页面初始化--加载JSON数据
     */
    $(document).ready(function(){
        if (!window.localStorage) {
            alert("浏览器不支持本地存储！");
        }
        var storeIp=window.localStorage.getItem("ip");
        var storeServiceName=window.localStorage.getItem("serviceName");
        if(storeIp){
            $("#ip").val(storeIp);
        }
        if(!storeServiceName){
            //默认使用第一个作为默认选择
            for(var tempKey in serviceConfig){
                storeServiceName=tempKey;
                break;
            }
        }
        $("#servicenamecontent").empty();
        var $serviceNameModel=$("#servicenamemodel");
        for(var key in serviceConfig){
            var $newServiceName=$serviceNameModel.clone();
            $newServiceName.text(key);
            $newServiceName.attr("port",serviceConfig[key]);
            $newServiceName.removeAttr("id");
            $newServiceName.removeClass("service-model");
            if(key==storeServiceName){
                $newServiceName.addClass("serviceactive");
            }
            $("#servicenamecontent").append($newServiceName);
        }
    });

    /**
     * 微服务名单击事件
     */
    $("#servicenamecontent").on("click",".service",function(){
        $(".service").removeClass("serviceactive");
        $(this).addClass("serviceactive");
    });
});