layui.use(['form','layer', 'element'],function() {
    var layer = layui.layer,
        $ = layui.$,
        form = layui.form,
        element = layui.element;

    var data="{\n" +
        "\t\"status\": true,\n" +
        "\t\"data\": {\n" +
        "\t\t\"projectId\": 122222,\n" +
        "\t\t\"projectName\": \"真实项目\"\n" +
        "\t},\n" +
        "\t\"message\": \"数据操作成功\",\n" +
        "\t\"arr\": [{\n" +
        "\t\t\t\"deviceId\": 1010,\n" +
        "\t\t\t\"deviceManage\": {\n" +
        "\t\t\t\t\"id\": 10,\n" +
        "\t\t\t\t\"deviceType\": \"灯具类\"\n" +
        "\t\t\t},\n" +
        "\t\t\t\"childs\": [{\n" +
        "\t\t\t\t\"menuId\": 10,\n" +
        "\t\t\t\t\"menuName\": \"子菜单名称\"\n" +
        "\t\t\t}, {\n" +
        "\t\t\t\t\"menuId\": 10,\n" +
        "\t\t\t\t\"menuName\": \"子菜单名称22\"\n" +
        "\t\t\t}]\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\t\"deviceId\": 2020,\n" +
        "\t\t\t\"deviceName\": \"集中器\",\n" +
        "\t\t\t\"deviceManage\": {\n" +
        "\t\t\t\t\"id\": 10,\n" +
        "\t\t\t\t\"childs\": [{\n" +
        "\t\t\t\t\t\"menuId\": 10,\n" +
        "\t\t\t\t\t\"menuName\": \"子菜单名称\"\n" +
        "\t\t\t\t}, {\n" +
        "\t\t\t\t\t\"menuId\": 33,\n" +
        "\t\t\t\t\t\"menuName\": \"子菜单名称33\"\n" +
        "\t\t\t\t}]\n" +
        "\t\t\t}\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\t\"deviceId\": 3333,\n" +
        "\t\t\t\"deviceName\": \"灯杆\",\n" +
        "\t\t\t\"deviceManage\": {\n" +
        "\t\t\t\t\"id\": 10,\n" +
        "\t\t\t\t\"deviceType\": \"灯杆类\",\n" +
        "\t\t\t\t\"childs\": [{\n" +
        "\t\t\t\t\t\"menuId\": 10,\n" +
        "\t\t\t\t\t\"menuName\": \"子菜单名称\"\n" +
        "\t\t\t\t}, {\n" +
        "\t\t\t\t\t\"menuId\": 33,\n" +
        "\t\t\t\t\t\"menuName\": \"子菜单名称33\"\n" +
        "\t\t\t\t}]\n" +
        "\t\t\t}\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\t\"deviceId\": 4444,\n" +
        "\t\t\t\"deviceName\": \"印象\",\n" +
        "\t\t\t\"deviceManage\": {\n" +
        "\t\t\t\t\"id\": 10,\n" +
        "\t\t\t\t\"deviceType\": \"音响类\",\n" +
        "\t\t\t\t\"childs\": [{\n" +
        "\t\t\t\t\t\"menuId\": 10,\n" +
        "\t\t\t\t\t\"menuName\": \"子菜单名称\"\n" +
        "\t\t\t\t}, {\n" +
        "\t\t\t\t\t\"menuId\": 33,\n" +
        "\t\t\t\t\t\"menuName\": \"子菜单名称33\"\n" +
        "\t\t\t\t}]\n" +
        "\t\t\t},\n" +
        "\t\t\t\"childs\": [{\n" +
        "\t\t\t\t\"menuId\": 10,\n" +
        "\t\t\t\t\"menuName\": \"子菜单名称\"\n" +
        "\t\t\t}, {\n" +
        "\t\t\t\t\"menuId\": 33,\n" +
        "\t\t\t\t\"menuName\": \"子菜单名称33\"\n" +
        "\t\t\t}]\n" +
        "\t\t}\n" +
        "\t],\n" +
        "\t\"list\": [12, 23, 55555]\n" +
        "}"

    var comment="{\n" +
        "\t\"status###状态\": false,\n" +
        "\t\"data###返回数据\": {\n" +
        "\t\t\"projectId###项目ID\": 1,\n" +
        "\t\t\"projectName###项目名称\": \"string\"\n" +
        "\t},\n" +
        "\t\"message###提示信息\": \"string\",\n" +
        "\t\"arr\": [{\n" +
        "\t\t\"deviceId###设备ID\": 10,\n" +
        "\t\t\"deviceName###设备名称\": \"string\",\n" +
        "\t\t\"deviceManage\": {\n" +
        "\t\t\t\"id###ID\": 10,\n" +
        "\t\t\t\"deviceType###设备类型\": \"string\",\n" +
        "\t\t\t\"childs\": [{\n" +
        "\t\t\t\t\"menuId###菜单ID\": 10,\n" +
        "\t\t\t\t\"menuName###菜单名称\": \"string\"\n" +
        "\t\t\t}]\n" +
        "\t\t},\n" +
        "\t\t\"childs\": [{\n" +
        "\t\t\t\"menuId###菜单ID\": 10,\n" +
        "\t\t\t\"menuName###菜单名称\": \"string\"\n" +
        "\t\t}]\n" +
        "\t}],\n" +
        "\t  \"list###数组列表\":[0]\n" +
        "}"

    /**
     * postman按钮单击事件
     */
    $("#methodlist").on("click",".postman-btn",function(){
        var $parentDom=$(this).parents(".inline-content");
        var requestJson=$parentDom.find("#methodrequestcontainer").text();
        var responseJson=$parentDom.find("#methodresponsecontainer").text();
        layer.open({
            "title":"请输入PostmanJson数据",
            "type":2,
            "content":"/postmanmatch.html",
            "scrollbar": false,
            "offset": '140px',
            "area":['535px','545'],
            "btn":["转换","取消"],
            "yes":function(index, layero){
                var $serviceContent=layero;
                var $iframeDom=$serviceContent.find("iframe").contents();
                var type=$iframeDom.find('input[name="matchtype"]:checked').val();
                var postmanJson=$iframeDom.find("#postmancontent").val();
                if(!postmanJson){
                    $iframeDom.find("#postmancontent").focus();
                    return;
                }
                var matchAfterJson;
                if(type=="request"){
                    matchAfterJson=matchPostman(postmanJson,requestJson);
                }else if(type=="response"){
                    matchAfterJson=matchPostman(postmanJson,responseJson);
                }else{
                    var jsonTemp=JSON.parse(postmanJson);
                    if((jsonTemp.status||jsonTemp.status==false)&&jsonTemp.data){
                        matchAfterJson=matchPostman(postmanJson,responseJson);
                    }else{
                        matchAfterJson=matchPostman(postmanJson,requestJson);
                    }
                }
                if(matchAfterJson!="{}"){
                    $iframeDom.find("#postmancontent").val(matchAfterJson);
                    layer.msg("转换成功！",{icon: 1});
                }else{
                    layer.msg("转换失败！",{icon: 6});
                }
            },
            "btn2":function(){
                layer.closeAll();
            }
        })
    })

    /**
     * 匹配函数
     * @param data
     * @param comment
     * @returns {string}
     */
    var matchPostman=function(data,comment){
        var jsonObj=JSON.parse(data);
        var commenttemp=JSON.parse(comment);
        matchfun(commenttemp,jsonObj);
        //console.log(JSON.stringify(commenttemp));
        return JSON.stringify(commenttemp);
    }

    /**
     * 匹配JSON数据和注释
     * @param commentJson
     * @param dataJson
     */
    var matchfun=function(commentJson,dataJson){
        for(var key in commentJson){
            var specialIndex=key.indexOf("###");
            var field=key;
            var fieldComment="";
            if(specialIndex>0){
                field=key.substring(0,specialIndex);
                fieldComment=key.substring(specialIndex+3);
            }
            var matchKeyObj=dataJson[field];
            if(matchKeyObj||matchKeyObj==false){
                var matchKeyObjType=$.type(matchKeyObj);
                if(matchKeyObjType=="array"){
                    //console.log(field+":数组");
                    if(matchKeyObj.length>0){
                        var copyCommentFirstItem={};
                        $.extend(true,copyCommentFirstItem,commentJson[key][0]);
                        var arrItem=matchKeyObj[0];
                        //暂不考虑二维数组
                        if(isJson(arrItem)){
                            for(var j in commentJson[key]){
                                matchfun(commentJson[key][j],matchKeyObj[j]);
                            }
                            var diffLen=matchKeyObj.length-commentJson[key].length;
                            if(diffLen>0){
                                var startIndex=commentJson[key].length;
                                var endIndex=matchKeyObj.length;
                                if(endIndex>5){
                                    endIndex=5;
                                }
                                for(var z=startIndex;z<endIndex;z++){
                                    var commentTemp={};
                                    $.extend(true,commentTemp,copyCommentFirstItem);
                                    matchfun(commentTemp,matchKeyObj[z])
                                    commentJson[key].push(commentTemp);
                                }
                            }
                        }else{
                            commentJson[key]=matchKeyObj;
                        }
                    }else{
                        commentJson[key]=matchKeyObj;
                    }
                }else if(isJson(matchKeyObj)){
                    //console.log(field+":json");
                    matchfun(commentJson[key],matchKeyObj);
                }else{
                    //console.log(field+":基本类型");
                    commentJson[key]=matchKeyObj;
                }
            }else{
                delete commentJson[key];
            }
        }
        //console.log(JSON.stringify(commentJson));
    }

    /**
     * 判断对象是否为JSON
     * @param dataObj
     * @returns {boolean}
     */
    var isJson=function(dataObj){
        var dataObjType=$.type(dataObj);
        if(dataObjType=="object" &&
            Object.prototype.toString.call(dataObj).toLowerCase() == "[object object]" && !dataObj.length){
            return true;
        }else{
            return false;
        }
    }





    /**
     * postman匹配后复制到剪贴板
     */
    $(document).ready(function(){
        var clipboard = new ClipboardJS(".copy-btn",{
            text: function(trigger) {
                var $parent=$(trigger).parents(".content");
                var $paramContainer=$parent.find("#postmancontent");
                var paramContext=$paramContainer.text();
                if(paramContext.indexOf("###")==-1){
                    return "";
                }
                return paramContext;
            }
        });
        clipboard.on('success', function (e) {
            console.log(e);
            layer.msg("转换数据复制成功");
        });
        clipboard.on('error', function (e) {
            console.log(e);
            layer.error("转换数据复制失败");
        });
    });




});