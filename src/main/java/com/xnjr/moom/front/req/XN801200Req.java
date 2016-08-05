package com.xnjr.moom.front.req;

public class XN801200Req {
    // 手机号（必填）
    private String mobile;

    // 手机验证码（必填）
    private String smsCaptcha;

    // 注册密码（必填）
    private String loginPwd;

    // 注册ip（必填）
    private String registerIp;

    // 推荐人（非必填）
    private String userReferee;

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getLoginPwd() {
        return loginPwd;
    }

    public void setLoginPwd(String loginPwd) {
        this.loginPwd = loginPwd;
    }

    public String getRegisterIp() {
        return registerIp;
    }

    public void setRegisterIp(String registerIp) {
        this.registerIp = registerIp;
    }

    public String getUserReferee() {
        return userReferee;
    }

    public void setUserReferee(String userReferee) {
        this.userReferee = userReferee;
    }

    public String getSmsCaptcha() {
        return smsCaptcha;
    }

    public void setSmsCaptcha(String smsCaptcha) {
        this.smsCaptcha = smsCaptcha;
    }

}
