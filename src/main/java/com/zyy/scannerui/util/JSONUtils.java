package com.zyy.scannerui.util;

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;

/**
 * Json工具类
 *
 * @author lanpeng.
 */
public final class JSONUtils {
    private static final Logger LOGGER = LoggerFactory.getLogger(JSONUtils.class);

    private JSONUtils() {

    }

    /**
     * Json反序列化至指定类型
     *
     * @param json json字符串
     * @param type 指定数据类型
     */
    public static <T> T parse(String json, Type type) {
        if (StringUtils.isEmpty(json)) {
            return null;
        }
        return JSONObject.parseObject(json, type);
    }

    /**
     * Json反序列化至指定类型，该方法用于支持泛型的复杂数据类型
     *
     * @param json json字符串
     * @param type 指定数据类型
     */
    public static <T> T parse(String json, TypeReference<T> type) {
        if (StringUtils.isEmpty(json)) {
            return null;
        }
        return JSONObject.parseObject(json, type);
    }

    /**
     * 数据类型转换，将一个对象转换至指定数据类型
     *
     * @param object 待转换对象
     * @param type   指定数据类型
     */
    public static <T> T parse(Object object, Type type) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:sss");
        try {
            return parse(JSONObject.toJSONString(object), type);
        } catch (JSONException e) {
            LOGGER.error("父类转子类异常：{},异常执行时间：{},被转换类名称：{},目标转换类名称：{}", e.getMessage(), sdf.format(new Date()), object.getClass().getTypeName(), type.getTypeName());
            return null;
        }
    }

    /**
     * Json序列化
     *
     * @param obj 待序列化对象
     */
    public static String toJSONString(Object obj) {
        if (obj == null) {
            return null;
        }
        return JSONObject.toJSONString(obj);
    }

    /**
     * 类型转换，对象转Json对象
     */
    public static JSONObject toJSON(Object obj) {
        if (obj == null) {
            return null;
        }
        return (JSONObject) JSONObject.toJSON(obj);
    }

    /**
     * Json反序列化
     *
     * @param obj 待反序列化字符串
     * @return Json数组对象
     */
    public static JSONArray parseArray(String obj) {
        if (obj == null) {
            return null;
        }
        return JSON.parseArray(obj);
    }

    /**
     * Json反序列化
     *
     * @param obj 待反序列化字符串
     * @return Json对象
     */
    public static JSONObject parseObject(String obj) {
        if (obj == null) {
            return null;
        }
        return JSON.parseObject(obj);
    }

    /**
     * Json反序列化集合
     *
     * @param json  待反序列化字符串
     * @param clazz 集合中的数据类型
     * @return Json对象
     */
    public static <T> List<T> toList(String json, Class<T> clazz) {
        return JSON.parseArray(json, clazz);
    }

    /**
     * json对象转换为List（适用于backBO.getData()直接转换为List<T>）
     *
     * @param objData backBO.getData()值
     * @param clazz   List中的实体对象的Class
     * @return 对象集合
     */
    public static <T> List<T> toList(Object objData, Class<T> clazz) {
        if (objData == null) {
            return null;
        }
        String jsonDataStr = toJSONString(objData);
        if (StringUtils.isEmpty(jsonDataStr)) {
            return null;
        }
        return toList(jsonDataStr, clazz);
    }


    /**
     *
     * @param json
     * @return
     */
    public static Map<String, Object> stringToMap(String json) {
        return JSONObject.parseObject(json);
    }
}

