package com.xnjr.moom.front.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IAccountAO;
import com.xnjr.moom.front.ao.IUserAO;
import com.xnjr.moom.front.enums.EBoolean;
import com.xnjr.moom.front.res.Page;

/** 
 * @author: miyb 
 * @since: 2015-4-14 下午1:41:46 
 * @history:
 */
@Controller
@RequestMapping(value = "/account")
public class AccountController extends BaseController {
    @Autowired
    IAccountAO accountAO;

    @Autowired
    IUserAO userAO;

    // *********查询账户资产 start****
    @RequestMapping(value = "/get", method = RequestMethod.GET)
    @ResponseBody
    public Object getAccount(
            @RequestParam(value = "userId", required = false) String userId) {
        return accountAO.getAccountByUserId(getSessionUserId(userId));
    }

    // *********查询账户资产 end****

    // 分页查询账户资料
    @RequestMapping(value = "infos/page", method = RequestMethod.GET)
    @ResponseBody
    public Object getAccountPageInfos(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "accountNumber", required = false) String accountNumber,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "realName", required = false) String realName,
            @RequestParam(value = "dateStart", required = false) String dateStart,
            @RequestParam(value = "dateEnd", required = false) String dateEnd,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit) {
        return accountAO.getAccountPageInfos(getSessionUserId(userId),
            accountNumber, status, realName, dateStart, dateEnd, start, limit);
    }

    // *********查询资金明细start****
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/detail/page", method = RequestMethod.GET)
    @ResponseBody
    public Object queryAccountDetail(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "accountNumber", required = false) String accountNumber,
            @RequestParam(value = "ajNo", required = false) String ajNo,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "bizType", required = false) String bizType,
            @RequestParam(value = "dateStart", required = false) String dateStart,
            @RequestParam(value = "dateEnd", required = false) String dateEnd) {
        return accountAO.queryAccountDetail(getSessionUserId(userId),
            accountNumber, ajNo, start, limit, bizType, dateStart, dateEnd);
    }

    // *********查询资金明细end****

    // *********查询冻结明细start****
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/frozen/detail/page", method = RequestMethod.POST)
    @ResponseBody
    public Page queryFrozenDetail(
            @RequestParam(value = "bizType", required = false) String bizType,
            @RequestParam(value = "dateStart", required = false) String dateStart,
            @RequestParam(value = "dateEnd", required = false) String dateEnd,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return accountAO.queryFrozenDetail(getSessionUser().getAccountNumber(),
            bizType, dateStart, dateEnd, start, limit, orderColumn, orderDir);
    }

    // *********查询冻结明细end****

    // *********查询充值取现start****
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/randw/page", method = RequestMethod.POST)
    @ResponseBody
    public Page queryRechargeAndWithdraw(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "dateStart", required = false) String dateStart,
            @RequestParam(value = "dateEnd", required = false) String dateEnd,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return accountAO.queryRechargeAndWithdraw(getSessionUser()
            .getAccountNumber(), status, dateStart, dateEnd, start, limit,
            orderColumn, orderDir);
    }

    // *********查询充值取现end****

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/doWithdraw", method = RequestMethod.POST)
    @ResponseBody
    public Object withdraw(@RequestParam("accountNumber") String accountNumber,
            @RequestParam("amount") String amount,
            @RequestParam("toType") String toType,
            @RequestParam("toCode") String toCode,
            @RequestParam("toBelong") String toBelong,
            @RequestParam("tradePwd") String tradePwd) {
        return accountAO.withdraw(accountNumber, amount, toType, toCode,
            toBelong, tradePwd);
    }

    // *********获取银行列表 start****

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/bank/list", method = RequestMethod.GET)
    @ResponseBody
    public List queryBankList(@RequestParam("channelNo") String channelNo) {
        return accountAO.queryBankList(channelNo, EBoolean.YES.getCode());
    }

    // *********获取银行列表 end****
    // 获取用户累计本金和累计收益
    @RequestMapping(value = "/sumpp", method = RequestMethod.GET)
    @ResponseBody
    public Object getSumPP(
            @RequestParam(value = "userId", required = false) String userId) {
        return accountAO.getSumPP(getSessionUserId(userId));
    }

}
