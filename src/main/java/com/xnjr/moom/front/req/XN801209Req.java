package com.xnjr.moom.front.req;

public class XN801209Req {
    // userId
    private String userId;

    // 原登录密码
    private String oldLoginPwd;

    // 新登录密码
    private String newLoginPwd;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOldLoginPwd() {
        return oldLoginPwd;
    }

    public void setOldLoginPwd(String oldLoginPwd) {
        this.oldLoginPwd = oldLoginPwd;
    }

    public String getNewLoginPwd() {
        return newLoginPwd;
    }

    public void setNewLoginPwd(String newLoginPwd) {
        this.newLoginPwd = newLoginPwd;
    }

}
