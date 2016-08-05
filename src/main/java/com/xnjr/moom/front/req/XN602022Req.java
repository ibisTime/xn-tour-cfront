package com.xnjr.moom.front.req;

public class XN602022Req {
	//订单编号
	private String code;
	//用户编号
	private String userId;
	//交易密码
	private String tradePwd;
	
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
	public String getTradePwd() {
		return tradePwd;
	}
	public void setTradePwd(String tradePwd) {
		this.tradePwd = tradePwd;
	}
}
