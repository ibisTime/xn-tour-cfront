package com.xnjr.moom.front.req;

public class XNfd2032Req {
	
	// 公司编号(必填)
    private String code;

    // 公司名字(必填)
    private String name;

    // 工商营业执照号(必填)
    private String gsyyzzNo;

    // 法人证件类型(必填)
    private String idKind;

    // 法人证件号码(必填)
    private String idNo;

    // 法人真实姓名(必填)
    private String realName;
    
    // 货币类型(必填)
    private String currency;

    // 注册资金(必填)
    private String capital;

    // 省(必填)
    private String province;

    // 市(必填)
    private String city;

    // 申请提交人(必填)
    private String applyUser;
    
    // 地址
    private String address;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGsyyzzNo() {
		return gsyyzzNo;
	}

	public void setGsyyzzNo(String gsyyzzNo) {
		this.gsyyzzNo = gsyyzzNo;
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

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public String getCapital() {
		return capital;
	}

	public void setCapital(String capital) {
		this.capital = capital;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getApplyUser() {
		return applyUser;
	}

	public void setApplyUser(String applyUser) {
		this.applyUser = applyUser;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
    

    
}
