package com.xnjr.moom.front.req;

public class XN602404Req {
    // 公司编号
    private String companyCode;

    // 支行
    private String subbranch;

    // 账号
    private String cardNo;

    // 状态 1 启用 0 不启用
    private String status;

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public String getSubbranch() {
        return subbranch;
    }

    public void setSubbranch(String subbranch) {
        this.subbranch = subbranch;
    }

    public String getCardNo() {
        return cardNo;
    }

    public void setCardNo(String cardNo) {
        this.cardNo = cardNo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
