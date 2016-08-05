package com.xnjr.moom.front.req;

public class XN602026Req {
	//下单人编号
	private String applyUser;
	//状态	 1已提交，待支付；2已取消；3已支付，待发货； 4 已发货，待收；5 已收货
	private String status;
	
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
