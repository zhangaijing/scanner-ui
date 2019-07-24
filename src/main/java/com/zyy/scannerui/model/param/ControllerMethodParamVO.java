package com.zyy.scannerui.model.param;

import java.io.Serializable;

import lombok.Data;

/**
 * @Author zhangyy
 * @DateTime 2019-07-16 19:24
 * @Description
 */
@Data
public class ControllerMethodParamVO implements Serializable {

    /*** 请求URL */
    private String url;
    /*** 请求参数JSON */
    private String paramJson;
    /*** 响应参数JSON */
    private String returnJson;
}
