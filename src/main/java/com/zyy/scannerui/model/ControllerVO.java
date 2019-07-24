package com.zyy.scannerui.model;

import java.io.Serializable;

import lombok.Data;

/**
 * @Author zhangyy
 * @DateTime 2019-07-16 11:45
 * @Description
 */
@Data
public class ControllerVO implements Serializable {
    /*** 请求地址 */
    private String url;
    /*** 注释说明 */
    private String comment;
    /*** 作者 */
    private String author;
    /*** 类路径 */
    private String classPath;
}
