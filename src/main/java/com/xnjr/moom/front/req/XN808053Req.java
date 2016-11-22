package com.xnjr.moom.front.req;

public class XN808053Req {
    // 订单编号
    private String code;

    // 用户编号
    private String userId;

    // 取消说明
    private String remark;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}
