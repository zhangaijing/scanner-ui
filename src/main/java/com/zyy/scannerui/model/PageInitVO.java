package com.zyy.scannerui.model;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * @Author zhangyy
 * @DateTime 2019-07-19 15:18
 * @Description
 */
@Data
public class PageInitVO implements Serializable {

    /*** 微服务名称 */
    private String serviceName;

    /*** Controller类列表 */
    private List<ControllerVO> controllerList;
}
