package com.zyy.scannerui.controller;

import javax.annotation.Resource;
import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zyy.scannerui.model.ControllerMethodVO;
import com.zyy.scannerui.model.PageInitVO;
import com.zyy.scannerui.model.TransParamVO;
import com.zyy.scannerui.model.param.ControllerMethodParamVO;
import com.zyy.scannerui.model.param.ControllerParamVO;
import com.zyy.scannerui.model.param.MethodParamVO;
import com.zyy.scannerui.service.ITransControllerService;
import io.swagger.annotations.ApiOperation;

/**
 * @Author zhangyy
 * @DateTime 2019-07-23 11:49
 * @Description
 */
@RestController
@RequestMapping("/scanner")
public class TransController {

    @Resource ITransControllerService transControllerService;

    @ApiOperation(value = "获取所有Controller")
    @PostMapping("/getController")
    public PageInitVO getController(TransParamVO transParam) throws Exception{
        return transControllerService.getController(transParam);
    }

    @ApiOperation(value="获取Controller下的所有方法")
    @PostMapping("/getControllerMethod")
    public List<ControllerMethodVO> getControllerMethod(ControllerParamVO controllerParam) throws Exception{
        return transControllerService.getControllerMethod(controllerParam);
    }

    @ApiOperation(value="获取方法的出入参Json")
    @PostMapping("/getMethodParam")
    public ControllerMethodParamVO getMethodParam(MethodParamVO methodParam) throws Exception{
        return transControllerService.getMethodParam(methodParam);
    }
}
