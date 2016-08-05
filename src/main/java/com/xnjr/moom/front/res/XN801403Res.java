package com.xnjr.moom.front.res;

import java.util.Date;

public class XN801403Res {
    // user_id
    private String userId;

    // 登录时间
    private Date loginDatetime;

    // 登录IP地址
    private String loginIp;

    // 是否登录成功
    private String isSuccess;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Date getLoginDatetime() {
        return loginDatetime;
    }

    public void setLoginDatetime(Date loginDatetime) {
        this.loginDatetime = loginDatetime;
    }

    public String getLoginIp() {
        return loginIp;
    }

    public void setLoginIp(String loginIp) {
        this.loginIp = loginIp;
    }

    public String getIsSuccess() {
        return isSuccess;
    }

    public void setIsSuccess(String isSuccess) {
        this.isSuccess = isSuccess;
    }
}
