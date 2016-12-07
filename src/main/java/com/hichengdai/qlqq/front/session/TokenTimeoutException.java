/**
 * @Title TokenTimeoutException.java 
 * @Package com.xnjr.moom.front.session 
 * @Description 
 * @author haiqingzheng  
 * @date 2016年4月20日 下午1:14:00 
 * @version V1.0   
 */
package com.hichengdai.qlqq.front.session;

import java.util.LinkedHashSet;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.hichengdai.qlqq.front.base.BaseRuntimeException;
import com.hichengdai.qlqq.front.enums.ESeparator;
import com.hichengdai.qlqq.front.exception.Error;
import com.hichengdai.qlqq.front.exception.ErrorMessage;
import com.hichengdai.qlqq.front.exception.ExceptionTypeConstants;

/** 
 * token失效/过期 exception
 * @author: haiqingzheng 
 * @since: 2016年4月20日 下午1:14:00 
 * @history:
 */
@SuppressWarnings("serial")
@JsonFilter(value = "tokenTimeoutException")
public class TokenTimeoutException extends BaseRuntimeException {

    /**
     * 表示会话超时
     */
    private Boolean timeout = Boolean.TRUE;

    /**
     * 会话超时信息
     */
    private String msg;

    public TokenTimeoutException() {
        super();
        seteType(ExceptionTypeConstants.TIMEOUT_EXCEPTION.value());
    }

    public TokenTimeoutException(String... params) {
        super(params);
        seteType(ExceptionTypeConstants.TIMEOUT_EXCEPTION.value());
    }

    @Override
    public void addErrorMessage(String... params) {
        if (null == exceptions) {
            exceptions = new LinkedHashSet<Error>();
        }
        exceptions.add(new ErrorMessage("-1000", params[0]));
    }

    /**
     * 需要的错误信息字段
     * @return
     */
    @Override
    public String[] packProperties() {
        // return new String[] { "success", "timeout", "eType", "exceptions" };
        return new String[] { "success", "eType", "msg" };
    }

    public Boolean getTimeout() {
        return timeout;
    }

    public void setTimeout(Boolean timeout) {
        this.timeout = timeout;
    }

    public String getMsg() {
        return StringUtils.isBlank(this.msg) ? this.toMsg() : this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String toMsg() {
        StringBuilder msg = new StringBuilder();
        for (Error ex : getExceptions()) {
            msg.append(ex.getInfo()).append(ESeparator.SEMICOLON.value());
        }
        msg.deleteCharAt(msg.length() - 1);
        String res = msg.toString();
        this.setMsg(res);
        return res;
    }

}
