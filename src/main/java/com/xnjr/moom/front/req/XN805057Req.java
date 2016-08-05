package com.xnjr.moom.front.req;

public class XN805057Req {

    // 用户编号（必填）
    private String userId;

    // 新交易密码（必填）
    private String newTradePwd;

    // 新交易密码（必填）
    private String tradePwdStrength;

    // 短信验证码（必填）
    private String smsCaptcha;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getNewTradePwd() {
        return newTradePwd;
    }

    public void setNewTradePwd(String newTradePwd) {
        this.newTradePwd = newTradePwd;
    }

    public String getSmsCaptcha() {
        return smsCaptcha;
    }

    public void setSmsCaptcha(String smsCaptcha) {
        this.smsCaptcha = smsCaptcha;
    }

    public String getTradePwdStrength() {
        return tradePwdStrength;
    }

    public void setTradePwdStrength(String tradePwdStrength) {
        this.tradePwdStrength = tradePwdStrength;
    }

}
