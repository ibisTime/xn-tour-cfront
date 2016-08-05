package com.xnjr.moom.front.res;

import java.util.Date;

public class XN801501Res {
    private String companyId;

    // 公司名字
    private String companyName;

    // 工商营业执照号
    private String licenceNo;

    // 法人证件类型
    private String idKind;

    // 法人证件号码
    private String idNo;

    // 法人真实姓名
    private String realName;

    // 注册资金
    private Long capital;

    // 省
    private String province;

    // 市
    private String city;

    // 公司地址
    private String address;

    // 工商营业执照
    private String gsyyzzPicture;

    // 组织机构代码证
    private String zzjgdmzPicture;

    // 税务登记证
    private String swdjzPicture;

    // 电子章
    private String dzzPicture;

    // 申请公函
    private String sqghPicture;

    // 法人身份证照片
    private String frPicture;

    // 其他照片
    private String otherPicture;

    // 申请提交人
    private String applyUser;

    // 申请时间(重新提交也要更新)
    private Date applyDatetime;

    // KYC（通过）时间
    private Date kycDatetime;

    private String kycNote;

    // 状态
    private String status;

    // 备注
    private String remark;
    
    // 货币类型
    private String currency;

    public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLicenceNo() {
        return licenceNo;
    }

    public void setLicenceNo(String licenceNo) {
        this.licenceNo = licenceNo;
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

    public Long getCapital() {
        return capital;
    }

    public void setCapital(Long capital) {
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGsyyzzPicture() {
        return gsyyzzPicture;
    }

    public void setGsyyzzPicture(String gsyyzzPicture) {
        this.gsyyzzPicture = gsyyzzPicture;
    }

    public String getZzjgdmzPicture() {
        return zzjgdmzPicture;
    }

    public void setZzjgdmzPicture(String zzjgdmzPicture) {
        this.zzjgdmzPicture = zzjgdmzPicture;
    }

    public String getSwdjzPicture() {
        return swdjzPicture;
    }

    public void setSwdjzPicture(String swdjzPicture) {
        this.swdjzPicture = swdjzPicture;
    }

    public String getDzzPicture() {
        return dzzPicture;
    }

    public void setDzzPicture(String dzzPicture) {
        this.dzzPicture = dzzPicture;
    }

    public String getSqghPicture() {
        return sqghPicture;
    }

    public void setSqghPicture(String sqghPicture) {
        this.sqghPicture = sqghPicture;
    }

    public String getFrPicture() {
        return frPicture;
    }

    public void setFrPicture(String frPicture) {
        this.frPicture = frPicture;
    }

    public String getOtherPicture() {
        return otherPicture;
    }

    public void setOtherPicture(String otherPicture) {
        this.otherPicture = otherPicture;
    }

    public String getApplyUser() {
        return applyUser;
    }

    public void setApplyUser(String applyUser) {
        this.applyUser = applyUser;
    }

    public Date getApplyDatetime() {
        return applyDatetime;
    }

    public void setApplyDatetime(Date applyDatetime) {
        this.applyDatetime = applyDatetime;
    }

    public Date getKycDatetime() {
        return kycDatetime;
    }

    public void setKycDatetime(Date kycDatetime) {
        this.kycDatetime = kycDatetime;
    }

    public String getKycNote() {
        return kycNote;
    }

    public void setKycNote(String kycNote) {
        this.kycNote = kycNote;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

}
