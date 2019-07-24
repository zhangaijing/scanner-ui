package com.zyy.scannerui.model.param;

import com.zyy.scannerui.model.TransParamVO;
import lombok.Data;

/**
 * @Author zhangyy
 * @DateTime 2019-07-23 12:00
 * @Description
 */
@Data
public class ControllerParamVO extends TransParamVO {

    /*** controller类路径 */
    private String classPath;
}
