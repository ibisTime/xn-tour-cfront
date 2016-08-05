package com.xnjr.moom.front.res;

public class XN601006Res {
	//错误代码  0=成功；1=权限错误；2=参数错误；3=业务错误；9=未知错误
	private String errorCode;
	//错误信息
	private String errorInfo;
	//接口返回数据
	private String data;
	
	public String getErrorCode() {
		return errorCode;
	}
	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}
	public String getErrorInfo() {
		return errorInfo;
	}
	public void setErrorInfo(String errorInfo) {
		this.errorInfo = errorInfo;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
}
