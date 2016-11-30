package com.xnjr.moom.front.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.xnjr.moom.front.ao.IGeneralAO;
import com.xnjr.moom.front.ao.IUserAO;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.http.PostSimulater;
import com.xnjr.moom.front.localToken.TokenDO;
import com.xnjr.moom.front.session.SessionUser;
import com.xnjr.moom.front.util.HttpKit;

@Controller
@RequestMapping(value = "/auth2/login")
public class OAuth2LoginController extends BaseController {
	@Autowired
	protected IUserAO userAO;
	@Autowired
	private IGeneralAO generalAO;

	// 登录过程涉及的请求URL
	public static final String GET_TOKEN_URL = "https://api.weibo.com/oauth2/access_token";
	public static final String GET_OPENID_URL = "https://graph.qq.com/oauth2.0/me";
	public static final String GET_USER_INFO_URL = "https://api.weibo.com/2/users/show.json";

	public static final String WX_TOKEN_URL = "https://api.weixin.qq.com/sns/oauth2/access_token";
	// public static final String WX_OPENID_URL =
	// "https://graph.qq.com/oauth2.0/me";
	public static final String WX_USER_INFO_URL = "https://api.weixin.qq.com/sns/userinfo";

	// 一些公用的请求参数
	public static final String APP_ID = "2789943235";
	public static final String APP_KEY = "518eb762076e998369bbce098c0415b3";

	public static final String WX_APP_ID = "wxef7fda595f81f6d6";
	public static final String WX_APP_KEY = "057815f636178d3a81c3b065f395a209";

	public static final String STATE = "register";

