/**
 * @Title GeneralController.java 
 * @Package com.ibis.pz.controller.others 
 * @Description 
 * @author miyb  
 * @date 2015-3-22 下午8:23:09 
 * @version V1.0   
 */
package com.xnjr.moom.front.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IDictAO;
import com.xnjr.moom.front.ao.IGeneralAO;
import com.xnjr.moom.front.ao.ISmsAO;
import com.xnjr.moom.front.ao.IUserAO;
import com.xnjr.moom.front.enums.ESmsBizType;
import com.xnjr.moom.front.res.XN805056Res;

/** 
 * @author: miyb 
 * @since: 2015-3-22 下午8:23:09 
 * @history:
 */
@Controller
@RequestMapping(value = "/gene")
public class GeneralController extends BaseController {
    @Autowired
    ISmsAO smsAO;

    @Autowired
    IUserAO userAO;

    @Autowired
    IDictAO dictAO;
    
    @Autowired
    IGeneralAO generalAO;

    // ****发送短信验证码start*******

    @RequestMapping(value = "/smscaptcha/send", method = RequestMethod.POST)
    @ResponseBody
    public boolean sendSmsCaptcha(@RequestParam("bizType") String bizType) {
    	XN805056Res user = userAO.doGetUser(this.getSessionUser().getUserId());
        sendPhoneCode(bizType, user.getMobile());
        return true;
    }

    @RequestMapping(value = "/register/send", method = RequestMethod.POST)
    @ResponseBody
    public boolean sendRegisterCode(@RequestParam("mobile") String mobile) {
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

    private void sendPhoneCode(String bizType, String mobile) {
        smsAO.sendSmsCaptcha(mobile, bizType);
    }

    // dict data
    @RequestMapping(value = "/dict", method = RequestMethod.GET)
    @ResponseBody
    public List getDict(@RequestParam("type") String type) {
        return dictAO.queryDictList(type);
    }
    
    // 查询银行列表
    @RequestMapping(value = "/banks", method = RequestMethod.GET)
    @ResponseBody
    public List getBanks(@RequestParam(value = "status", required = false) String status,
    		@RequestParam(value = "orderColumn", required = false) String orderColumn,
    		@RequestParam(value = "orderDir", required = false) String orderDir) {
        return generalAO.queryBanks(status, orderColumn, orderDir);
    }

}
