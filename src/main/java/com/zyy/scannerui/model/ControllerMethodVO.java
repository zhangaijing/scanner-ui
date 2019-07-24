package com.zyy.scannerui.model;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * @Author zhangyy
 * @DateTime 2019-07-16 16:57
 * @Description
 */
@Data
public class ControllerMethodVO implements Serializable {

    /*** 方法请求的地址 */
    private String url;
    /*** 方法注释 */
    private String comment;
    /*** 方法返回的类型（出参） */
    private String returnType;
    /*** 方法请求的类型（入参） */
    private List<ParamVO> paramList;
}
