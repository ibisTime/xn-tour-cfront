package com.hichengdai.qlqq.front.ao.impl;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.IUserAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.XN805043Req;
import com.hichengdai.qlqq.front.req.XN805047Req;
import com.hichengdai.qlqq.front.req.XN805048Req;
import com.hichengdai.qlqq.front.req.XN805049Req;
import com.hichengdai.qlqq.front.req.XN805076Req;
import com.hichengdai.qlqq.front.req.XN805153Req;
import com.hichengdai.qlqq.front.util.PwdUtil;

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
			String smsCaptcha) {
		XN805048Req req = new XN805048Req();
		req.setMobile(mobile);
		req.setSmsCaptcha(smsCaptcha);
		req.setNewLoginPwd(newLoginPwd);
		req.setLoginPwdStrength(PwdUtil.calculateSecurityLevel(newLoginPwd));
		return BizConnecter.getBizData("805048", JsonUtils.object2Json(req),
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
		BizConnecter.getBizData("805047", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object checkMobileExit(String mobile) {
		return BizConnecter.getBizData("805040",
				JsonUtils.string2Json("mobile", mobile));
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
