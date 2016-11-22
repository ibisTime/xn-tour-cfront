/**
 * @Title BizConnecter.java 
 * @Package com.ibis.pz.http 
 * @Description 
 * @author miyb  
 * @date 2015-5-12 下午9:44:59 
 * @version V1.0   
 */
package com.xnjr.moom.front.http;

import java.util.Properties;

import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.util.ConfigProperties;
import com.xnjr.moom.front.util.RegexUtils;

/** 
 * @author: miyb 
 * @since: 2015-5-12 下午9:44:59 
 * @history:
 */
public class BizConnecter {

    public static final String YES = "0";

    public static final String SMS_URL = ConfigProperties.Config.SMS_URL;

    public static final String MALL_URL = ConfigProperties.Config.MALL_URL;

    public static final String USER_URL = ConfigProperties.Config.USER_URL;

    //public static final String ACCOUNT_URL = ConfigProperties.Config.ACCOUNT_URL;

    public static <T> T getBizData(String code, String json, Class<T> clazz) {
        String data = getBizData(code, json);
        return JsonUtils.json2Bean(data, clazz);
    }

    public static String getBizData(String code, String json) {
        String data = null;
        String resJson = null;
        try {
            Properties formProperties = new Properties();
            formProperties.put("code", code);
            formProperties.put("json", json);
            resJson = PostSimulater.requestPostForm(getPostUrl(code),
                formProperties);
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 开始解析响应json
        String errorCode = RegexUtils.find(resJson, "errorCode\":\"(.+?)\"", 1);
        String errorInfo = RegexUtils.find(resJson, "errorInfo\":\"(.+?)\"", 1);
        System.out.println("request:" + code + " with parameters " + json
                + "\nresponse:" + errorCode + "<" + errorInfo + ">.");
        if (YES.equalsIgnoreCase(errorCode)) {
            data = RegexUtils.find(resJson, "data\":(.*)\\}", 1);
        } else {
            throw new BizException("Biz000", errorInfo);
        }
        return data;
    }

    private static String getPostUrl(String code) {
        String postUrl = null;
        if (code.startsWith("808")) {
            postUrl = MALL_URL;
        } else if (code.startsWith("805") || code.startsWith("806")
                || code.startsWith("807")) {
        	postUrl = USER_URL;
        }
        return postUrl;
    }
}
