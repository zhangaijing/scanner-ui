layui.use(['layer', 'element'],function() {
    var layer = layui.layer,
        $ = layui.$,
        element = layui.element;

    /**
     * SQL转Mybatis按钮单击事件
     */
    $("#toMybatisBtn").click(function(){
        var str = $("#sqlText").val();
        str=trim(str);
        str=replaceAll(str,"\"","'");
        var copySqlStr=str.toUpperCase();
        if(copySqlStr.indexOf("INSERT INTO")==0){
            batchInsert(str);
            return;
        }
        str=replaceEnabled(str);
        //字符串替换为'?'
        var reg = /\'(.*?)\'/g;
        var result=str.match(reg);
        if(result){
            for(var i in result){
                str = str.replace(result[i],"\'\?\'");
            }
        }
        console.log("字符串替换后的SQL"+str);
        //数字替换为?
        reg=/\d+(\.\d+)?/g;
        result=str.match(reg);
        if(result){
            for(var i in result){
                str=str.replace(result[i],"?");
            }
        }
        console.log("数字替换后的SQL"+str);
        //in 替换
        reg=/(\s*)in(.*?)\((.*?)\)/g;
        str=replaceSpecial(str,reg,' in ?')
        console.log("替换IN后的SQL："+str);
        generBean(str);
        mapKeys="";
        $("#beanDiv").css("display","block");
        var whereStr=str;
        whereStr=trim(whereStr);
        whereStr=whereStr.replace(/' *\? *'/g,"?");//清除有单引号的情况
        whereStr=whereStr.replace(/' *\?/g,"?");
        whereStr=whereStr.replace(/\? *'/g,"?");
        //update特殊处理
        var updateFlag=false;
        if(whereStr.toUpperCase().indexOf("UPDATE")==0){
            whereStr=batcbUpdate(whereStr);
            updateFlag=true;
        }
        var findWhereStr=whereStr.toUpperCase();
        var findEnabled=checkSqlFirstCondition(findWhereStr,0);
        var whereIndx=0;
        while(findEnabled>=0){
            if(findEnabled==0){
                //不存在enabled=1|0的情况。(存在不处理)
                whereIndx=findWhereStr.indexOf("WHERE",whereIndx+2);
                if(whereIndx>0){
                    var whereBeforeStr=whereStr.substring(0,whereIndx+"WHERE".length);
                    var whereAfterStr=whereStr.substring(whereIndx+"WHERE".length);
                    whereStr=whereBeforeStr+" 1=1 AND "+whereAfterStr;
                    findWhereStr=whereStr.toUpperCase();
                }
            }else{
                whereIndx=findEnabled+10;
            }
            findEnabled=checkSqlFirstCondition(findWhereStr,whereIndx);
        }
        whereStr=replaceSpecial(whereStr,/@=@/g,"1=1");
        whereStr=replaceLocate(whereStr);
        console.log("替换loate后的字符串："+whereStr);
        whereStr=replaceBetween(whereStr);
        console.log("替换between后的字符串："+whereStr);
        var afterStr=whereStr;
        var queIndex=afterStr.indexOf("?");
        var sqlStr="";
        while(queIndex!=-1){
            var beforeStr=afterStr.substring(0,queIndex);
            beforeStr=repalceFun(beforeStr);
            afterStr=afterStr.substring(queIndex+1);
            sqlStr+=beforeStr;
            queIndex=afterStr.indexOf("?");
            if(queIndex==-1)
                sqlStr+=afterStr;
        }
        if(sqlStr=="")
            sqlStr=whereStr;
        var sqlBeforeFlagStr="";
        var sqlAfterFlagStr="";
        if(updateFlag){
            sqlBeforeFlagStr="<update";
            sqlAfterFlagStr="</update>";
        }else{
            sqlBeforeFlagStr="<select";
            sqlAfterFlagStr="</select>";
        }
        sqlStr=sqlBeforeFlagStr+" id=\""+$("#sqlId").val()+"\" resultType=\"beanTemplate\">\n"+sqlStr+"\n"+sqlAfterFlagStr;
        $("#mybatisText").val(sqlStr);
        generWhereBean(mapKeys);
        generMethod(mapKeys);
    });

    /**
     * 替换locate---特殊处理
     */
    function replaceLocate(whereStr){
        var reg=/locate\s*\((.*?)\)/ig;
        var result=whereStr.match(reg);
        if(result){
            for(var i in result){
                var matchStr=result[i].split(",");
                var fieldStr=trim(matchStr[1]).substring(0,matchStr[1].length-1);
                whereStr=whereStr.replace(result[i],fieldStr+" locate ?");
            }
        }
        return whereStr;
    }

    /**
     * 替换between---特殊处理
     */
    function replaceBetween(whereStr){
        var reg=/between(.*?)and\s+(.*?)\?(.*?)\)(.*?)\s*/ig;
        whereStr=replaceSpecial(whereStr,reg,"startend ? ");
        reg=/between(.*?)and\s+(.*?)\?(.*?)\s*/ig;
        whereStr=replaceSpecial(whereStr,reg,"startend ? ");
        return whereStr;
    }

    /**
     * 替换enabled---特殊处理
     */
    function replaceEnabled(sqlStr){
        var reg=/1\s*=\s*1/g;
        sqlStr=replaceSpecial(sqlStr,reg,"@=@");
        reg=/enabled *= *[01]/ig;
        var result=sqlStr.match(reg);
        if(result){
            for(var i in result){
                var matchStr=result[i];
                matchStr=replaceSpecial(matchStr,/\s+/g,"");
                if(matchStr.indexOf("=0")>0){
                    sqlStr=sqlStr.replace(result[i],"enabled=false ");
                }else{
                    sqlStr=sqlStr.replace(result[i],"enabled=true ");
                }
            }
        }
        return sqlStr;
    }

    /**
     * 检测SQL语句是否需要自动添加1=1条件,0为不需要，非0为需要
     */
    function checkSqlFirstCondition(sqlStr,startIndx){
        var tempStartIndx=startIndx+2;
        var tempSqlStr=sqlStr.substring(tempStartIndx)
        var reg=/(where\s+enabled=)|(where\s+@=@)/i;
        result=tempSqlStr.match(reg);
        if(result){
            return result.index+startIndx;
        }else{
            var whereIndx=tempSqlStr.indexOf("WHERE");
            if(whereIndx>0){
                return 0;
            }
        }
        return -1;
    }

    /**
     * 替换指定字符公用函数
     */
    function replaceSpecial(whereStr,reg,replaceStr){
        var result=whereStr.match(reg);
        if(result){
            for(var i in result){
                var matchStr=result[i];
                whereStr=whereStr.replace(result[i],replaceStr);
            }
        }
        return whereStr;
    }

    /**
     * 替换标识符
     */
    function repalceFun(beforeStr) {
        beforeStr = rtrim(beforeStr);
        beforeStr = spaceOptFun(beforeStr);
        var firstSpaceLastInd = beforeStr.lastIndexOf(" ");
        var sqlKeyStr = trim(beforeStr.substring(firstSpaceLastInd));
        beforeStr = rtrim(beforeStr.substring(0, firstSpaceLastInd));//SQL关键字(=,like,in等)前的所有字符串。
        var secondSpaceLastInd = beforeStr.lastIndexOf(" ");
        var fieldStr = trim(beforeStr.substring(secondSpaceLastInd));
        beforeStr = rtrim(beforeStr.substring(0, secondSpaceLastInd));//字段前的所有字符串。
        firstSpaceLastInd = beforeStr.lastIndexOf(" ");
        var sqlCondKeyStr = trim(beforeStr.substring(firstSpaceLastInd));
        beforeStr = rtrim(beforeStr.substring(0, firstSpaceLastInd));//SQL关键字(and,or等)前的所有字符串。
        var fieldParaStr = fieldToBeanParamName(fieldStr);
        var objName=getSqlParamName();
        if(sqlKeyStr.toUpperCase()=="IN"){
            beforeStr += "\n" + "<if test=\"" + objName+fieldParaStr + "List !=null";
            beforeStr+=" and "+objName+fieldParaStr+"List.size()>0";
            beforeStr+="\">";
        }else if(sqlKeyStr.toUpperCase()=="STARTEND"){
            beforeStr += "\n" + "<if test=\"" + objName+fieldParaStr + "Start !=null and "+objName+fieldParaStr+"End !=null";
            beforeStr+="\">";
        }else{
            beforeStr += "\n" + "<if test=\"" + objName+fieldParaStr + "!=null";
            if(checkFieldType(fieldParaStr)=="String"){
                beforeStr +=" and "+objName+fieldParaStr+"!=''\">";
            }else{
                beforeStr+="\">";
            }
        }
        beforeStr += "\n" + "	" + sqlCondKeyStr + " ";
        if(sqlKeyStr.toUpperCase()!="LOCATE"){
            beforeStr+= fieldStr
        }
        beforeStr+=" " + generKeyJoinFun(sqlKeyStr, fieldParaStr,fieldStr) + "\n</if>";
        mapKeys = mapKeys + fieldParaStr + ",";
        return beforeStr;
    }

    /**
     * 空格处理--------防止=，！=，<>,>=,<= 前没有输入空格
     */
    function spaceOptFun(checkStr) {
        var checkStrLen = checkStr.length;
        var splitLen = 4;
        var splitStr = "";
        var condBeforeStr = "";
        if (checkStrLen < splitLen) {
            splitStr = checkStr;
        } else {
            splitStr = checkStr.substring(checkStr.length - splitLen);
            condBeforeStr = checkStr.substring(0, checkStr.length - splitLen);
        }
        var condStr = "!=,<>,>=,<=,=,>,<";
        var condArr = condStr.split(",");
        for (var i in condArr) {
            var tempStr = condArr[i];
            if (splitStr.indexOf(tempStr) > -1) {
                var tempStrLen = tempStr.length;
                var splitCondLen = splitStr.length - tempStr.length;
                var sqlCondStr = splitStr.substring(splitCondLen - 1);
                if (" " + tempStr != sqlCondStr) {//不存在空格
                    splitStr = splitStr.substring(0, splitCondLen) + " " + tempStr;
                }
                break;
            }
        }
        checkStr = condBeforeStr + splitStr;
        return checkStr;
    }

    /**
     * 生成条件关键字的组合字符串--------- =,like,in
     */
    function generKeyJoinFun(key,fieldPara,fieldStr){
        var objName=getSqlParamName();
        key=key.toUpperCase();
        var keyJoinStr="";
        if(key=="="){
            keyJoinStr="= #{"+objName+fieldPara+"}";
        }else if(key=="LIKE"){
            keyJoinStr="LIKE concat(concat('%',#{"+objName+fieldPara+"}),'%')";
        }else if(key=="IN"){
            //keyJoinStr="IN :"+fieldPara;
            keyJoinStr="IN \n\t<foreach item=\""+fieldPara+"\" index=\"index\" " +
                "collection=\"" +objName+fieldPara+"List\" " +
                "open=\"(\" separator=\",\" close=\")\">\n\t\t#{"+fieldPara+"}\n\t</foreach>";
        }else if(key=="LOCATE"){
            keyJoinStr="LOCATE (#{"+objName+fieldPara+"},"+fieldStr+")";
        }else if(key=="STARTEND"){
            keyJoinStr="BETWEEN #{"+objName+fieldPara+"Start} and #{"+objName+fieldPara+"End}";
        }else{
            keyJoinStr=rtrim(key)+"#{"+objName+fieldPara+"}";
        }
        return keyJoinStr;
    }

    /**
     * 批量插入处理
     */
    function batchInsert(insertSql){
        var fieldStartIndex=insertSql.indexOf("(");
        var fieldEndIndex=insertSql.indexOf(")");
        var fields=insertSql.substring(fieldStartIndex+1,fieldEndIndex);
        fields=fields .replace(/\s+/g,"");
        var fieldArr=fields.split(",");
        var itemStr="";
        var sqlParamName=getSqlParamName();
        for(var i in fieldArr){
            itemStr+="#{"+sqlParamName+fieldToBeanParamName(fieldArr[i])+"},";
        }
        if(itemStr.length>0){
            itemStr=itemStr.substring(0,itemStr.length-1);
        }
        var valuesStrIndex=insertSql.indexOf("(",fieldEndIndex+1);
        var buildSql=insertSql.substring(0,valuesStrIndex);
        buildSql+="\n<foreach collection =\"list\" item=\"item\" separator =\",\">\n" +
            "\t("+itemStr+")\n" +
            "</foreach >"
        $("#mybatisText").val(buildSql);
    }

    /**
     * 更新处理
     */
    function batcbUpdate(sqlStr){
        var setIndx=sqlStr.indexOf("set ");
        var whereIndx=sqlStr.indexOf("where");
        var setBeforeSqlStr=sqlStr.substring(0,setIndx);
        var whereAfterSqlStr=sqlStr.substring(whereIndx);
        var updateField=sqlStr.substring(setIndx+"set ".length,whereIndx);
        var reg=/ *, */g;
        updateField=replaceReg(updateField,reg,",");
        reg=/ *\. */g;
        updateField=replaceReg(updateField,reg,".");
        var updateFieldArr=updateField.split(",");
        var updateSqlStr=setBeforeSqlStr+="\n<set>";
        var sqlParamName=getSqlParamName();
        for(var i in updateFieldArr){
            var fieldParaStr=updateFieldArr[i];
            var equalIndx=fieldParaStr.indexOf("=");
            fieldParaStr=fieldParaStr.substring(0,equalIndx);
            var beanParamStr=fieldToBeanParamName(fieldParaStr);
            updateSqlStr += "\n" + "<if test=\"" +sqlParamName+ beanParamStr + "!=null";
            if(checkFieldType(fieldParaStr)=="String"){
                updateSqlStr +=" and "+sqlParamName+beanParamStr+"!=''\">";
            }else{
                updateSqlStr+=">";
            }
            updateSqlStr+="\n"+fieldParaStr+generKeyJoinFun("=",beanParamStr)+",";
            updateSqlStr+="\n</if>";
        }
        updateSqlStr+="\n</set>\n"+whereAfterSqlStr;
        console.log("批量更新SQL："+updateSqlStr);
        return updateSqlStr;
    }

    /**
     * 拼接字段----字段名转为实体属性名
     */
    function fieldToBeanParamName(fieldStr){
        var fieldParaStr = "";
        if (fieldStr.indexOf("_") > -1) {
            var fieldStrArr = fieldStr.split("_");
            var fieldJoinStr = "";
            for (var i in fieldStrArr) {
                if (i == 0) {
                    fieldJoinStr = fieldStrArr[i].toLowerCase();
                } else {
                    var tempStr = fieldStrArr[i].toLowerCase();
                    var firstLetStr = tempStr.substring(0, 1).toUpperCase();
                    var afterLetStr = tempStr.substring(1);
                    fieldJoinStr += firstLetStr + afterLetStr;
                }
            }
            fieldParaStr = fieldJoinStr;
        } else {
            fieldParaStr = fieldStr.toLowerCase();
        }
        var dotIndex = fieldParaStr.indexOf(".");
        if (dotIndex > -1) {//使用别名的情况---剔除别名
            fieldParaStr = fieldParaStr.substring(dotIndex + 1);
        }
        return fieldParaStr;
    }

    /**
     * 输出where条件实体类
     */
    function generWhereBean(mapKeysStr){
        if(mapKeysStr.length>0){
            mapKeysStr=mapKeysStr.substring(0,mapKeysStr.length-1);
            var keyArr=mapKeysStr.split(",");
            var printStr="@Data<br/>public class "+getWhereClassName()+" implements Serializable {<br/>";
            for(var i=0;i<keyArr.length;i++){
                //printStr=printStr+"paraMap.put(\""+keyArr[i]+"\","+keyArr[i]+");<br/>";
                var fieldStr=keyArr[i].toLowerCase();
                printStr+="&nbsp;&nbsp;&nbsp;&nbsp;private ";
                printStr+=checkFieldType(fieldStr)+" ";
                printStr+=fieldStr+";<br/>";
            }
            printStr+="}";
            $("#whereBean").html(printStr);
        }
    }

    /**
     * 输出查询结果集实体类
     */
    function generBean(sqlStr){
        var fromIndx=sqlStr.indexOf("from");
        var colArrStr=sqlStr.substring("select".length,fromIndx);
        var reg=/ *, */g;
        colArrStr=replaceReg(colArrStr,reg,",");
        reg=/ *\. */g;
        colArrStr=replaceReg(colArrStr,reg,".");
        if(colArrStr.indexOf("*")>0)
            return;
        var colArr=colArrStr.split(",");
        var beanStr="@Data<br/>public class "+getResultClassName()+" implements Serializable {<br/>";
        var fieldStr="";
        for(var i in colArr){
            var colStr=colArr[i];
            var asIndx=colStr.toUpperCase().indexOf(" AS ");
            if(asIndx>0){
                fieldStr=colStr.substring(asIndx+3);
            }else if(colStr.indexOf("_")==-1){
                var dotIndx=colStr.indexOf(".");
                if(dotIndx>0){
                    fieldStr=colStr.substring(dotIndx+1);
                }else{
                    fieldStr=colStr;
                }
            }
            var fieldType=checkFieldType(fieldStr);
            beanStr+="&nbsp;&nbsp;&nbsp;&nbsp;private "+fieldType+" "+trim(fieldStr)+";<br/>";
        }
        beanStr+="}";
        $("#resultBean").html(beanStr);
        console.log("生成的实体类："+beanStr);
    }

    /**
     * mybatis转SQL按钮单击事件
    */
    $("#toSqlBtn").click(function(){
        var mybatisSql=$("#mybatisSqlText").val();
        var sqlParamVal=$("#mybatisParamVals").val();
        mybatisToSql(mybatisSql,sqlParamVal);
    });

    /**
     * mybatis转SQL处理函数
     */
    function mybatisToSql(mybatisSql,sqlParamVal){
        var mybatisSqlParamIndx=mybatisSql.indexOf("==> Parameters");
        if(mybatisSqlParamIndx>0){
            sqlParamVal=mybatisSql.substring(mybatisSqlParamIndx);
            mybatisSql=mybatisSql.substring(0,mybatisSqlParamIndx);
        }
        var sqlColonIndx=mybatisSql.indexOf(":");
        var paramColonIndx=sqlParamVal.indexOf(":");
        var sqlStr=mybatisSql;
        var sqlParamVal=sqlParamVal;
        if(sqlColonIndx>-1){
            sqlStr=mybatisSql.substring(sqlColonIndx+1);
        }
        if(paramColonIndx>-1){
            sqlParamVal=sqlParamVal.substring(paramColonIndx+1);
        }
        var reg=/\?/g;
        var result=sqlStr.match(reg);
        if(result){
            var sqlParamValArr=sqlParamVal.split(",");
            for(var i in result){
                var paramMapVal=trim(sqlParamValArr[i]);
                var paramTypeStr=checkSqlParamType(paramMapVal);
                var paramTypeArr=paramTypeStr.split(",");
                var paramVal=paramTypeArr[0];
                var paramType=paramTypeArr[1];
                if(paramType=="'"){
                    sqlStr=sqlStr.replace(result[i],"'"+paramVal+"'");
                }else{
                    sqlStr=sqlStr.replace(result[i],paramTypeArr[0]);
                }
            }
        }
        $("#realSqlText").val(trim(sqlStr));
        console.log("mybatis转SQL："+sqlStr);
    }

    /**
     * 调用函数语句的生成
     * @param mapKeysStr
     * @returns {string}
     */
    function generMethod(mapKeysStr){
        var selectId=$("#sqlId").val();
        var javaParamName=$("#sqlParaName").val();
        var methodContent="public "+getResultClassName()+" "+selectId+"(";
        if(javaParamName){
            methodContent+="@Param(\""+javaParamName+"\") "+getWhereClassName()+" "+javaParamName+");";;
        }else{
            if(mapKeysStr.length>0){
                mapKeysStr=mapKeysStr.substring(0,mapKeysStr.length-1);
                var keyArr=mapKeysStr.split(",");
                var methodParamStr="";
                for(var i=0;i<keyArr.length;i++){
                    var fieldStr=keyArr[i].toLowerCase();
                    methodParamStr+="@Param(\""+fieldStr+"\") ";
                    methodParamStr+=checkFieldType(fieldStr)+" ";
                    methodParamStr+=fieldStr+",";
                }
                if(methodParamStr.length>0){
                    methodParamStr=methodParamStr.substring(0,methodParamStr.length-1);
                }
                methodContent+=methodParamStr+")";
            }
        }
        $("#callMethod").html(methodContent);
        console.log("调用方法体："+methodContent);
        return methodContent;
    }

    /**
     * 根据规则判断字段类型
     * @param fieldStr
     * @returns {string}
     */
    function checkFieldType(fieldStr){
        var typeStr="";
        if(fieldStr=="id"||fieldStr.indexOf("_id")>0){
            typeStr="Long";
        }else if(fieldStr.indexOf("status")>0){
            typeStr="Byte";
        }else if(fieldStr.indexOf("created")>0){
            typeStr="Long";
        }else{
            typeStr="String"
        }
        return typeStr;
    }

    /**
     * 参数对象名
     * @returns {*|void}
     */
    function getSqlParamName(){
        var sqlParamName=$("#sqlParaName").val();
        if(sqlParamName.length>0){
            sqlParamName+=".";
        }else{
            sqlParamName="";
        }
        return sqlParamName;
    }

    /**
     * 清除字符串头尾空格
     * @param str
     * @returns {string | void}
     */
    var trim=function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    };

    /**
     * 删除右边的空格
     * @param str
     * @returns {string | void}
     */
    function rtrim(str){
        return str.replace(/(\s*$)/g,"");
    }

    /**
     * 替换函数
     * @param str
     * @param oldStr
     * @param repStr
     * @returns {string | void}
     */
    var replaceAll=function(str,oldStr,repStr){
        var reg=new RegExp(oldStr,"g");
        return str.replace(reg,repStr);
    }

    /**
     * 正则替换函数
     * @param str
     * @param reg
     * @param repStr
     * @returns {string | void}
     */
    var replaceReg=function(str,reg,repStr){
        return str.replace(reg,repStr);
    }

    /**
     * 多个空格替换为一个空格
     * @param str
     * @returns {string | void}
     */
    var muliSpaceToOne=function(str){
        var reg = /\s+/g;
        return str.replace(reg,' ');
    }

    /**
     * 结果集类的类名生成
     * @returns {string}
     */
    var getResultClassName=function(){
        return "ResultBeanTemplate";
    }

    /**
     * where条件类的类名生成
     * @returns {string}
     */
    var getWhereClassName=function(){
        return "WhereBeanTemplate";
    }


    /**
     * 类型判断
     * @param paramMapVal
     * @returns {string}
     */
    function checkSqlParamType(paramMapVal){
        var leftBracketsIndx=paramMapVal.lastIndexOf("(");
        var paramType="'";
        var paramVal=paramMapVal;
        if(leftBracketsIndx>0){
            var paramMapType=paramMapVal.substring(leftBracketsIndx+1,paramMapVal.length-1);
            paramVal=paramMapVal.substring(0,leftBracketsIndx);
            if(paramMapType=="String"){
                paramType="'";
            }else if(paramMapType=="Long"||paramMapType=="Boolean"||paramMapType=="Byte"){
                paramType="";
            }
        }
        return paramVal+","+paramType;
    }
});