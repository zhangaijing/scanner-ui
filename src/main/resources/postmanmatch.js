layui.use(['form','layer', 'element'],function() {
    var layer = layui.layer,
        $ = layui.$,
        form = layui.form,
        element = layui.element;

    /**
     * postman匹配后复制到剪贴板
     */
    $(document).ready(function(){
        var clipboard = new ClipboardJS(".copy-btn",{
            text: function(trigger) {
                var $parent=$(trigger).parents(".content");
                var $paramContainer=$parent.find("#postmancontent");
                var paramContext=$paramContainer.val();
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