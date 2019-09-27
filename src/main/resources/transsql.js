layui.use(['layer', 'element'],function() {
    var layer = layui.layer,
        $ = layui.$,
        element = layui.element;

    var replaceDateJson={};
    var dateIdentStr="@@@";
    var datePlaceholder="use@date@placeholder";
    var mapKeys;
    var betweenAlias="BETWAND";
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
        replaceDateJson={};
        str=replaceDate(str);
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
        //reg=/\s+(\s*)in(.*?)\((.*?)\)\s+/ig;
        //reg=/\s+in\s+/ig;
        reg=/\s+in\s+\((.*?)\)/ig;
        str=replaceSpecial(str,reg,' in ?')
        console.log("替换IN后的SQL："+str);
        mapKeys="";
        $("#beanDiv").css("display","block");
        var whereStr=str;
        whereStr=trim(whereStr);
        whereStr=whereStr.replace(/' *\? *'/g,"?");//清除有单引号的情况
        whereStr=whereStr.replace(/' *\?/g,"?");
        whereStr=whereStr.replace(/\? *'/g,"?");
        //update特殊处理
        var updateFlag=false;
        var deleteFlag=false;
        if(whereStr.toUpperCase().search(/\s*UPDATE/i)==0){
            whereStr=batchUpdate(whereStr);
            updateFlag=true;
            $("#resultBean").html("");
        }
        if(whereStr.toUpperCase().search(/\s*DELETE/i)==0){
            deleteFlag=true;
            $("#resultBean").html("");
        }
        if(updateFlag==false&&deleteFlag==false){
            generBean(str);
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
            var queAfterStr=afterStr.substring(queIndex+1);
            var queAfterFirstSpaceIndex=queAfterStr.search(/\s+/i);
            if(queAfterFirstSpaceIndex>-1){
                queIndex=queIndex+queAfterFirstSpaceIndex;
            }else{
                queAfterFirstSpaceIndex=queAfterStr.indexOf(")");
                if(queAfterFirstSpaceIndex>-1){
                    queIndex=queIndex+queAfterFirstSpaceIndex+1;
                }
            }
            var beforeStr=afterStr.substring(0,queIndex+1);
            beforeStr=replaceFun(beforeStr);
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
        var resultTypeStr=" resultType=\"beanTemplate\"";
        var methodReturnTypeVoidFlag=false;
        if(updateFlag){
            sqlBeforeFlagStr="<update";
            sqlAfterFlagStr="</update>";
            resultTypeStr="";
            methodReturnTypeVoidFlag=true;
        }else if(deleteFlag){
            sqlBeforeFlagStr="<delete";
            sqlAfterFlagStr="</delete>";
            resultTypeStr="";
            methodReturnTypeVoidFlag=true;
        }else{
            sqlBeforeFlagStr="<select";
            sqlAfterFlagStr="</select>";
        }
        sqlStr=sqlBeforeFlagStr+" id=\""+$("#sqlId").val()+"\""+resultTypeStr+">\n"+sqlStr+"\n"+sqlAfterFlagStr;
        sqlStr=dateRestore(sqlStr);
        $("#mybatisText").val(sqlStr);
        generWhereBean(mapKeys);
        generMethod(mapKeys,methodReturnTypeVoidFlag);
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
        whereStr=replaceBetweenOption(whereStr,reg);
        reg=/between(.*?)and\s+(.*?)\?(.*?)\s*/ig;
        whereStr=replaceBetweenOption(whereStr,reg);
        return whereStr;
    }

    /**
     * 替换between具体处理函数
     * @param whereStr
     * @param reg
     * @returns {*}
     */
    function replaceBetweenOption(whereStr,reg){
        var result=whereStr.match(reg);
        var betweenStr="between ";
        var andStr=" and "
        if(result){
            for(var i in result){
                var matchStr=result[i];
                var tempStr=matchStr.toLowerCase();
                var andIndex=tempStr.indexOf(andStr);
                var betweenIndex=tempStr.indexOf(betweenStr);
                var betweenWhereStr=trim(matchStr.substring(betweenIndex+betweenStr.length,andIndex));
                var betweenReplaceStr=betweenAlias+" "+betweenWhereStr+" ";
                whereStr=whereStr.replace(matchStr,betweenReplaceStr);
            }
        }
        return whereStr;
    }

    /**
     * date_format、FROM_UNIXTIME和str_to_date特殊处理
     */
    function replaceDate(sqlStr){
        var sqlStr=nowTrans(sqlStr);
        var reg=/date_format\s*\((.*?)\)/ig;
        var result=sqlStr.match(reg);
        sqlStr=replaceDateJsonBuild(sqlStr,result);
        reg=/from_unixtime\s*\((.*?)\)/ig;
        result=sqlStr.match(reg);
        sqlStr=replaceDateJsonBuild(sqlStr,result);
        reg=/str_to_date\s*\((.*?)\)/ig;
        result=sqlStr.match(reg);
        sqlStr=replaceDateJsonBuild(sqlStr,result);
        return sqlStr;
    }

    /**
     * 替换日期字符和替换JSON记录
     * @param sqlStr
     * @param result
     * @param typeStr
     * @returns {*}
     */
    function replaceDateJsonBuild(sqlStr,result){
        if(result){
            var baseCode=97;
            for(var i in result){
                var curCode=baseCode++;
                var curChar=String.fromCharCode(curCode);
                var matchStr=result[i];
                var leftBrackets=matchStr.indexOf("(");
                var rightBrackets=matchStr.indexOf(")");
                matchStr=matchStr.substring(leftBrackets+1,rightBrackets);
                var fieldStr=matchStr;
                var dotIndex=fieldStr.indexOf(",");
                fieldStr=fieldStr.substring(0,dotIndex);
                var tempReg=/\s*1000/ig;
                fieldStr=replaceReg(fieldStr,tempReg,"");
                fieldStr=fieldStr.replace("/","");
                fieldStr=trim(fieldStr);
                if(isDate(fieldStr)){
                    fieldStr=datePlaceholder;
                    matchStr=matchStr.substring(dotIndex+1);
                }
                var replaceStr=fieldStr+dateIdentStr+curChar;
                sqlStr=sqlStr.replace(matchStr,replaceStr);
                replaceDateJson[replaceStr]=matchStr;
            }
        }
        return sqlStr;
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
     * 日期处理替换为原来的字符
     */
    function dateRestore(sqlStr){
        for(var key in replaceDateJson){
            var keyIndex=sqlStr.indexOf(key);
            //sqlStr=sqlStr.replace(key,replaceDateJson[key]);
            sqlStr=replaceAll(sqlStr,key,replaceDateJson[key]);
        }
        sqlStr=replaceAll(sqlStr,"now_brackets","now()");
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
                whereStr=whereStr.replace(matchStr,replaceStr);
            }
        }
        return whereStr;
    }

    /**
     * 替换SQL条件标识符
     */
    function replaceFun(sqlWhereStageStr) {
        var beforeStr = rtrim(sqlWhereStageStr);
        beforeStr = spaceOptFun(beforeStr);
        var firstSpaceLastInd = beforeStr.lastIndexOf(" ");
        //var sqlKeyStr = trim(beforeStr.substring(firstSpaceLastInd));
        var sqlKeyStr=cutOutRelationOperator(beforeStr);
        beforeStr = rtrim(beforeStr.substring(0, firstSpaceLastInd));//SQL关键字(=,like,in等)前的所有字符串。
        var secondSpaceLastInd = beforeStr.lastIndexOf(" ");
        //var fieldStr = trim(beforeStr.substring(secondSpaceLastInd));
        var cutOutJson=cutOutFieldNameAndCondiKey(beforeStr);
        var fieldStr=cutOutJson.fieldName;
        beforeStr = rtrim(beforeStr.substring(0, secondSpaceLastInd));//字段前的所有字符串。
        //firstSpaceLastInd = beforeStr.lastIndexOf(" ");
        //var sqlCondKeyStr = trim(beforeStr.substring(firstSpaceLastInd));
        var sqlCondKeyStr=cutOutJson.condiKey;
        //beforeStr = rtrim(beforeStr.substring(0, firstSpaceLastInd));//SQL关键字(and,or等)前的所有字符串。
        beforeStr=rtrim(beforeStr.substring(0,cutOutJson.condiIndex));
        var whereStageStr=sqlWhereStageStr.substring(cutOutJson.condiIndex);
        fieldStr=restoreDateFieldName(fieldStr);
        var fieldParaStr= fieldToBeanParamName(fieldStr);
        var objName=getSqlParamName();
        if(sqlKeyStr.toUpperCase()=="IN"){
            beforeStr += "\n" + "<if test=\"" + objName+fieldParaStr + "List !=null";
            beforeStr+=" and "+objName+fieldParaStr+"List.size()>0";
            beforeStr+="\">";
        }else if(sqlKeyStr.toUpperCase()==betweenAlias){
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
        beforeStr += "\n" + "	" + " ";
        beforeStr+=" " + generKeyJoinFun(sqlKeyStr, fieldParaStr,whereStageStr) + "\n</if>";
        if(sqlKeyStr.toUpperCase()=="IN"){
            mapKeys=mapKeys+fieldParaStr+"List,";
        }else if(sqlKeyStr.toUpperCase()==betweenAlias){
            mapKeys=mapKeys+fieldParaStr+"Start,"+fieldParaStr+"End,";
        }else{
            mapKeys = mapKeys + fieldParaStr + ",";
        }
        return beforeStr;
    }

    /**
     * 判断字段名是否在replaceDateJson中，在该JSON中还原为原来的字段名
     */
    function restoreDateFieldName(fieldParaStr){
        var restoreFieldName=fieldParaStr;
        for(var key in replaceDateJson){
            if(fieldParaStr.toUpperCase()==key.toUpperCase()){
                var identIndex=key.indexOf(dateIdentStr);
                if(identIndex>0){
                    restoreFieldName=key.substring(0,identIndex);
                    if(restoreFieldName.substring(restoreFieldName.length-1)=="/"){
                        restoreFieldName=restoreFieldName.substring(0,restoreFieldName.length-1);
                    }
                }
                break;
            }
        }
        return restoreFieldName;
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
            var optIndex=splitStr.indexOf(tempStr);
            if ( optIndex> -1) {
                var splitCondLen = splitStr.length - tempStr.length;
                var sqlCondStr = splitStr.substr(optIndex-1,1);
                if (" " != sqlCondStr) {//不存在空格
                    splitStr = splitStr.substring(0, optIndex) + " " + tempStr;
                }
                break;
            }
        }
        checkStr = condBeforeStr + splitStr;
        return checkStr;
    }

    /**
     * 截取语句中的字段名
     * @param str
     */
    function cutOutFieldNameAndCondiKey(str){
        var returnJson={};
        var matchStrArr=["and ","or "];
        var lowerStr=str.toLowerCase();
        var matchIndexArr=[];
        for(var i in matchStrArr){
            var index=lowerStr.lastIndexOf(matchStrArr[i]);
            matchIndexArr.push(index);
        }
        var bigVal=0;
        var bigMatchStr="";
        for(var i in matchIndexArr){
            if(bigVal<matchIndexArr[i]){
                bigVal=matchIndexArr[i];
                bigMatchStr=matchStrArr[i];
            }
        }
        var matchAfterStr=trim(str.substring(bigVal+bigMatchStr.length));
        var firstSpaceIndex=matchAfterStr.indexOf(" ");
        var fieldName;
        if(firstSpaceIndex==-1){
            firstSpaceIndex=matchAfterStr.length;
        }
        var matchFieldStr=matchAfterStr.substring(0,firstSpaceIndex);
        var reg=/date_format\s*\((.*?)\)/ig;
        fieldName=cutOutDateFieldName(matchFieldStr,reg);
        if(fieldName==""){
            reg=/from_unixtime\s*\((.*?)\)/ig;
            fieldName=cutOutDateFieldName(matchFieldStr,reg);
        }
        if(fieldName==""){
            reg=/str_to_date\s*\((.*?)\)/ig;
            fieldName=cutOutDateFieldName(matchFieldStr,reg);
        }
        if(fieldName==""){
            fieldName=matchFieldStr;
        }
        returnJson.fieldName=fieldName;
        returnJson.condiKey=trim(bigMatchStr);
        returnJson.condiIndex=bigVal;
        return returnJson;
    }

    /**
     * 截取日期字段名
     * @param str
     */
    function cutOutDateFieldName(str,reg){
        var result=str.match(reg);
        var dateFieldStr="";
        if(result){
            var leftBrackets=str.indexOf("(");
            var dateIdentIndex=str.indexOf(dateIdentStr);
            dateFieldStr=str.substring(leftBrackets+1,dateIdentIndex);
        }
        return dateFieldStr;
    }

    /**
     * 截取关系运算符
     * @param str
     * @returns {number}
     */
    function cutOutRelationOperator(str){
        var matchStrArr=[" >="," <="," ="," !="," >"," <"," like"," not in"," in"," locate"," "+betweenAlias];
        var lowerStr=str.toLowerCase();
        var operatorStr="";
        for(var i in matchStrArr){
            var operatorIndex=lowerStr.lastIndexOf(matchStrArr[i].toLowerCase());
            if(operatorIndex>0){
                operatorStr=trim(matchStrArr[i]);
                break;
            }
        }
        return operatorStr;
    }


    /**
     * 生成条件关键字的组合字符串--------- =,like,in
     */
    function generKeyJoinFun(key,fieldPara,whereStageStr){
        var objName=getSqlParamName();
        key=key.toUpperCase();
        whereStageStr=enterToSpace(whereStageStr);
        whereStageStr=muliSpaceToOne(whereStageStr);
        var keyJoinStr="";
        var generJoinStr="#{"+objName+fieldPara+"}";
        if(key=="LIKE"){
            keyJoinStr="LIKE concat(concat('%',#{"+objName+fieldPara+"}),'%')";
        }else if(key=="IN"||key=="NOT IN"){
            //keyJoinStr="IN :"+fieldPara;
            generJoinStr="\n\t<foreach item=\""+fieldPara+"\" index=\"index\" " +
                "collection=\"" +objName+fieldPara+"List\" " +
                "open=\"(\" separator=\",\" close=\")\">\n\t\t#{"+fieldPara+"}\n\t</foreach>";
            keyJoinStr=whereStageStr.replace("?",generJoinStr);
        }else if(key==betweenAlias){
            var betweenIndex=whereStageStr.search(/betwand/i);
            var betweenWhereStr=whereStageStr.substring(betweenIndex+betweenAlias.length);
            var replaceBetweenBeforeWhereStr=betweenWhereStr.replace("?","#{"+objName+fieldPara+"Start}");
            var replaceBetweenAfterWhereStr=betweenWhereStr.replace("?","#{"+objName+fieldPara+"End}");
            generJoinStr=replaceBetweenBeforeWhereStr+" and "+replaceBetweenAfterWhereStr;
            var betweenWhereBeforeStr=whereStageStr.substring(0,betweenIndex+betweenAlias.length);
            betweenWhereBeforeStr=betweenWhereBeforeStr.replace(betweenAlias,"BETWEEN");
            generJoinStr=betweenWhereBeforeStr+" "+generJoinStr;
            keyJoinStr=generJoinStr;
        }else{
            keyJoinStr=(whereStageStr.replace("?",generJoinStr));
        }
        return keyJoinStr;
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
                var fieldStr=keyArr[i];//.toLowerCase();
                printStr+="&nbsp;&nbsp;&nbsp;&nbsp;private ";
                printStr+=checkFieldType(fieldStr)+" ";
                printStr+=fieldStr+";<br/>";
            }
            printStr+="}";
            $("#whereBean").html(printStr);
            $("#whereBean").show();
        }
    }

    /**
     * 输出查询结果集实体类
     */
    function generBean(sqlStr){
        sqlStr=replaceAll(sqlStr," from "," FROM ");
        sqlStr=replaceAll(sqlStr,"select ","SELECT ");
        var fromIndx=sqlStr.search(/\s+from\s+/i);
        var colArrStr=sqlStr.substring("SELECT".length,fromIndx);
        var reg=/ *, */g;
        colArrStr=replaceReg(colArrStr,reg,",");
        reg=/ *\. */g;
        colArrStr=replaceReg(colArrStr,reg,".");
        if(trim(colArrStr)=="*"){
            $("#resultBean").html("");
            return;
        }
        var reg=/now\s*\((.*?)\)/ig;
        var result=colArrStr.match(reg);
        if(result){
            for(var i in result){
                colArrStr=colArrStr.replace(result[i],"now");
            }
        }
        var  reg=/date_format\s*\((.*?)\)/ig;
        var result=colArrStr.match(reg);
        if(result){
            for(var i in result){
                var dotIndex=result[i].indexOf(dateIdentStr);
                var leftBrackets=result[i].indexOf("(");
                var fieldName=trim(result[i].substring(leftBrackets+1,dotIndex));
                colArrStr=colArrStr.replace(result[i],fieldName);
            }
        }
        var colArr=colArrStr.split(",");
        var beanStr="@Data<br/>public class "+getResultClassName()+" implements Serializable {<br/>";
        var fieldStr="";
        for(var i in colArr){
            var colStr=trim(colArr[i]);
            var asIndx=colStr.toUpperCase().indexOf(" AS ");
            var spaceIndx=colStr.toUpperCase().indexOf(" ");
            if(asIndx>0){
                fieldStr=colStr.substring(asIndx+3);
            }else if(spaceIndx>0){
                fieldStr=colStr.substring(spaceIndx+1);
            }else{
                fieldStr=fieldToBeanParamName(colStr);
            }
            var fieldType=checkFieldType(fieldStr);
            beanStr+="&nbsp;&nbsp;&nbsp;&nbsp;private "+fieldType+" "+trim(fieldStr)+";<br/>";
        }
        beanStr+="}";
        $("#resultBean").html(beanStr);
        $("#resultBean").show();
        console.log("生成的实体类："+beanStr);
    }

    /**
     * 调用函数语句的生成
     * @param mapKeysStr
     * @returns {string}
     */
    function generMethod(mapKeysStr,voidFlag){
        var selectId=$("#sqlId").val();
        var javaParamName=$("#sqlParaName").val();
        var methodContent=getResultClassName(voidFlag)+" "+selectId+"(";
        if(javaParamName){
            var nameJson=getParamName();
            var objName=nameJson.objName;
            var className=nameJson.className;
            methodContent+="@Param(\""+objName+"\") "+className+" "+objName+");";
        }else{
            if(mapKeysStr.length>0){
                mapKeysStr=mapKeysStr.substring(0,mapKeysStr.length-1);
                var keyArr=mapKeysStr.split(",");
                var methodParamStr="";
                for(var i=0;i<keyArr.length;i++){
                    var fieldStr=keyArr[i];//.toLowerCase();
                    methodParamStr+="@Param(\""+fieldStr+"\") ";
                    methodParamStr+=checkFieldType(fieldStr)+" ";
                    methodParamStr+=fieldStr+",";
                }
                if(methodParamStr.length>0){
                    methodParamStr=methodParamStr.substring(0,methodParamStr.length-1);
                }
                methodContent+=methodParamStr+");";
            }
        }
        $("#callMethod").html(methodContent);
        $("#callMethod").show();
        console.log("调用方法体："+methodContent);
        return methodContent;
    }

    /**
     * insert方法调用生成
     */
    function generMethodByInsert(){
        var nameJson=getParamName("insert");
        var objName=nameJson.objName;
        var className=nameJson.className;
        var selectId=$("#sqlId").val();
        var methodContent="void "+selectId+"(@Param(\""+objName+"\") List&lt;"+className+"&gt; "+objName+");";
        $("#callMethod").html(methodContent);
        $("#callMethod").show();
    }

    /**
     * 根据输入的对象名生成对象名和类名
     * @param type
     */
    function getParamName(type){
        var nameJson={};
        var objName=$("#sqlParaName").val();
        if(objName){
            objName=objName.substring(0,1).toLowerCase()+objName.substring(1);
            var className=objName;
            var itemName;
            if(type=="insert"){
                if(objName.substring(objName.length-4).toLowerCase()!="list"){
                    objName=objName+"List";
                }else{
                    objName=objName.substring(0,objName.length-4)+"List";
                    className=objName.substring(0,objName.length-4);
                }
                if(objName.substring(objName.length-6).toLowerCase()=="bolist"){
                    objName=objName.substring(0,objName.length-6)+"List";
                    className=objName.substring(0,objName.length-4);
                }
            }else{
                if(objName.substring(objName.length-2).toLowerCase()=="bo"){
                    objName=objName.substring(0,objName.length-2);
                }
            }
            if(className.substring(className.length-2).toLowerCase()!="bo"){
                className=className+"BO";
            }else{
                className=className.substring(0,className.length-2)+"BO";
            }
            itemName=className.substring(0,className.length-2);
            className=className.substring(0,1).toUpperCase()+className.substring(1);
            nameJson.objName=objName;
            nameJson.className=className;
            nameJson.itemName=itemName;
        }else{
            nameJson.objName="";
            nameJson.className="";
            nameJson.itemName="";
        }
        return nameJson;
    }

    //======================================================批量插入和批量更新处理函数===================================================
    /**
     * 批量插入处理
     */
    function batchInsert(insertSql){
        $("#beanDiv").css("display","block");
        var fieldStartIndex=insertSql.indexOf("(");
        var fieldEndIndex=insertSql.indexOf(")");
        var fields=insertSql.substring(fieldStartIndex+1,fieldEndIndex);
        fields=fields .replace(/\s+/g,"");
        var fieldArr=fields.split(",");
        var itemStr="";
        var sqlParamName=getSqlParamName();
        if(sqlParamName==""){
            alert("insert必须输入对象名！");
            return;
        }
        var nameJson=getParamName("insert");
        var objName=nameJson.objName;
        var itemName=nameJson.itemName;
        var paramKeyJoin="";
        var paramKey;
        for(var i in fieldArr){
            paramKey=fieldToBeanParamName(fieldArr[i]);
            itemStr+="#{"+itemName+"."+paramKey+"},";
            paramKeyJoin=paramKeyJoin+paramKey+",";
        }
        if(itemStr.length>0){
            itemStr=itemStr.substring(0,itemStr.length-1);
        }
        var valuesStrIndex=insertSql.indexOf("(",fieldEndIndex+1);
        var buildSql=insertSql.substring(0,valuesStrIndex);
        buildSql+="\n<foreach collection =\""+objName+"\" item=\""+itemName+"\" separator =\",\">\n" +
            "\t("+itemStr+")\n" +
            "</foreach >";
        var sqlIdVal=trim($("#sqlId").val());
        buildSql="<insert id=\""+sqlIdVal+"\">\n"+buildSql+"\n</insert>";
        $("#mybatisText").val(buildSql);
        $("#resultBean").html("");
        $("#resultBean").show();
        generWhereBean(paramKeyJoin);
        generMethodByInsert();
    }

    /**
     * 更新处理
     */
    function batchUpdate(sqlStr){
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
            updateSqlStr+="\n\t"+generKeyJoinFun("=",beanParamStr,updateFieldArr[i])+",";
            updateSqlStr+="\n</if>";
        }
        updateSqlStr+="\n</set>\n"+whereAfterSqlStr;
        console.log("批量更新SQL："+updateSqlStr);
        return updateSqlStr;
    }

    //======================================================mybatis转SQL处理函数===================================================
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

    //======================================================公用函数===================================================
    /**
     * 根据规则判断字段类型
     * @param fieldStr
     * @returns {string}
     */
    function checkFieldType(fieldStr){
        var typeStr="";
        fieldStr=fieldStr.toLowerCase();
        if(fieldStr.length>1){
            if(fieldStr=="id"||fieldStr.indexOf("_id")>0||fieldStr.substring(fieldStr.length-2)=="id"){
                typeStr="Long";
            }else if(fieldStr.substring(fieldStr.length-5)=="start"||fieldStr.substring(fieldStr.length-3)=="end"){
                typeStr="Long";
            }else if(fieldStr.substring(fieldStr.length-4)=="list"){
                var itemTypeStr=fieldStr.substring(0,fieldStr.length-4);
                itemTypeStr=checkFieldType(itemTypeStr);
                typeStr="List&lt;"+itemTypeStr+"&gt;";
            }else if(fieldStr.indexOf("status")>0||fieldStr.indexOf("type")>0){
                typeStr="Byte";
            }else if(fieldStr.indexOf("created")>0){
                typeStr="Long";
            }else if(fieldStr.substring(fieldStr.length-3)=="num"){
                typeStr="Long";
            }else if(fieldStr.substring(fieldStr.length-4)=="date"){
                typeStr="LocalDate";
            }else if(fieldStr.substring(fieldStr.length-4)=="time"){
                typeStr="LocalTime";
            }else if(fieldStr.substring(fieldStr.length-6)=="status"){
                typeStr="Byte";
            }else if(fieldStr.substring(fieldStr.length-7)=="created"||fieldStr.substring(fieldStr.length-7)=="creator"){
                typeStr="Long";
            }else{
                typeStr="String";
            }
        }else{
            typeStr="String";
        }
        return typeStr;
    }

    /**
     * now()转换为now
     */
    function nowTrans(sqlStr){
        var reg=/now\s*\((.*?)\)/ig;
        var result=sqlStr.match(reg);
        if(result){
            for(var i in result){
                sqlStr=sqlStr.replace(result[i],"now_brackets");
            }
        }
        return sqlStr;
    }

    /**
     * 参数对象名
     * @returns {*|void}
     */
    function getSqlParamName(){
        var nameJson=getParamName();
        if(nameJson.objName.length>0){
            sqlParamName=nameJson.objName+".";
        }else{
            sqlParamName="";
        }
        return sqlParamName;
    }


    /**
     * 结果集类的类名生成
     * @returns {string}
     */
    var getResultClassName=function(voidFlag){
        if(voidFlag){
            $("#bean-div").html("");
            return "void";
        }
        return "ResultBeanTemplate";
    }

    /**
     * where条件类的类名生成
     * @returns {string}
     */
    var getWhereClassName=function(){
        var nameJson=getParamName();
        if(nameJson.className.length>0){
            return nameJson.className;
        }
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

    //======================================================工具函数===================================================
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
        if(str){
            var reg = /\s+/g;
            return str.replace(reg,' ');
        }
        return str;
    }

    /**
     * 判断日期字符串是否为日期格式
     * @param dateStr
     * @returns {boolean}
     * @constructor
     */
    function isDate(dateStr) {
        var date = dateStr;
        date=replaceAll(date,"'","");
        if(isNaN(date)&&!isNaN(Date.parse(date))){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 换行符转换为空格
     * @param str
     */
    function enterToSpace(str){
        if(str){
            str = str.replace(/\r\n/g," ");
            str = str.replace(/\n/g," ");
            str = str.replace(/\t/g," ");
        }
        return str;
    }
});