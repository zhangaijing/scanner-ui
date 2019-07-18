<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019-07-16
  Time: 11:33
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Controller解析</title>
    <link rel="stylesheet" href="/webjars/scanner-ui/0.0.1-SNAPSHOT/layui/css/layui.css"  media="all">
    <style>
        .controller-content{
            margin-right:16px;
        }
        .search-content{
            padding-bottom:8px !important;
            padding-top:8px !important;
        }
        .controllerDiv{
            height:52px;
            padding-left:5px;
            border-right:0px solid green;
            padding-right:10px;
            margin:0px;
            border-bottom:1px solid #009688;
        }
        .search-btn{
            margin-left:13px;
        }
        .v-align {
            margin: 0 auto;
            height: 52px;
            line-height: 52px;
        }
        .controller{
            display:inline-block;
            width:49%;
        }
        .contentLeft{
            text-align:left;
        }
        .contentRight{
            text-align:right;
        }
        .mouse{
            color:#333;
        }
        .mouse-click{
            background:#cfe8f1;
            color:#3b4151;
        }
        .mouse:hover{
            background: #f1f7f9;
            cursor:pointer;
        }
        .mouse:active{
            background:#c9e2ea;
            cursor:pointer;
        }
        .methodcontent{
            padding-left:2px;
            padding-right:2px;
            margin:0px;
            margin-bottom:5px;
            margin-top:5px;
        }
        .method-valign{
            margin: 0 auto;
            height: 46px;
            line-height: 46px;
            background-color:#dbf5e6;
            border:1px solid #c3e8d1;
            padding-left:10px;
            cursor:pointer;
        }
        .inline-content{
            padding-left:15px;
            padding-top:20px;
            background-color:#ebf7f2;
            border:1px solid #c3e8d1;
            min-height:160px;
            overflow:hidden;
            padding-bottom:12px;
            clear:both;
            display:none;
        }
        .url-content{
            margin-bottom:18px;
        }
        .param-content{
            float:left;
            width:50%;
        }
        .param-text{
            font-size:16px;
            font-weight:bold;
            margin-right:10px;
        }
        .url-text{
            font-size:16px;
            letter-spacing:1px;
        }
        .json-content{
            border:1px solid #f1edd7;
            background-color:#fbf6dc;
            padding:10px;
            margin-top:10px;
            width:90%;
            word-wrap:break-word;
            font-size:14px;
            line-height: 20px;
        }
        .left-color{
            font-size:16px;
            color:black;
        }
        .right-color{
            font-size:16px;
            color:#10a54a;
        }
    </style>
</head>
<body>
    <ul class="layui-nav">
        <li class="layui-nav-item">HOOLINK-RPC</li>
    </ul>
    <div class="layui-row" style="margin-left:100px;margin-right:100px">
        <div class="layui-col-xs3">
            <div class="grid-demo grid-demo-bg1 controller-content">
                <div class="controllerDiv layui-form-item search-content">
                    <div class="v-align contentRight">
                        <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入URL" class="layui-input" style="width:66%;display:inline-block">
                        <input type="button" class="layui-btn layui-btn-radius search-btn" value="搜索"></input>
                    </div>
                </div>
                <div id="controllerlist" style="margin:0px">

                </div>
            </div>
        </div>
        <div class="layui-col-xs9" id="methodlist">

        </div>
    </div>

    <!--controller区域模板 start-->
    <div class="controllerDiv mouse" id="controllercontainer" classpath="com.hoolink.dmx.controller.MrDmxDownController" style="display:none">
        <span class="contentLeft v-align controller">URL地址</span>
        <span class="contentRight v-align controller">备注信息</span>
    </div>
    <!--controller区域模板 end-->

    <!--方法区域模板 start-->
    <div class="methodcontent" id="methodcontainer" style="display:none">
        <div class="method-valign" id="methodtitlecontainer">
            <span class="contentLeft v-align controller left-color" id="methodurlcontainer">URL地址</span>
            <span class="contentRight v-align controller right-color" id="methodcommentcontainer">备注信息</span>
        </div>
        <div class="inline-content" id="methodinlinecontainer">
            <div class="url-content"><span class="param-text">请求地址：</span><span class="url-text" id="methodfullurlcontainer"></span></div>
            <div>
                <div class="param-content">
                    <div>
                        <span class="param-text">请求参数：</span>
                        <span><input type="button" class="layui-btn request-copy" value="一键复制"/></span>
                    </div>
                    <div class="json-content request-param" id="methodrequestcontainer">
                        无
                    </div>
                </div>
                <div class="param-content">
                    <div>
                        <span class="param-text">响应参数：</span>
                        <span><input type="button" class="layui-btn response-copy" value="一键复制"/></span>
                    </div>
                    <div class="json-content response-param" id="methodresponsecontainer">
                        无
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--方法区域模板 end-->

</body>
<script src="/webjars/scanner-ui/0.0.1-SNAPSHOT/layui/layui.js"></script>
<script src="/webjars/scanner-ui/0.0.1-SNAPSHOT/layui/clipboard.min.js"></script>
<script src="/webjars/scanner-ui/0.0.1-SNAPSHOT/index.js"></script>
</html>
