package com.xnjr.moom.front.req;

public class XN801212Req {
    // userId
    private String userId;

    // 原交易密码
    private String oldTradePwd;

    // 新交易密码
    private String newTradePwd;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOldTradePwd() {
        return oldTradePwd;
    }

    public void setOldTradePwd(String oldTradePwd) {
        this.oldTradePwd = oldTradePwd;
    }

    public String getNewTradePwd() {
        return newTradePwd;
    }

    public void setNewTradePwd(String newTradePwd) {
        this.newTradePwd = newTradePwd;
    }

}
