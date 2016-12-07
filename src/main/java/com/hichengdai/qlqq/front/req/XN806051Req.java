package com.hichengdai.qlqq.front.req;

public class XN806051Req {
	// 类型 1 菜单 2 banner 3 模块 4 引流
	private String type;
	// 父编号
	private String parentCode;
	// 公司编号
	private String companyCode;
	// 位置
	private String location;

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getParentCode() {
		return parentCode;
	}

	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}

	public String getCompanyCode() {
		return companyCode;
	}

	public void setCompanyCode(String companyCode) {
		this.companyCode = companyCode;
	}

}
