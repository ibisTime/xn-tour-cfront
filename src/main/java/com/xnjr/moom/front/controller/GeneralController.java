/**
 * @Title GeneralController.java 
 * @Package com.ibis.pz.controller.others 
 * @Description 
 * @author miyb  
 * @date 2015-3-22 下午8:23:09 
 * @version V1.0   
 */
package com.xnjr.moom.front.controller;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IDictAO;
import com.xnjr.moom.front.ao.IGeneralAO;
import com.xnjr.moom.front.ao.ISmsAO;
import com.xnjr.moom.front.base.ControllerContext;
import com.xnjr.moom.front.captcha.MyCaptchaService;
import com.xnjr.moom.front.enums.ESmsBizType;
import com.xnjr.moom.front.exception.BizException;

@Controller
@RequestMapping(value = "/gene")
public class GeneralController extends BaseController {
	@Autowired
	ISmsAO smsAO;

	@Autowired
	IDictAO dictAO;

	@Autowired
	IGeneralAO generalAO;

	@Resource(name = "imageCaptchaService")
	private MyCaptchaService imageCaptchaService;

	// ****发送短信验证码start*******

	@RequestMapping(value = "/register/send", method = RequestMethod.POST)
	@ResponseBody
	public boolean sendRegisterCode(@RequestParam("mobile") String mobile,
			@RequestParam("captcha") String captcha) {
		String sessionId = ControllerContext.getRequest().getSession().getId();
		boolean flag = imageCaptchaService.validateResponseForID(sessionId,
				captcha);
		imageCaptchaService.removeCaptcha(sessionId);
		if (!flag) { // 验证码正确
			throw new BizException("83099901", "图片验证码不正确");
		}
		sendPhoneCode(ESmsBizType.REGISTER.getCode(), mobile);
		return true;
	}

	@RequestMapping(value = "/findloginpwd/send", method = RequestMethod.POST)
	@ResponseBody
	public boolean sendLoginpwdCode(@RequestParam("mobile") String mobile) {
		sendPhoneCode(ESmsBizType.FINDLOGINPWD.getCode(), mobile);
		return true;
	}

	@RequestMapping(value = "/changemobile/send", method = RequestMethod.POST)
	@ResponseBody
	public boolean sendChangeMobileCode(@RequestParam("mobile") String mobile) {
		sendPhoneCode(ESmsBizType.CHANGEMOBILE.getCode(), mobile);
		return true;
	}

	@RequestMapping(value = "/settradepwd/send", method = RequestMethod.POST)
	@ResponseBody
	public boolean sendSetTradePwdCode(@RequestParam("mobile") String mobile) {
		sendPhoneCode(ESmsBizType.SETTRADEPWD.getCode(), mobile);
		return true;
	}

	@RequestMapping(value = "/findtradepwd/send", method = RequestMethod.POST)
	@ResponseBody
	public boolean sendFindTradePwdCode(@RequestParam("mobile") String mobile) {
		sendPhoneCode(ESmsBizType.FINDTRADEPWD.getCode(), mobile);
		return true;
	}

	@RequestMapping(value = "/bindmobile/send", method = RequestMethod.POST)
	@ResponseBody
	public boolean bindMobileCode(@RequestParam("mobile") String mobile) {
		sendPhoneCode(ESmsBizType.BINDMOBILE.getCode(), mobile);
		return true;
	}

	private void sendPhoneCode(String bizType, String mobile) {
		smsAO.sendSmsCaptcha(mobile, bizType);
	}

	// 通过url找到company
	@RequestMapping(value = "/byUrl", method = RequestMethod.GET)
	@ResponseBody
	public Object getCompanyByUrl(@RequestParam("url") String url) {
		return generalAO.getCompanyByUrl(url);
	}

	// 数据字典
	@RequestMapping(value = "/dict", method = RequestMethod.GET)
	@ResponseBody
	public Object getDict(
			@RequestParam(value = "type", required = false) String type,
			@RequestParam(value = "parentKey", required = false) String parentKey,
			@RequestParam(value = "dkey", required = false) String dkey) {
		return dictAO.queryDictList(type, parentKey, dkey);
	}

	// 数据字典
	@RequestMapping(value = "/sys/config", method = RequestMethod.GET)
	@ResponseBody
	public Object getSysConfig(
			@RequestParam(value = "ckey", required = false) String ckey,
			@RequestParam(value = "start", required = true) String start,
			@RequestParam(value = "limit", required = true) String limit,
			@RequestParam(value = "orderColumn", required = false) String orderColumn,
			@RequestParam(value = "orderDir", required = false) String orderDir) {
		return dictAO.querySysConfig(this.getSessionUser().getUserId(), ckey,
				start, limit, orderColumn, orderDir);
	}

	// 分页查询广播
	@RequestMapping(value = "/broadcast/page", method = RequestMethod.GET)
	@ResponseBody
	public Object getPageBroadcast(
			@RequestParam(value = "title", required = false) String title,
			@RequestParam(value = "toCompany", required = true) String toCompany,
			@RequestParam(value = "toLevel", required = false) String toLevel,
			@RequestParam(value = "toUser", required = false) String toUser,
			@RequestParam(value = "companyCode", required = false) String companyCode,
			@RequestParam(value = "updater", required = false) String updater,
			@RequestParam(value = "start", required = true) String start,
			@RequestParam(value = "limit", required = true) String limit) {
		return generalAO.getPageBroadcast(title, toCompany, toLevel, toUser,
				companyCode, updater, start, limit);
	}

	// 详情查询广播
	@RequestMapping(value = "/broadcast/info", method = RequestMethod.GET)
	@ResponseBody
	public Object getBroadcastInfo(
			@RequestParam(value = "code", required = true) String code) {
		return generalAO.getBroadcastInfo(code);
	}

	// 根据key查询配置
	@RequestMapping(value = "/info/key", method = RequestMethod.GET)
	@ResponseBody
	public Object getInfoByKey(
			@RequestParam(value = "key", required = true) String key,
			@RequestParam(value = "companyCode", required = true) String companyCode) {
		return generalAO.getInfoByKey(key, companyCode);
	}

	// 列表查询密码记录(微信公众号配置)
	@RequestMapping(value = "/pwd/list", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPasswordList(
			@RequestParam(value = "type", required = false) String type,
			@RequestParam(value = "account", required = true) String account,
			@RequestParam(value = "companyCode", required = false) String companyCode) {
		// 控制前端只能取appid
		if (!account.equals("AppID")) {
			return false;
		}
		return generalAO.queryPasswordList(type, account, companyCode);
	}
}
