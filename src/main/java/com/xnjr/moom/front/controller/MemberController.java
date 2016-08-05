package com.xnjr.moom.front.controller;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IAccountAO;
import com.xnjr.moom.front.ao.IBankCardAO;
import com.xnjr.moom.front.ao.ISmsAO;
import com.xnjr.moom.front.ao.IUserAO;
import com.xnjr.moom.front.base.ControllerContext;
import com.xnjr.moom.front.captcha.MyCaptchaService;
import com.xnjr.moom.front.enums.ETermType;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.localToken.UserDAO;
import com.xnjr.moom.front.res.XN805043Res;
import com.xnjr.moom.front.res.XN805056Res;
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
    IBankCardAO bankCardAO;

    @Autowired
    ISmsAO smsAO;

    @Resource(name = "imageCaptchaService")
    private MyCaptchaService imageCaptchaService;

    // ****主流程start************
    @RequestMapping(value = "/mobile/check", method = RequestMethod.POST)
    @ResponseBody
    public Object checkMobileExist(@RequestParam("loginName") String mobile) {
        return userAO.checkMobileExit(mobile);
    }

    @RequestMapping(value = "/regist", method = RequestMethod.POST)
    @ResponseBody
    public Object doRegister(
            @RequestParam("loginName") String mobile,
            @RequestParam("loginPwd") String loginPwd,
            @RequestParam("smsCaptcha") String smsCaptcha,
            @RequestParam("captcha") String captcha,
            @RequestParam(value = "userReferee", required = false) String userReferee) {

        String sessionId = ControllerContext.getRequest().getSession().getId();
        boolean flag = imageCaptchaService.validateResponseForID(sessionId,
            captcha);
        imageCaptchaService.removeCaptcha(sessionId);
        if (!flag) { // 验证码正确
            throw new BizException("83099901", "图片验证码不正确");
        }
        return userAO.doRegister(mobile, loginPwd, userReferee, smsCaptcha);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public Object doLogin(@RequestParam("loginName") String loginName,
            @RequestParam("loginPwd") String loginPwd,
            @RequestParam("terminalType") String terminalType) {
        XN805043Res res = userAO.doLogin(loginName, loginPwd);
        XN805056Res res1 = userAO.doGetUser(res.getUserId());
        if (ETermType.WEB.getCode().equals(terminalType)) {
            SessionUser sessionUser = new SessionUser();
            sessionUser.setUserId(res.getUserId());
            sessionUser.setKind(res1.getKind());
            // 创建session
            setSessionUser(sessionUser);
        }/*
          * else if (ETermType.APP.getCode().equals(terminalType)) { TokenDO
          * tokenDO = new TokenDO(); String userId = res.getUserId(); //
          * userId是否存在 User user = userDAO.getUser(userId); if (user != null) {
          * userDAO.del(userId); } String tokenId =
          * OrderNoGenerater.generateM(userId); // userId,tokenId保存在本地 User
          * userdo = new User(); userdo.setUserId(userId);
          * userdo.setTokenId(tokenId); userDAO.saveUser(userdo);
          * tokenDO.setTokenId(tokenId); tokenDO.setUserId(userId); // return
          * tokenDO给app客户端 return tokenDO; }
          */
        return true;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public XN805056Res doGetUser(
            @RequestParam(value = "userId", required = false) String userId) {
        return userAO.doGetUser(getSessionUserId(userId));
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
        return userAO.addAddress(getSessionUserId(userId), addressee, mobile,
            province, city, district, detailAddress, isDefault);
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
        return userAO.editAddress(code, getSessionUserId(userId), addressee,
            mobile, province, city, district, detailAddress, isDefault);
    }

    @RequestMapping(value = "/edit/setDefaultAddress", method = RequestMethod.POST)
    @ResponseBody
    public Object setDefaultAddress(@RequestParam("code") String code,
            @RequestParam(value = "userId", required = false) String userId) {
        return userAO.setDefaultAddress(code, getSessionUserId(userId));
    }

    @RequestMapping(value = "/queryAddresses", method = RequestMethod.GET)
    @ResponseBody
    public Object queryAddresses(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "isDefault", required = false) String isDefault) {
        return userAO.queryAddresses(code, getSessionUserId(userId), isDefault);
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

    // ****银行卡start**********
    @RequestMapping(value = "/bankcard/bind", method = RequestMethod.POST)
    @ResponseBody
    public boolean doBindBankCard(
            @RequestParam("bankCode") String bankCode,
            @RequestParam("bankcardNo") String bankcardNo,
            @RequestParam(value = "subbranch", required = false) String subbranch,
            @RequestParam(value = "userId", required = false) String userId) {
        // 验证是否实名
        String uId = getSessionUserId(userId);
        boolean flag = userAO.doIdentityCheck(uId);
        // 三方验证和保存用户卡 未完待续
        bankCardAO.doBindBankCard(uId, bankCode, bankcardNo, subbranch);
        flag = true;
        return flag;
    }

    @RequestMapping(value = "/bankcard/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryBankCardList(
            @RequestParam(value = "userId", required = false) String userId) {
        return bankCardAO.queryBankCardList(getSessionUserId(userId));
    }

    @RequestMapping(value = "/bankcard/page", method = RequestMethod.GET)
    @ResponseBody
    public Object queryBankCardPage(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "start", required = false) String start,
            @RequestParam(value = "limit", required = false) String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return bankCardAO.queryBankCardPage(getSessionUserId(userId), start,
            limit, orderColumn, orderDir);
    }

    @RequestMapping(value = "/bankcard/detail", method = RequestMethod.GET)
    @ResponseBody
    public Object queryBankCard(@RequestParam(value = "id") String id) {
        return bankCardAO.doViewBankCard(id);
    }

    // 删除银行卡
    @RequestMapping(value = "/bankcard/drop", method = RequestMethod.POST)
    @ResponseBody
    public Object dropBankCard(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "userId", required = false) String userId) {
        return bankCardAO.doDropBankCard(id, getSessionUserId(userId));
    }

    // 修改银行卡
    @RequestMapping(value = "/bankcard/edit", method = RequestMethod.POST)
    @ResponseBody
    public Object editBankCard(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "bankCode", required = false) String bankCode,
            @RequestParam(value = "subbranch", required = false) String subbranch,
            @RequestParam(value = "bankCardNo", required = false) String bankCardNo,
            @RequestParam(value = "userId", required = false) String userId) {
        return bankCardAO.doEditBankCard(id, getSessionUserId(userId),
            bankCode, bankCardNo, subbranch);
    }

    // ****银行卡end**********

    // ****登陆密码start******
    @RequestMapping(value = "/loginpwd/reset", method = RequestMethod.POST)
    @ResponseBody
    public boolean doResetLoginPwd(@RequestParam("oldLoginPwd") String oldPwd,
            @RequestParam("newLoginPwd") String newPwd,
            @RequestParam(value = "userId", required = false) String userId) {
        userAO.doResetLoginPwd(getSessionUserId(userId), oldPwd, newPwd);
        // 重新登陆
        return logout();
    }

    @RequestMapping(value = "/loginpwd/find", method = RequestMethod.POST)
    @ResponseBody
    public boolean doFindLoginPwd(@RequestParam("mobile") String mobile,
            @RequestParam("smsCaptcha") String smsCaptcha,
            @RequestParam("newLoginPwd") String newLoginPwd) {
        userAO.doFindLoginPwd(mobile, newLoginPwd, smsCaptcha);
        return true;
    }

    // ****登陆密码end******
    // ****交易密码start****
    @RequestMapping(value = "/tradepwd/set", method = RequestMethod.POST)
    @ResponseBody
    public boolean doSetTradePwd(@RequestParam("tradePwd") String tradePwd,
            @RequestParam("smsCaptcha") String smsCaptcha,
            @RequestParam(value = "userId", required = false) String userId) {
        userAO.doSetTradePwd(getSessionUserId(userId), tradePwd, smsCaptcha);
        return true;
    }

    @RequestMapping(value = "/tradepwd/reset", method = RequestMethod.POST)
    @ResponseBody
    public boolean doResetTradePwd(
            @RequestParam("oldTradePwd") String oldTradePwd,
            @RequestParam("newTradePwd") String newTradePwd,
            @RequestParam(value = "userId", required = false) String userId) {
        userAO.doResetTradePwd(getSessionUserId(userId), oldTradePwd,
            newTradePwd);
        return true;
    }

    @RequestMapping(value = "/tradepwd/find", method = RequestMethod.POST)
    @ResponseBody
    public boolean doFindTradePwd(
            @RequestParam("newTradePwd") String newTradePwd,
            @RequestParam("smsCaptcha") String smsCaptcha,
            @RequestParam(value = "userId", required = false) String userId) {
        userAO
            .doFindTradePwd(getSessionUserId(userId), newTradePwd, smsCaptcha);
        return true;
    }

    // ****交易密码end****
    // **** 换手机号start************
    @RequestMapping(value = "/mobile/change", method = RequestMethod.POST)
    @ResponseBody
    public boolean doChangeMobile(@RequestParam("newMobile") String newMobile,
            @RequestParam("smsCaptcha") String smsCaptcha,
            @RequestParam("tradePwd") String tradePwd,
            @RequestParam(value = "userId", required = false) String userId) {

        userAO.doChangeMoblie(getSessionUserId(userId), newMobile, smsCaptcha,
            tradePwd);
        return true;
    }

    // **** 换手机号end************
    @RequestMapping(value = "/kyc", method = RequestMethod.GET)
    @ResponseBody
    public Object doKyc(
            @RequestParam(value = "userId", required = false) String userId) {
        return userAO.doKyc(getSessionUserId(userId));
    }

}
