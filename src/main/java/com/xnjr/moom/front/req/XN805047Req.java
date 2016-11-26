package com.xnjr.moom.front.req;

public class XN805047Req {

	// 用户编号（必填）
	private String userId;

	// 新手机号（必填）
	private String newMobile;

	// 验证码（必填）
	private String smsCaptcha;

	// 交易密码（必填）
	private String tradePwd;

	private String isMall;

	public String getIsMall() {
		return isMall;
	}

	public void setIsMall(String isMall) {
		this.isMall = isMall;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getNewMobile() {
		return newMobile;
	}

	public void setNewMobile(String newMobile) {
		this.newMobile = newMobile;
	}

	public String getSmsCaptcha() {
		return smsCaptcha;
	}

	public void setSmsCaptcha(String smsCaptcha) {
		this.smsCaptcha = smsCaptcha;
	}

	public String getTradePwd() {
		return tradePwd;
	}

	public void setTradePwd(String tradePwd) {
		this.tradePwd = tradePwd;
	}

}
