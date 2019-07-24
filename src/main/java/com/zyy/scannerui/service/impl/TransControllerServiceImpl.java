package com.zyy.scannerui.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.zyy.scannerui.model.ControllerMethodVO;
import com.zyy.scannerui.model.PageInitVO;
import com.zyy.scannerui.model.TransParamVO;
import com.zyy.scannerui.model.param.ControllerMethodParamVO;
import com.zyy.scannerui.model.param.ControllerParamVO;
import com.zyy.scannerui.model.param.MethodParamVO;
import com.zyy.scannerui.service.ITransControllerService;
import com.zyy.scannerui.util.HttpUtils;
import com.zyy.scannerui.util.JSONUtils;

/**
 * @Author zhangyy
 * @DateTime 2019-07-23 11:56
 * @Description 路径转换
 */
@Service
public class TransControllerServiceImpl implements ITransControllerService {

    @Override public PageInitVO getController(TransParamVO transParam) throws Exception{
        return getClientData(transParam,PageInitVO.class,"/scanner/getController",HttpUtils.CLASS_FLAG);
    }

    @Override public List<ControllerMethodVO> getControllerMethod(ControllerParamVO controllerParam) throws Exception{
        return getClientListData(controllerParam,ControllerMethodVO.class,"/scanner/getControllerMethod",HttpUtils.CONTROLLER_FLAG);
    }

    @Override public ControllerMethodParamVO getMethodParam(MethodParamVO methodParam) throws Exception{
        return getClientData(methodParam,ControllerMethodParamVO.class,"/scanner/getMethodParam",HttpUtils.METHOD_FLAG);
    }

    /**
     * 实体类方式
     * @param param
     * @param returnClazz
     * @param <T>
     * @param <K>
     * @return
     */
    private <T,K> K getClientData(T param,Class returnClazz,String controllerUrl,Integer flag){
        String result=getClientData(param,controllerUrl,flag);
        if(StringUtils.isEmpty(result)){
            return null;
        }else{
            return JSONUtils.parse(result,returnClazz);
        }
    }

    /**
     * List方式
     * @param param
     * @param returnClazz
     * @param <T>
     * @param <K>
     * @return
     */
    private <T,K> List<K> getClientListData(T param,Class returnClazz,String controllerUrl,Integer flag){
        String result=getClientData(param,controllerUrl,flag);
        if(StringUtils.isEmpty(result)){
            return null;
        }else{
            return JSONUtils.toList(result,returnClazz);
        }
    }

    /**
     * 公用处理方法
     * @param param
     * @param <T>
     * @return
     */
    private <T> String getClientData(T param,String controllerUrl,Integer flag){
        TransParamVO transParam=(TransParamVO) param;
        String ip=transParam.getIp();
        String port=transParam.getPort();
        String url="http://"+ip+":"+port+controllerUrl;
        String paramJson=HttpUtils.buildParam(param,flag);
        String result=HttpUtils.post(url,paramJson);
        return result;
    }
}
