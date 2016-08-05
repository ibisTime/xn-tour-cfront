package com.xnjr.moom.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IBankCardAO;
import com.xnjr.moom.front.ao.ICompanyAO;
import com.xnjr.moom.front.ao.IUserAO;

@Controller
@RequestMapping(value = "/company")
public class CompanyController extends BaseController {
    @Autowired
    ICompanyAO companyAO;

    @Autowired
    IBankCardAO bankCardAO;

    @Autowired
    IUserAO userAO;

    // 申请列表
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    @ResponseBody
    public Object queryCompanyList(
            @RequestParam(value = "userId", required = false) String userId) {
        return companyAO.queryCompanyList(getSessionUserId(userId));
    }

    @RequestMapping(value = "/page", method = RequestMethod.GET)
    @ResponseBody
    public Object queryCompanyPage(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return companyAO.queryCompanyPage(getSessionUserId(userId), start,
            limit, orderColumn, orderDir);
    }

    // 真正隶属列表
    @RequestMapping(value = "/real/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryRealCompanyList(
            @RequestParam(value = "userId", required = false) String userId) {
        return companyAO.queryRealCompanyList(userId);
    }

    @RequestMapping(value = "/detail", method = RequestMethod.POST)
    @ResponseBody
    public Object getCompany(@RequestParam("code") String code,
    		@RequestParam(value = "userId", required = false) String userId) {
        return companyAO.getCompany(code, getSessionUser()
                .getUserId());
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public Object addCompany(
            @RequestParam("name") String name,
            @RequestParam("gsyyzzNo") String gsyyzzNo,
            @RequestParam("idKind") String idKind,
            @RequestParam("idNo") String idNo,
            @RequestParam("realName") String realName,
            @RequestParam("currency") String currency, // 币种
            @RequestParam("capital") String capital,
            @RequestParam("province") String province,
            @RequestParam("city") String city,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "userId", required = false) String userId) {
        return companyAO.addCompany(name, gsyyzzNo, idKind, idNo, realName,
            currency, capital, province, city, address, getSessionUser()
                .getUserId());
    }

    @RequestMapping(value = "/addAll", method = RequestMethod.POST)
    @ResponseBody
    public Object addCompanyAndCard(
            @RequestParam("name") String name,
            @RequestParam("gsyyzzNo") String gsyyzzNo,
            @RequestParam("idKind") String idKind,
            @RequestParam("idNo") String idNo,
            @RequestParam("realName") String realName,
            @RequestParam("currency") String currency, // 币种
            @RequestParam("capital") String capital,
            @RequestParam("province") String province,
            @RequestParam("city") String city,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("bankCode") String bankCode,
            @RequestParam("subbranch") String subbranch,
            @RequestParam("cardNo") String cardNo) {
        return companyAO.addCompanyAndCard(name, gsyyzzNo, idKind, idNo,
            realName, currency, capital, province, city, address,
            getSessionUser().getUserId(), bankCode, subbranch, cardNo);
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public Object editCompany(
            @RequestParam("code") String code,
            @RequestParam("name") String name,
            @RequestParam("gsyyzzNo") String gsyyzzNo,
            @RequestParam("idKind") String IDKind,
            @RequestParam("idNo") String idNo,
            @RequestParam("realName") String realName,
            @RequestParam("currency") String currency, // 币种
            @RequestParam("capital") String capital,
            @RequestParam("province") String province,
            @RequestParam("city") String city,
            @RequestParam(value = "address", required = false) String address) {
        return companyAO.editCompany(code, name, gsyyzzNo, IDKind, idNo,
            realName, currency, capital, province, city, address);
    }

    @RequestMapping(value = "/picture/upload", method = RequestMethod.POST)
    @ResponseBody
    public Object uploadCompanyPicture(
            @RequestParam("code") String code,
            @RequestParam("gsyyzzPicture") String gsyyzzPicture,
            @RequestParam("zzjgdmzPicture") String zzjgdmzPicture,
            @RequestParam("swdjzPicture") String swdjzPicture,
            @RequestParam("dzzPicture") String dzzPicture,
            @RequestParam("sqghPicture") String sqghPicture,
            @RequestParam("frPicture") String frPicture,
            @RequestParam(value = "otherPicture", required = false) String otherPicture,
            @RequestParam(value = "userId", required = false) String userId) {
        companyAO.uploadCompanyPicture(code, gsyyzzPicture, zzjgdmzPicture,
            swdjzPicture, dzzPicture, frPicture, otherPicture);
        companyAO.applyCompany(getSessionUserId(userId), code, sqghPicture);
        return true;
    }

    @RequestMapping(value = "/exist", method = RequestMethod.GET)
    @ResponseBody
    public Object isExistCompany(@RequestParam("name") String name,
            @RequestParam("gsyyzzNo") String gsyyzzNo) {
        return companyAO.isExistCompany(name, gsyyzzNo);
    }

    @RequestMapping(value = "/letter/add", method = RequestMethod.POST)
    @ResponseBody
    public Object applyCompany(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("companyCode") String companyCode,
            @RequestParam("sqghPicture") String sqghPicture) {
        return companyAO.applyCompany(getSessionUserId(userId), companyCode,
            sqghPicture);
    }

    @RequestMapping(value = "/letter/list", method = RequestMethod.GET)
    @ResponseBody
    public Object applyCompanyLetterList(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("companyCode") String companyCode,
            @RequestParam(value = "status", required = false) String status) {
        return companyAO.companyLetterList(getSessionUserId(userId),
            companyCode, status);
    }

    @RequestMapping(value = "/bankcard/bind", method = RequestMethod.POST)
    @ResponseBody
    public Object doBindBankCard(
            @RequestParam("companyCode") String companyCode,
            @RequestParam("bankCode") String bankCode,
            @RequestParam("cardNo") String cardNo,
            @RequestParam("subbranch") String subbranch) {
        return bankCardAO.doBindCompanyBankCard(companyCode, bankCode, cardNo,
            subbranch);
    }

    @RequestMapping(value = "/bankcard/edit", method = RequestMethod.POST)
    @ResponseBody
    public Object doEditBankCard(@RequestParam("id") String id,
            @RequestParam("bankCode") String bankCode,
            @RequestParam("cardNo") String cardNo,
            @RequestParam("subbranch") String subbranch) {
        return bankCardAO
            .doEditCompanyBankCard(id, bankCode, cardNo, subbranch);
    }

    @RequestMapping(value = "/bankcard/detail", method = RequestMethod.GET)
    @ResponseBody
    public Object doViewBankCard(@RequestParam("id") String id) {
        return bankCardAO.viewCompanyBankCard(id);

    }

    @RequestMapping(value = "/bankcard/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryBankCardList(
            @RequestParam("companyCode") String companyCode) {
        return bankCardAO.queryCompanyBankCardList(companyCode);
    }

    @RequestMapping(value = "/bankcard/page", method = RequestMethod.GET)
    @ResponseBody
    public Object queryBankCardPage(
            @RequestParam("companyCode") String companyCode,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return bankCardAO.queryCompanyBankCardPage(companyCode, start, limit,
            orderColumn, orderDir);
    }
}
