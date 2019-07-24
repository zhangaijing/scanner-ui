package com.zyy.scannerui.model;

import lombok.Data;

/**
 * @Author zhangyy
 * @DateTime 2019-07-23 11:58
 * @Description
 */
@Data
public class TransParamVO {

    /*** 目标主机IP地址 */
    private String ip;

    /*** 目标主机端口号 */
    private String port;
}