	@RequestMapping(value = "/wx", method = RequestMethod.GET)
	@ResponseBody
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Object wxLogin(@RequestParam Map<String, String> map,
			HttpServletRequest request) {
		// Step1：从回调URL中获取Authorization Code
		String authCode = (String) map.get("code");
		String appId = "";
		String companyCode = (String) map.get("companyCode");
		String appKey = "";
		if (StringUtils.isBlank(authCode)) {
			// TokenDO tokenDO = new TokenDO();
			// tokenDO.setUserId("");
			// tokenDO.setTokenId("");
			// tokenDO.setIsExist("0");
			// return false;
			throw new BizException("10002", "微信授权失败");
		} else if (StringUtils.isBlank(companyCode)) {
			throw new BizException("10002", "未传入公司信息，导致微信授权失败");
		}
		Map[] pwdListMap = generalAO.queryPasswordList("", "", companyCode);
		for (int i = 0; i < pwdListMap.length; i++) {
			if (pwdListMap[i].get("account").equals("AppID")) {
				appId = (String) pwdListMap[i].get("password");
			} else if (pwdListMap[i].get("account").equals("AppSecret")) {
				appKey = (String) pwdListMap[i].get("password");
			}
		}
		if (StringUtils.isBlank(appId) || StringUtils.isBlank(appKey)) {
			throw new BizException("10002", "公司暂无微信登录资质");
		}
		// Step2：通过Authorization Code获取Access Token
		String accessToken = "";
		Map<String, String> queryParas = new HashMap<>();
		Map res = new HashMap<>();
		Map wxRes = new HashMap<>();

		Properties formProperties = new Properties();
		formProperties.put("grant_type", "authorization_code");
		formProperties.put("appid", appId);
		formProperties.put("secret", appKey);
		formProperties.put("code", authCode);
		String response;
		try {
			response = PostSimulater.requestPostForm(WX_TOKEN_URL,
					formProperties);
			res = getMapFromResponse(response);
			accessToken = (String) res.get("access_token");
			if (res.get("error") != null || StringUtils.isBlank(accessToken)) {
				// TokenDO tokenDO = new TokenDO();
				// tokenDO.setUserId("");
				// tokenDO.setTokenId("");
				// tokenDO.setIsExist("0");
				// return false;
				throw new BizException("10002", "微信授权失败");
			}
			// Step3：使用Access Token来获取用户的OpenID
			String openId = "";
			String userId = "";
			openId = (String) res.get("openid");
			// 获取unionid
			queryParas = new HashMap<>();
			queryParas.put("access_token", accessToken);
			queryParas.put("openid", openId);
			queryParas.put("lang", "zh_CN");
			wxRes = getMapFromResponse(HttpKit
					.get(WX_USER_INFO_URL, queryParas));
			// String unionid = (String) wxRes.get("unionid");
			// if (StringUtils.isEmpty(unionid)) {
			// unionid = (String) wxRes.get("openid");
			// }
			String unionid = (String) wxRes.get("openid");
			// Step4：根据openId从数据库中查询用户信息（user）
			res = new HashMap<>();
			res.put("openId", unionid);
			res.put("companyCode", companyCode);
			Map[] users = BizConnecter.getBizData("805055",
					JsonUtils.mapToJson(res), Map[].class);
			Map<String, String> user = new HashMap<>();
			if (users.length != 0) {
				// Step4-1：如果user存在，说明用户授权登录过，直接登录
				user = users[0];
				userId = user.get("userId");
				if (!user.get("status").equals("0")) {
					throw new BizException("10002", "用户被锁定");
				}
				SessionUser sessionUser = new SessionUser();
				sessionUser.setUserId(userId);
				// 创建session
				setSessionUser(sessionUser);
				// TokenDO tokenDO = new TokenDO();
				// tokenDO.setUserId(userId);
				// tokenDO.setTokenId(pwdUserId(userId));
				// tokenDO.setIsExist("1");
				// tokenDO.setMobile((String) (user.get("mobile")));
				// return tokenDO;
			} else {
				// Step4-2：如果user不存在，说明用户未授权登录过，需从openAPI获取用户信息
				// queryParas = new HashMap<>();
				// queryParas.put("access_token", accessToken);
				// queryParas.put("openid", openId);
				// queryParas.put("lang", "zh_CN");
				// res = getMapFromResponse(HttpKit.get(WX_USER_INFO_URL,
				// queryParas));
				String name = (String) wxRes.get("nickname");

				user.put("openId", unionid);
				user.put("nickname", name);
				user.put("gender", ((Double) wxRes.get("sex") == 1) ? "1" : "0");
				user.put("photo", (String) wxRes.get("headimgurl"));
				user.put("companyCode", companyCode);
				user = BizConnecter.getBizData("805151",
						JsonUtils.mapToJson(user), Map.class);
				userId = user.get("userId");
				SessionUser sessionUser = new SessionUser();
				sessionUser.setUserId(userId);
				// 创建session
				setSessionUser(sessionUser);
				// TokenDO tokenDO = new TokenDO();
				// tokenDO.setUserId(userId);
				// tokenDO.setTokenId(pwdUserId(userId));
				// tokenDO.setIsExist("0");
				// tokenDO.setMobile((String) (user.get("mobile")));
				// return tokenDO;
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new BizException("10002", "微信授权失败");
		}

		// TokenDO tokenDO = new TokenDO();
		// tokenDO.setUserId("");
		// tokenDO.setTokenId("");
		// tokenDO.setIsExist("0");
		return true;

	}

	// 微博登录
	@RequestMapping(value = "/wb", method = RequestMethod.GET)
	@ResponseBody
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Object wx1Login(@RequestParam Map<String, String> map,
			HttpServletRequest request) {
		// Step1：从回调URL中获取Authorization Code
		String authCode = (String) map.get("code");
		if (StringUtils.isBlank(authCode)) {
			return false;
		}
		// Step2：通过Authorization Code获取Access Token
		String accessToken = "";
		Map<String, String> queryParas = new HashMap<>();
		Map<String, String> res;

		Properties formProperties = new Properties();
		formProperties.put("grant_type", "authorization_code");
		formProperties.put("client_id", APP_ID);
		formProperties.put("client_secret", APP_KEY);
		formProperties.put("code", authCode);
		String referer = request.getHeader("Referer");
		formProperties.put("redirect_uri", referer.split("[?]")[0]);
		System.out.println("-----------" + referer.split("[?]")[0]);
		String response;
		try {
			response = PostSimulater.requestPostForm(GET_TOKEN_URL,
					formProperties);
			res = getMapFromResponse(response);
			accessToken = res.get("access_token");
			if (res.get("error") != null || StringUtils.isBlank(accessToken)) {
				return false;
			}
			// Step3：使用Access Token来获取用户的OpenID
			String openId = "";
			String userId = "";
			openId = res.get("uid");
			// queryParas = new HashMap<>(1);
			// queryParas.put("access_token", accessToken);
			// res = getMapFromResponse(HttpKit.get(GET_OPENID_URL,
			// queryParas));
			// openId = res.get("openid");
			// if (res.get("error") != null || StringUtils.isBlank(openId)) {
			// return "redirect:/";
			// }
			// Step4：根据openId从数据库中查询用户信息（user）
			res = new HashMap<>();
			res.put("openId", openId);
			Map[] users = BizConnecter.getBizData("805055",
					JsonUtils.mapToJson(res), Map[].class);
			Map<String, String> user = new HashMap<>();
			if (users.length != 0) {
				// Step4-1：如果user存在，说明用户授权登录过，直接登录
				user = users[0];
				userId = user.get("userId");
				SessionUser sessionUser = new SessionUser();
				sessionUser.setUserId(userId);
				// 创建session
				setSessionUser(sessionUser);
				TokenDO tokenDO = new TokenDO();
				tokenDO.setUserId(userId);
				tokenDO.setTokenId(pwdUserId(userId));
				tokenDO.setIsExist("1");
				return tokenDO;
			} else {
				// Step4-2：如果user不存在，说明用户未授权登录过，需从openAPI获取用户信息
				queryParas = new HashMap<>();
				queryParas.put("access_token", accessToken);
				queryParas.put("uid", openId);
				// queryParas.put("oauth_consumer_key", APP_ID);
				// queryParas.put("openid", openId);
				res = getMapFromResponse(HttpKit.get(GET_USER_INFO_URL,
						queryParas));
				String name = (String) res.get("screen_name");

				user.put("openId", openId);
				user.put("nickname", name);
				user.put("gender",
						(res.get("gender").toString().equals("m")) ? "1" : "0");
				user.put("photo", res.get("avatar_large"));
				user = BizConnecter.getBizData("805151",
						JsonUtils.mapToJson(user), Map.class);
				userId = user.get("userId");
				SessionUser sessionUser = new SessionUser();
				sessionUser.setUserId(userId);
				// 创建session
				setSessionUser(sessionUser);
				TokenDO tokenDO = new TokenDO();
				tokenDO.setUserId(userId);
				tokenDO.setTokenId(pwdUserId(userId));
				tokenDO.setIsExist("0");
				return tokenDO;
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return false;

	}

	/**
	 * @param response
	 *            可能是Json & Jsonp字符串 & urlParas
	 *            eg：urlParas：access_token=xxx&expires_in
	 *            =7776000&refresh_token=xxx
	 * @return
	 */
	public static Map<String, String> getMapFromResponse(String response) {
		if (StringUtils.isBlank(response)) {
			return new HashMap<>();
		}

		Map<String, String> result = new HashMap<>();
		int begin = response.indexOf("{");
		int end = response.lastIndexOf("}") + 1;

		if (begin >= 0 && end > 0) {
			result = new Gson().fromJson(response.substring(begin, end),
					new TypeToken<Map<String, Object>>() {
					}.getType());
		} else {
			String[] paras = response.split("&");
			for (String para : paras) {
				result.put(para.split("=")[0], para.split("=")[1]);
			}
		}

		return result;
	}

}
