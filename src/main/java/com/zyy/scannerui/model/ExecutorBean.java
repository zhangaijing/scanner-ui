package com.zyy.scannerui.model;

import java.lang.reflect.Method;
import java.util.List;

public class ExecutorBean {

    //方法
    private Method method;

    //controller类的mapping
    private String classMapping;

    //类所在包名
    private String packageName;

    //类名
    private String className;

    //请求参数名称
    private String paramClassName;

    //方法的url
    private String url;

    //请求参数类的请求参数
    private List<String> paramNameList;

    //请求参数类的请求参数对象
    private List<ParamVO> paramVOList;

    public List<ParamVO> getParamVOList() {
        return paramVOList;
    }

    public void setParamVOList(List<ParamVO> paramVOList) {
        this.paramVOList = paramVOList;
    }

    public List<String> getParamNameList() {
        return paramNameList;
    }

    public void setParamNameList(List<String> paramNameList) {
        this.paramNameList = paramNameList;
    }

    public String getUrl() {
        return url;
    }

    @Override
    public String toString() {
        return "ExecutorBean{" +
                "method=" + method +
                ", classMapping='" + classMapping + '\'' +
                ", packageName='" + packageName + '\'' +
                ", className='" + className + '\'' +
                ", paramClassName='" + paramClassName + '\'' +
                ", url='" + url + '\'' +
                ", paramNameList=" + paramNameList +
                ", paramVOList=" + paramVOList +
                '}';
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getParamClassName() {
        return paramClassName;
    }

    public void setParamClassName(String paramClassName) {
        this.paramClassName = paramClassName;
    }

    public Method getMethod() {
        return method;
    }

    public void setMethod(Method method) {
        this.method = method;
    }

    public String getClassMapping() {
        return classMapping;
    }

    public void setClassMapping(String classMapping) {
        this.classMapping = classMapping;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

}
