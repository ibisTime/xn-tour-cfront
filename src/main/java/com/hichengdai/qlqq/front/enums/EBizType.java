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
public enum EBizType {
    REGISTER("1", "注册"), WITHDRAW("2", "取现"), SETTRADEPWD("3", "设置交易密码"), CHANGEMOBILE(
            "4", "修改手机号码"), FINDLOGINPWD("5", "找回登陆密码"), FINDTRADEPWD("6",
            "找回交易密码");

    EBizType(String code, String value) {
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
