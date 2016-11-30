package com.xnjr.moom.front.controller;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IAccountAO;
import com.xnjr.moom.front.ao.ISmsAO;
import com.xnjr.moom.front.ao.IUserAO;
import com.xnjr.moom.front.captcha.MyCaptchaService;
import com.xnjr.moom.front.localToken.UserDAO;
import com.xnjr.moom.front.session.ISessionProvider;
import com.xnjr.moom.front.session.SessionUser;

@Controller
@RequestMapping(value = "/user")
public class MemberController extends BaseController {
	@Autowired
	IUserAO userAO;

	@Autowired
	UserDAO userDAO;

	@Autowired
	IAccountAO accountAO;

	@Autowired
	ISmsAO smsAO;

	@Resource(name = "imageCaptchaService")
	private MyCaptchaService imageCaptchaService;

	// ****主流程start************
	@RequestMapping(value = "/mobile/check", method = RequestMethod.POST)
	@ResponseBody
	public Object checkMobileExist(@RequestParam("mobile") String mobile,
			@RequestParam("companyCode") String companyCode) {
		return userAO.checkMobileExit(mobile, companyCode);
	}

	@RequestMapping(value = "/regist", method = RequestMethod.POST)
	@ResponseBody
	public Object doRegister(
			@RequestParam("mobile") String mobile,
			@RequestParam("loginPwd") String loginPwd,
			@RequestParam("smsCaptcha") String smsCaptcha,
			@RequestParam("companyCode") String companyCode,
			@RequestParam(value = "userReferee", required = false) String userReferee) {
		return userAO.doRegister(mobile, loginPwd, userReferee, smsCaptcha,
				companyCode);
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	@ResponseBody
	public Object doLogin(@RequestParam("loginName") String loginName,
			@RequestParam("loginPwd") String loginPwd,
			@RequestParam("companyCode") String companyCode) {
		Map res = userAO.doLogin(loginName, loginPwd, companyCode);
		// Map res1 = userAO.doGetUser((String)res.get("userId"));
		SessionUser sessionUser = new SessionUser();
		sessionUser.setUserId((String) res.get("userId"));
		// sessionUser.setKind(res1.getKind());
		// 创建session
		setSessionUser(sessionUser);
		return true;
	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	@ResponseBody
	public Object doGetUser() {
		return userAO.doGetUser(this.getSessionUser().getUserId());
	}

	@RequestMapping(value = "/add/address", method = RequestMethod.POST)
	@ResponseBody
	public Object addAddress(@RequestParam("addressee") String addressee,
			@RequestParam("mobile") String mobile,
			@RequestParam("province") String province,
			@RequestParam("city") String city,
			@RequestParam("district") String district,
			@RequestParam("detailAddress") String detailAddress,
			@RequestParam("isDefault") String isDefault,
			@RequestParam(value = "userId", required = false) String userId) {
		return userAO.addAddress(this.getSessionUser().getUserId(), addressee,
				mobile, province, city, district, detailAddress, isDefault);
	}

	@RequestMapping(value = "/delete/address", method = RequestMethod.POST)
	@ResponseBody
	public Object deleteAddress(@RequestParam(value = "code") String code) {
		return userAO.deleteAddress(code);
	}

	@RequestMapping(value = "/edit/address", method = RequestMethod.POST)
	@ResponseBody
	public Object editAddress(@RequestParam("code") String code,
			@RequestParam("addressee") String addressee,
			@RequestParam("mobile") String mobile,
			@RequestParam("province") String province,
			@RequestParam("city") String city,
			@RequestParam("district") String district,
			@RequestParam("detailAddress") String detailAddress,
			@RequestParam("isDefault") String isDefault,
			@RequestParam(value = "userId", required = false) String userId) {
		return userAO.editAddress(code, this.getSessionUser().getUserId(),
				addressee, mobile, province, city, district, detailAddress,
				isDefault);
	}

	@RequestMapping(value = "/edit/setDefaultAddress", method = RequestMethod.POST)
	@ResponseBody
	public Object setDefaultAddress(@RequestParam("code") String code,
			@RequestParam(value = "userId", required = false) String userId) {
		return userAO
				.setDefaultAddress(code, this.getSessionUser().getUserId());
	}

	@RequestMapping(value = "/queryAddresses", method = RequestMethod.GET)
	@ResponseBody
	public Object queryAddresses(
			@RequestParam(value = "code", required = false) String code,
			@RequestParam(value = "isDefault", required = false) String isDefault) {
		return userAO.queryAddresses(code, this.getSessionUser().getUserId(),
				isDefault);
	}

	@RequestMapping(value = "/queryAddress", method = RequestMethod.GET)
	@ResponseBody
	public Object queryAddress(@RequestParam("code") String code) {
		return userAO.queryAddress(code);
	}

	@RequestMapping(value = "/logout", method = RequestMethod.POST)
	@ResponseBody
	public boolean logout() {
		sessionProvider.removeAttribute(ISessionProvider.SESSION_KEY_USER);
		return true;
	}

	// ****主流程end************

	// ****登陆密码start******
	@RequestMapping(value = "/loginpwd/reset", method = RequestMethod.POST)
	@ResponseBody
	public boolean doResetLoginPwd(@RequestParam("oldLoginPwd") String oldPwd,
			@RequestParam("newLoginPwd") String newPwd,
			@RequestParam(value = "userId", required = false) String userId) {
		userAO.doResetLoginPwd(this.getSessionUser().getUserId(), oldPwd,
				newPwd);
		// 重新登陆
		return logout();
	}

	@RequestMapping(value = "/loginpwd/find", method = RequestMethod.POST)
	@ResponseBody
	public Object doFindLoginPwd(@RequestParam("mobile") String mobile,
			@RequestParam("smsCaptcha") String smsCaptcha,
			@RequestParam("newLoginPwd") String newLoginPwd,
			@RequestParam("companyCode") String companyCode) {
		return userAO.doFindLoginPwd(mobile, newLoginPwd, smsCaptcha,
				companyCode);
	}

	// ****登陆密码end******

	// **** 换手机号************
	@RequestMapping(value = "/mobile/change", method = RequestMethod.POST)
	@ResponseBody
	public boolean doChangeMobile(@RequestParam("newMobile") String newMobile,
			@RequestParam("smsCaptcha") String smsCaptcha) {

		userAO.doChangeMoblie(this.getSessionUser().getUserId(), newMobile,
				smsCaptcha);
		return true;
	}

	// 扫描卡券二维码
	@RequestMapping(value = "/coupon/add", method = RequestMethod.POST)
	@ResponseBody
	public boolean addCoupon(@RequestParam("couponCode") String couponCode) {

		userAO.addCoupon(this.getSessionUser().getUserId(), couponCode);
		return true;
	}

	// 绑定手机号
	@RequestMapping(value = "/mobile/bind", method = RequestMethod.POST)
	@ResponseBody
	public Object doBindMobile(@RequestParam("mobile") String mobile,
			@RequestParam("smsCaptcha") String smsCaptcha,
			@RequestParam("companyCode") String companyCode) {

		return userAO.doBindMoblie(this.getSessionUser().getUserId(), mobile,
				smsCaptcha, companyCode);

	}
}
