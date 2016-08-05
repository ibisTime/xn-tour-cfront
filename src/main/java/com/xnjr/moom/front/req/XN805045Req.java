package com.xnjr.moom.front.req;

public class XN805045Req {
	//用户编号
	private String userId;
	//交易密码
	private String tradePwd;
	//交易密码强度
	private String tradePwdStrength;
	//验证码
	private String smsCaptcha;
	
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
	public String getTradePwdStrength() {
		return tradePwdStrength;
	}
	public void setTradePwdStrength(String tradePwdStrength) {
		this.tradePwdStrength = tradePwdStrength;
	}
	public String getSmsCaptcha() {
		return smsCaptcha;
	}
	public void setSmsCaptcha(String smsCaptcha) {
		this.smsCaptcha = smsCaptcha;
	}
}
