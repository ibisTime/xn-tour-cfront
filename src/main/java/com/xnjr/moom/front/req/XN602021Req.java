package com.xnjr.moom.front.req;

import java.util.List;

public class XN602021Req {
	private String applyUser;
	private List<String> cartCodeList;
	private String applyNote;
	private String receiptType;
	private String receiptTitle;
	private String addressCode;
	
	public String getApplyUser() {
		return applyUser;
	}
	public void setApplyUser(String applyUser) {
		this.applyUser = applyUser;
	}
	
	public List<String> getCartCodeList() {
		return cartCodeList;
	}
	public void setCartCodeList(List<String> cartCodeList) {
		this.cartCodeList = cartCodeList;
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
	public String getAddressCode() {
		return addressCode;
	}
	public void setAddressCode(String addressCode) {
		this.addressCode = addressCode;
	}
}
