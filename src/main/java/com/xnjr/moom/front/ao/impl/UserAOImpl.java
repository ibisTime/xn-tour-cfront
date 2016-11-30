package com.xnjr.moom.front.ao.impl;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IUserAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN805043Req;
import com.xnjr.moom.front.req.XN805047Req;
import com.xnjr.moom.front.req.XN805049Req;
import com.xnjr.moom.front.req.XN805076Req;
import com.xnjr.moom.front.req.XN805153Req;
import com.xnjr.moom.front.req.XN805160Req;
import com.xnjr.moom.front.req.XN805162Req;
import com.xnjr.moom.front.req.XN805163Req;
import com.xnjr.moom.front.req.XN805165Req;
import com.xnjr.moom.front.req.XN805170Req;
import com.xnjr.moom.front.req.XN805171Req;
import com.xnjr.moom.front.req.XN805321Req;
import com.xnjr.moom.front.util.PwdUtil;

@Service
public class UserAOImpl implements IUserAO {

	@Override
	public Map doRegister(String mobile, String loginPwd, String userReferee,
			String smsCaptcha, String companyCode) {
		if (StringUtils.isBlank(userReferee)) {
			userReferee = "";
		}
		XN805076Req req = new XN805076Req();
		req.setCompanyCode(companyCode);
		req.setMobile(mobile);
		req.setSmsCaptcha(smsCaptcha);
		req.setLoginPwd(loginPwd);
		req.setLoginPwdStrength(PwdUtil.calculateSecurityLevel(loginPwd));
		req.setUserReferee(userReferee);
		req.setIsMall("1");
		return BizConnecter.getBizData("805076", JsonUtils.object2Json(req),
				Map.class);
	}

	@Override
	public Map doLogin(String loginName, String loginPwd, String companyCode) {
		XN805043Req req = new XN805043Req();
		req.setLoginName(loginName);
		req.setLoginPwd(loginPwd);
		req.setKind("f1");
		req.setCompanyCode(companyCode);
		return BizConnecter.getBizData("805043", JsonUtils.object2Json(req),
				Map.class);
	}

	@Override
	public Map doGetUser(String userId) {
		return BizConnecter.getBizData("805056",
				JsonUtils.string2Json("userId", userId), Map.class);
	}

	@Override
	public Object doFindLoginPwd(String mobile, String newLoginPwd,
			String smsCaptcha, String companyCode) {
		XN805171Req req = new XN805171Req();
		req.setMobile(mobile);
		req.setSmsCaptcha(smsCaptcha);
		req.setNewLoginPwd(newLoginPwd);
		req.setCompanyCode(companyCode);
		req.setLoginPwdStrength(PwdUtil.calculateSecurityLevel(newLoginPwd));
		return BizConnecter.getBizData("805171", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public void doResetLoginPwd(String userId, String oldLoginPwd,
			String newLoginPwd) {
		XN805049Req req = new XN805049Req();
		req.setUserId(userId);
		req.setOldLoginPwd(oldLoginPwd);
		req.setNewLoginPwd(newLoginPwd);
		req.setLoginPwdStrength(PwdUtil.calculateSecurityLevel(newLoginPwd));
		BizConnecter.getBizData("805049", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public void doChangeMoblie(String userId, String newMobile,
			String smsCaptcha) {
		XN805047Req req = new XN805047Req();
		req.setUserId(userId);
		req.setNewMobile(newMobile);
		req.setSmsCaptcha(smsCaptcha);
		req.setTradePwd("888888");
		req.setIsMall("1");
		BizConnecter.getBizData("805047", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	// 检查手机号是否存在
	public Object checkMobileExit(String mobile, String companyCode) {
		XN805170Req req = new XN805170Req();
		req.setMobile(mobile);
		req.setCompanyCode(companyCode);
		return BizConnecter.getBizData("805040", JsonUtils.object2Json(req),
				Object.class);
	}

	public Object addAddress(String userId, String addressee, String mobile,
			String province, String city, String district,
			String detailAddress, String isDefault) {
		XN805160Req req = new XN805160Req();
		req.setAddressee(addressee);
		req.setCity(city);
		req.setDetailAddress(detailAddress);
		req.setDistrict(district);
		req.setIsDefault(isDefault);
		req.setMobile(mobile);
		req.setProvince(province);
		req.setUserId(userId);
		return BizConnecter.getBizData("805160", JsonUtils.object2Json(req),
				Object.class);
	}

	public Object deleteAddress(String code) {
		return BizConnecter.getBizData("805161",
				JsonUtils.string2Json("code", code), Object.class);
	}

	public Object editAddress(String code, String userId, String addressee,
			String mobile, String province, String city, String district,
			String detailAddress, String isDefault) {
		XN805162Req req = new XN805162Req();
		req.setCode(code);
		req.setAddressee(addressee);
		req.setCity(city);
		req.setDetailAddress(detailAddress);
		req.setDistrict(district);
		req.setIsDefault(isDefault);
		req.setMobile(mobile);
		req.setProvince(province);
		req.setUserId(userId);
		return BizConnecter.getBizData("805162", JsonUtils.object2Json(req),
				Object.class);
	}

	public Object setDefaultAddress(String code, String userId) {
		XN805163Req req = new XN805163Req();
		req.setCode(code);
		req.setUserId(userId);
		return BizConnecter.getBizData("805163", JsonUtils.object2Json(req),
				Object.class);
	}

	public Object queryAddresses(String code, String userId, String isDefault) {
		XN805165Req req = new XN805165Req();
		req.setCode(code);
		req.setUserId(userId);
		req.setIsDefault(isDefault);
		return BizConnecter.getBizData("805165", JsonUtils.object2Json(req),
				Object.class);
	}

	public Object queryAddress(String code) {
		return BizConnecter.getBizData("805166",
				JsonUtils.string2Json("code", code), Object.class);
	}

	@Override
	public Object addCoupon(String userId, String couponCode) {
		XN805321Req req = new XN805321Req();
		req.setCouponCode(couponCode);
		req.setUserId(userId);
		return BizConnecter.getBizData("805321", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object doBindMoblie(String userId, String mobile, String smsCaptcha,
			String companyCode) {
		XN805153Req req = new XN805153Req();
		req.setUserId(userId);
		req.setMobile(mobile);
		req.setSmsCaptcha(smsCaptcha);
		req.setCompanyCode(companyCode);
		return BizConnecter.getBizData("805153", JsonUtils.object2Json(req),
				Object.class);
	}
}
