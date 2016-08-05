package com.xnjr.moom.front.req;

public class XN803320Req {
    // 必填
    private String userId;

    // 标的编号（必填）
    private String projectCode;

    // 认购金额（必填）
    private String investAmount;

    // 认购时间，精确到天（必填）
    private String investDate;

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

    public String getInvestAmount() {
        return investAmount;
    }

    public void setInvestAmount(String investAmount) {
        this.investAmount = investAmount;
    }

    public String getInvestDate() {
        return investDate;
    }

    public void setInvestDate(String investDate) {
        this.investDate = investDate;
    }

}
