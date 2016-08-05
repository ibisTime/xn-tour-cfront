package com.xnjr.moom.front.req;

public class XN805051Req {
	//用户编号
	private String userId;
	//原交易密码
	private String oldTradePwd;
	//新交易密码
	private String newTradePwd;
	//安全密码强度   1=弱；2=中；3=强
	private String tradePwdStrength;
	
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
	public String getTradePwdStrength() {
		return tradePwdStrength;
	}
	public void setTradePwdStrength(String tradePwdStrength) {
		this.tradePwdStrength = tradePwdStrength;
	}
}
