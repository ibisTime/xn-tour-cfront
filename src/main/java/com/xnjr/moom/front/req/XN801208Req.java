package com.xnjr.moom.front.req;

public class XN801208Req {
    // mobile(没有就注册，所以可用手机号)
    private String mobile;

    // 手机验证码
    private String smsCaptcha;

    // 新登录密码
    private String newLoginPwd;

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getSmsCaptcha() {
        return smsCaptcha;
    }

    public void setSmsCaptcha(String smsCaptcha) {
        this.smsCaptcha = smsCaptcha;
    }

    public String getNewLoginPwd() {
        return newLoginPwd;
    }

    public void setNewLoginPwd(String newLoginPwd) {
        this.newLoginPwd = newLoginPwd;
    }

}
