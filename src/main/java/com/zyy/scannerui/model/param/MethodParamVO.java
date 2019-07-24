package com.zyy.scannerui.model.param;

import com.zyy.scannerui.model.TransParamVO;
import lombok.Data;

/**
 * @Author zhangyy
 * @DateTime 2019-07-23 12:00
 * @Description
 */
@Data
public class MethodParamVO extends TransParamVO {

    /*** 方法URL */
    private String methodUrl;
}
