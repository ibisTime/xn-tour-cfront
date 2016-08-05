package com.xnjr.moom.front.req;

public class XN602020Req {
	//申请人编号
	public String applyUser;
	//型号编号
	public String modelCode;
	//数量
	public String quantity;
	//单价
	public String salePrice;
	//收货信息编号
	public String addressCode;
	//下单备注
	public String applyNote;
	//发票类型
	public String receiptType;
	//发票抬头
	public String receiptTitle;
	
	public String getApplyUser() {
		return applyUser;
	}
	public void setApplyUser(String applyUser) {
		this.applyUser = applyUser;
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
	public String getSalePrice() {
		return salePrice;
	}
	public void setSalePrice(String salePrice) {
		this.salePrice = salePrice;
	}
	public String getAddressCode() {
		return addressCode;
	}
	public void setAddressCode(String addressCode) {
		this.addressCode = addressCode;
	}
	public String getApplyNote() {
		return applyNote;
	}
	public void setApplyNote(String applyNote) {
		this.applyNote = applyNote;
	}
	public String getReceiptType() {
		return receiptType;
	}
	public void setReceiptType(String receiptType) {
		this.receiptType = receiptType;
	}
	public String getReceiptTitle() {
		return receiptTitle;
	}
	public void setReceiptTitle(String receiptTitle) {
		this.receiptTitle = receiptTitle;
	}
}
