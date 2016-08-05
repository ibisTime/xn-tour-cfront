package com.xnjr.moom.front.req;

public class XN602000Req {
	//用户编号
	private String userId;
	//型号编号
	private String modelCode;
	//数量
	private String quantity;
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getModelCode() {
		return modelCode;
	}
	public void setModelCode(String modelCode) {
		this.modelCode = modelCode;
	}
	public String getQuantity() {
		return quantity;
	}
	public void setQuantity(String quantity) {
		this.quantity = quantity;
	}
}
