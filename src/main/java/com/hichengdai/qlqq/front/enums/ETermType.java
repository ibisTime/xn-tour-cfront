/**
 * @Title ESmsBizType.java 
 * @Package com.ibis.pz.enums 
 * @Description 
 * @author miyb  
 * @date 2015-4-14 下午2:45:40 
 * @version V1.0   
 */
package com.hichengdai.qlqq.front.enums;

/** 
 * @author: miyb 
 * @since: 2015-4-14 下午2:45:40 
 * @history:
 */
public enum ETermType {
    WEB("1", "PC端"), APP("2", "APP端");

    ETermType(String code, String value) {
        this.code = code;
        this.value = value;
    }

    private String code;

    private String value;

    public String getCode() {
        return code;
    }

    public String getValue() {
        return value;
    }
}
