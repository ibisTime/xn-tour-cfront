package com.xnjr.moom.front.req;

import java.util.List;



public class XN602006Req {
	//购物车编号列表
	private List<String> cartCodeList;
	//用户编号
	private String userId;
	
	public List<String> getCartCodeList() {
		return cartCodeList;
	}
	public void setCartCodeList(List<String> cartCodeList) {
		this.cartCodeList = cartCodeList;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
}
