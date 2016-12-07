package com.hichengdai.qlqq.front.controller;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hichengdai.qlqq.front.ao.IAccountAO;
import com.hichengdai.qlqq.front.ao.ISmsAO;
import com.hichengdai.qlqq.front.ao.IUserAO;
import com.hichengdai.qlqq.front.base.ControllerContext;
import com.hichengdai.qlqq.front.captcha.MyCaptchaService;
import com.hichengdai.qlqq.front.exception.BizException;
import com.hichengdai.qlqq.front.localToken.TokenDO;
import com.hichengdai.qlqq.front.localToken.UserDAO;
import com.hichengdai.qlqq.front.session.ISessionProvider;
import com.hichengdai.qlqq.front.session.SessionUser;

/**
 * 用户接口
 * 
 * @author: wulq
 * @since: 2016年12月7日 上午11:12:09
 * @history:
 */
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
	@RequestMapping(value = "/regist", method = RequestMethod.POST)
	@ResponseBody
	public Object doRegister(
			@RequestParam("mobile") String mobile,
			@RequestParam("loginPwd") String loginPwd,
			@RequestParam("smsCaptcha") String smsCaptcha,
			@RequestParam("captcha") String captcha,
			@RequestParam(value = "companyCode", required = false) String companyCode,
			@RequestParam(value = "userReferee", required = false) String userReferee) {
		String sessionId = ControllerContext.getRequest().getSession().getId();
		boolean flag = imageCaptchaService.validateResponseForID(sessionId,
				captcha);
		imageCaptchaService.removeCaptcha(sessionId);
		if (!flag) { // 验证码正确
			throw new BizException("83099901", "图片验证码不正确");
		}
		return userAO.doRegister(mobile, loginPwd, userReferee, smsCaptcha,
				companyCode);
	}

	// 账号密码登录
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	@ResponseBody
	public Object doLogin(
			@RequestParam("loginName") String loginName,
			@RequestParam("loginPwd") String loginPwd,
			@RequestParam(value = "companyCode", required = false) String companyCode) {
		Map res = userAO.doLogin(loginName, loginPwd, companyCode);
		// Map res1 = userAO.doGetUser((String)res.get("userId"));
		SessionUser sessionUser = new SessionUser();
		sessionUser.setUserId((String) res.get("userId"));
		// sessionUser.setKind(res1.getKind());
		// 创建session
		setSessionUser(sessionUser);
		String userId = (String) res.get("userId");
		TokenDO tokenDO = new TokenDO();
		// tokenDO.setUserId(userId);
		tokenDO.setTokenId(pwdUserId(userId));
		tokenDO.setIsExist("0");
		return tokenDO;
	}

	// 用户tokenId登录
	@RequestMapping(value = "/login-t", method = RequestMethod.POST)
	@ResponseBody
	public Object doLoginT(@RequestParam("tokenId") String tokenId) {
		Map map = null;
		try {
			map = userAO.doGetUser(unPwdUserId(tokenId));
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (map == null) {
			throw new BizException("10001", "用户不存在");
		}

		if (!map.get("status").equals("0")) {
			throw new BizException("10002", "用户被锁定");
		}
		String userId = (String) (map.get("userId"));
		SessionUser sessionUser = new SessionUser();
		sessionUser.setUserId(userId);
		// 创建session
		setSessionUser(sessionUser);

		TokenDO tokenDO = new TokenDO();
		// tokenDO.setUserId(userId);
		tokenDO.setTokenId(pwdUserId(userId));
		tokenDO.setIsExist("1");
		tokenDO.setMobile((String) (map.get("mobile")));
		return tokenDO;
	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	@ResponseBody
	public Object doGetUser() {
		return userAO.doGetUser(this.getSessionUser().getUserId());
	}

	@RequestMapping(value = "/logout", method = RequestMethod.POST)
	@ResponseBody
	public boolean logout() {
		sessionProvider.removeAttribute(ISessionProvider.SESSION_KEY_USER);
		return true;
	}

	// ****主流程end************

	// ****登陆密码start******
	// 重置登录密码
	@RequestMapping(value = "/loginpwd/reset", method = RequestMethod.POST)
	@ResponseBody
	public boolean doResetLoginPwd(@RequestParam("oldLoginPwd") String oldPwd,
			@RequestParam("newLoginPwd") String newPwd,
			@RequestParam(value = "userId", required = false) String userId) {
		userAO.doResetLoginPwd(this.getSessionUser().getUserId(), oldPwd,
				newPwd);
		// 退出登录
		return logout();
	}

	// 找回登录密码
	@RequestMapping(value = "/loginpwd/find", method = RequestMethod.POST)
	@ResponseBody
	public Object doFindLoginPwd1(@RequestParam("mobile") String mobile,
			@RequestParam("smsCaptcha") String smsCaptcha,
			@RequestParam("newLoginPwd") String newLoginPwd) {
		return userAO.doFindLoginPwd(mobile, newLoginPwd, smsCaptcha);
	}

	// ****登陆密码end******

	// 手机号是否存在
	@RequestMapping(value = "/mobile/check", method = RequestMethod.GET)
	@ResponseBody
	public Object checkMobileExist(@RequestParam("mobile") String mobile) {
		return userAO.checkMobileExit(mobile);
	}

	// **** 换手机号************
	@RequestMapping(value = "/mobile/change", method = RequestMethod.POST)
	@ResponseBody
	public boolean doChangeMobile(@RequestParam("newMobile") String newMobile,
			@RequestParam("smsCaptcha") String smsCaptcha) {

		userAO.doChangeMoblie(this.getSessionUser().getUserId(), newMobile,
				smsCaptcha);
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
