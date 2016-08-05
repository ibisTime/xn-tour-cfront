package com.xnjr.moom.front.req;

public class XN801214Req {
    private String id;

    // userId（必填）
    private String userId;

    // 类型(对公对私)（必填）
    private String type;

    public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	// 银行代号（非必填）
    private String bankCode;

    // 银行名字（非必填）
    private String bankName;

    // 卡号（必填）
    private String bankCardNo;

    // 开卡支行（选填）
    private String subbranch;

    // 银行预留手机号（非选填）
    private String bindMobile;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getSubbranch() {
        return subbranch;
    }

    public void setSubbranch(String subbranch) {
        this.subbranch = subbranch;
    }

    public String getBankCardNo() {
        return bankCardNo;
    }

    public void setBankCardNo(String bankCardNo) {
        this.bankCardNo = bankCardNo;
    }

    public String getBindMobile() {
        return bindMobile;
    }

    public void setBindMobile(String bindMobile) {
        this.bindMobile = bindMobile;
    }

}