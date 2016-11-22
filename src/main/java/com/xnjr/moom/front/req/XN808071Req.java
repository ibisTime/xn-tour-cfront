package com.xnjr.moom.front.req;

public class XN808071Req {
	//下单人编号
	private String applyUser;
	//状态	 1待支付 2 已支付待发货 3 已发货待收货 4 已收货 91用户取消 92 商户取消 93 快递异常
	private String status;
	
	private String mobile;
	
	private String companyCode;
	
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getCompanyCode() {
		return companyCode;
	}
	public void setCompanyCode(String companyCode) {
		this.companyCode = companyCode;
	}
	public String getApplyUser() {
		return applyUser;
	}
	public void setApplyUser(String applyUser) {
		this.applyUser = applyUser;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
}
