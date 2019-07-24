package com.zyy.scannerui.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.zyy.scannerui.model.param.ControllerParamVO;
import com.zyy.scannerui.model.param.MethodParamVO;

/**
 * @Author zhangyy
 * @DateTime 2019-07-23 13:42
 * @Description
 */
public class HttpUtils {

    private static Integer TIME_OUT=10000;

    public static final Integer CLASS_FLAG=0;
    public static final Integer CONTROLLER_FLAG=1;
    public static final Integer METHOD_FLAG=2;

    public static <T> String post(String url,String param){
        CloseableHttpClient httpClient=HttpClients.createDefault();
        HttpPost httpPost=new HttpPost(url);
        httpPost.setConfig(RequestConfig.custom().setConnectTimeout(TIME_OUT).setConnectionRequestTimeout(TIME_OUT).setSocketTimeout(TIME_OUT).build());
        httpPost.setHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        StringEntity stringEntity=new StringEntity(param, ContentType.APPLICATION_FORM_URLENCODED);
        stringEntity.setContentEncoding("utf-8");
        httpPost.setEntity(stringEntity);
        CloseableHttpResponse response=null;
        String result="";
        try{
            response= httpClient.execute(httpPost);
            if(response.getStatusLine().getStatusCode()== 200){
                result=EntityUtils.toString(response.getEntity(),"utf-8");
            }
        }catch(Exception e){

        }finally {
            try{
                response.close();
            }catch(Exception e){

            }
        }
        return result;
    }

    /**
     * post参数组装
     * @param param
     * @param <T>
     * @return
     */
    public static <T> String buildParam(T param,Integer flag){
        String paramStr="";
        if(flag.equals(CONTROLLER_FLAG)){
            ControllerParamVO controllerParam=(ControllerParamVO) param;
            paramStr="classPath="+controllerParam.getClassPath();
        }else if(flag.equals(METHOD_FLAG)){
            MethodParamVO methodParam=(MethodParamVO) param;
            paramStr="methodUrl="+methodParam.getMethodUrl();
        }
        return paramStr;
    }
}
