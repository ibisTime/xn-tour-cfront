package com.xnjr.moom.front.req;

public class XN803100Req {

    // 用户tokenId(必填)
    private String tokenId;

    // 投资用户编号(必填)
    private String userId;

    // 标的编号(必填)
    private String projectCode;

    // 投资金额
    private String investAmount;

    // 投资说明
    private String investNote;

    // 投资时有的金额(描述一种状态)
    private String nowAmount;

    // 投资时有的说明(描述一种状态)
    private String nowNote;

    // 交易密码(必填)
    private String tradePwd;

    public String getTokenId() {
        return tokenId;
    }

    public void setTokenId(String tokenId) {
        this.tokenId = tokenId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getNowAmount() {
        return nowAmount;
    }

    public void setNowAmount(String nowAmount) {
        this.nowAmount = nowAmount;
    }

    public String getNowNote() {
        return nowNote;
    }

    public void setNowNote(String nowNote) {
        this.nowNote = nowNote;
    }

    public String getInvestAmount() {
        return investAmount;
    }

    public void setInvestAmount(String investAmount) {
        this.investAmount = investAmount;
    }

    public String getInvestNote() {
        return investNote;
    }

    public void setInvestNote(String investNote) {
        this.investNote = investNote;
    }

    public String getTradePwd() {
        return tradePwd;
    }

    public void setTradePwd(String tradePwd) {
        this.tradePwd = tradePwd;
    }
}
