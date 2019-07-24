package com.zyy.scannerui.service;

import java.util.List;

import com.zyy.scannerui.model.ControllerMethodVO;
import com.zyy.scannerui.model.PageInitVO;
import com.zyy.scannerui.model.TransParamVO;
import com.zyy.scannerui.model.param.ControllerMethodParamVO;
import com.zyy.scannerui.model.param.ControllerParamVO;
import com.zyy.scannerui.model.param.MethodParamVO;

/**
 * @Author zhangyy
 * @DateTime 2019-07-23 11:51
 * @Description
 */
public interface ITransControllerService {

    /**
     * controller扫描
     * @return
     */
    PageInitVO getController(TransParamVO transParam) throws Exception;

    /**
     * 获取方法
     * @param controllerParam
     * @return
     * @throws Exception
     */
    List<ControllerMethodVO> getControllerMethod(ControllerParamVO controllerParam) throws Exception;

    /**
     * 根据方法URL获取方法的出入参JSON
     * @param methodParam
     * @return
     * @throws Exception
     */
    ControllerMethodParamVO getMethodParam(MethodParamVO methodParam) throws Exception;
}
