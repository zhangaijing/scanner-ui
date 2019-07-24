package com.zyy.scannerui.model;

/**
 * @Author zhangyy
 * @DateTime 2019-06-05 09:54
 * @Description  类扫描实现类
 */
public class ParamVO {

    /*** 参数名 */
    private String paramName;

    /*** 参数类型 */
    private String paramType;

    public String getParamName() {
        return paramName;
    }

    public void setParamName(String paramName) {
        this.paramName = paramName;
    }

    public String getParamType() {
        return paramType;
    }

    public void setParamType(String paramType) {
        this.paramType = paramType;
    }

    @Override
    public String toString() {
        return "ParamVO{" +
                "paramName='" + paramName + '\'' +
                ", paramType='" + paramType + '\'' +
                '}';
    }
}
