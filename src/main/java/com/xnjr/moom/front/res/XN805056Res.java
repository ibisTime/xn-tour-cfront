package com.xnjr.moom.front.res;

import java.util.Date;

public class XN805056Res {
	

    // userId
    private String userId;

    // 手机号
    private String mobile;

    // 登陆密码强度
    private String loginPwdStrength;

    // 身份
    private String kind;

    // 推荐人
    private String userReferee;

    // 证件类型
    private String idKind;

    // 证件号码
    private String idNo;

    // 真实姓名
    private String realName;
	
    private String loginName;
    
    private String remark;
    
    public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getLoginPwdStrength() {
		return loginPwdStrength;
	}

	public void setLoginPwdStrength(String loginPwdStrength) {
		this.loginPwdStrength = loginPwdStrength;
	}

	public String getKind() {
		return kind;
	}

	public void setKind(String kind) {
		this.kind = kind;
	}

	public String getUserReferee() {
		return userReferee;
	}

	public void setUserReferee(String userReferee) {
		this.userReferee = userReferee;
	}

	public String getIdKind() {
		return idKind;
	}

	public void setIdKind(String idKind) {
		this.idKind = idKind;
	}

	public String getIdNo() {
		return idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getUpdateDatetime() {
		return updateDatetime;
	}

	public void setUpdateDatetime(String updateDatetime) {
		this.updateDatetime = updateDatetime;
	}

	public String getUpdater() {
		return updater;
	}

	public void setUpdater(String updater) {
		this.updater = updater;
	}

	public String getTradePwdStrength() {
		return tradePwdStrength;
	}

	public void setTradePwdStrength(String tradePwdStrength) {
		this.tradePwdStrength = tradePwdStrength;
	}

	public Date getCreateDatetime() {
		return createDatetime;
	}

	public void setCreateDatetime(Date createDatetime) {
		this.createDatetime = createDatetime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getServeList() {
		return serveList;
	}

	public void setServeList(String serveList) {
		this.serveList = serveList;
	}

	public String getQuoteList() {
		return quoteList;
	}

	public void setQuoteList(String quoteList) {
		this.quoteList = quoteList;
	}

	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}

	public String getIndividualCode() {
		return individualCode;
	}

	public void setIndividualCode(String individualCode) {
		this.individualCode = individualCode;
	}

	private String updateDatetime;
    
    private String updater;

    // 安全密码强度
    private String tradePwdStrength;

    // 创建时间
    private Date createDatetime;

    // 状态
    private String status;

    // 拥有的服务list
    private String serveList;

    // 拥有的报价list
    private String quoteList;

    // 用户等级
    private Integer level;
    
    // 个体户
    private String individualCode;

}
