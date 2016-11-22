package com.xnjr.moom.front.req;

public class XN805165Req {
	//收件编号
	private String code;
	//用户编号
	private String userId;
	//是否默认	1 是 0 否
	private String isDefault;
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
	public String getIsDefault() {
		return isDefault;
	}
	public void setIsDefault(String isDefault) {
		this.isDefault = isDefault;
	}
}
