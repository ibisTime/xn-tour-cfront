package com.xnjr.moom.front.req;

public class XN801203Req {
    // userId（必填）
    private String userId;

    // 安全密码（必填）
    private String tradePwd;

    // 手机验证码（必填）
    private String smsCaptcha;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTradePwd() {
        return tradePwd;
    }

    public void setTradePwd(String tradePwd) {
        this.tradePwd = tradePwd;
    }

    public String getSmsCaptcha() {
        return smsCaptcha;
    }

    public void setSmsCaptcha(String smsCaptcha) {
        this.smsCaptcha = smsCaptcha;
    }

}
