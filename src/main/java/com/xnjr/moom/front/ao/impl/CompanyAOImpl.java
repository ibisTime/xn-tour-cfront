package com.xnjr.moom.front.ao.impl;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.ICompanyAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN801300Req;
import com.xnjr.moom.front.req.XNfd2030Req;
import com.xnjr.moom.front.req.XNfd2031Req;
import com.xnjr.moom.front.req.XNfd2032Req;
import com.xnjr.moom.front.req.XNfd2042Req;
import com.xnjr.moom.front.req.XNfd2045Req;
import com.xnjr.moom.front.req.XNfd2060Req;
import com.xnjr.moom.front.req.XNfd2064Req;
import com.xnjr.moom.front.res.XN801300Res;
import com.xnjr.moom.front.util.UploadUtil;

@Service
public class CompanyAOImpl implements ICompanyAO {

    @Override
    public Object addCompany(String name, String gsyyzzNo, String idKind,
            String idNo, String realName, String currency, String capital,
            String province, String city, String address, String userId) {
        XNfd2030Req req = new XNfd2030Req();
        req.setName(name);
        req.setGsyyzzNo(gsyyzzNo);
        req.setIdKind(idKind);
        req.setIdNo(idNo);
        req.setRealName(realName);
        req.setCapital(capital);
        req.setProvince(province);
        req.setCity(city);
        req.setCurrency(currency);
        req.setAddress(address);
        req.setApplyUser(userId);
        return BizConnecter.getBizData("fd2030", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public Object addCompanyAndCard(String name, String gsyyzzNo,
            String idKind, String idNo, String realName, String currency,
            String capital, String province, String city, String address,
            String userId, String bankCode, String subbranch, String cardNo) {
        XNfd2045Req req = new XNfd2045Req();
        req.setName(name);
        req.setGsyyzzNo(gsyyzzNo);
        req.setIdKind(idKind);
        req.setIdNo(idNo);
        req.setRealName(realName);
        req.setCapital(capital);
        req.setProvince(province);
        req.setCity(city);
        req.setCurrency(currency);
        req.setAddress(address);
        req.setApplyUser(userId);
        req.setBankCode(bankCode);
        req.setSubbranch(subbranch);
        req.setCardNo(cardNo);
        return BizConnecter.getBizData("fd2045", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public String addCompanyInfo(String companyName, String licenceNo,
            String idNo, String realName, String capital, String province,
            String city, String IDKind, String currency, String address,
            String userId) {
        XN801300Req req = new XN801300Req();
        req.setCompanyName(companyName);
        req.setLicenceNo(licenceNo);
        req.setIdKind(IDKind);
        req.setIdNo(idNo);
        req.setRealName(realName);
        req.setCapital(capital);
        req.setProvince(province);
        req.setCity(city);
        req.setCurrency(currency);
        req.setAddress(address);
        req.setApplyUser(userId);
        XN801300Res res = BizConnecter.getBizData("801300",
            JsonUtils.object2Json(req), XN801300Res.class);
        return res.getCompanyId();
    }

    @Override
    public Object editCompany(String code, String name, String gsyyzzNo,
            String idKind, String idNo, String realName, String currency,
            String capital, String province, String city, String address) {
        XNfd2032Req req = new XNfd2032Req();
        req.setCode(code);
        req.setName(name);
        req.setGsyyzzNo(gsyyzzNo);
        req.setIdKind(idKind);
        req.setIdNo(idNo);
        req.setRealName(realName);
        req.setCapital(capital);
        req.setProvince(province);
        req.setCity(city);
        req.setCurrency(currency);
        req.setAddress(address);
        return BizConnecter.getBizData("fd2032", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public Object uploadCompanyPicture(String code, String gsyyzzPicture,
            String zzjgdmzPicture, String swdjzPicture, String dzzPicture,
            String frPicture, String otherPicture) {
        XNfd2031Req req = new XNfd2031Req();
        req.setCode(code);
        req.setGsyyzzPicture(uploadPicture(gsyyzzPicture));
        req.setZzjgdmzPicture(uploadPicture(zzjgdmzPicture));
        req.setSwdjzPicture(uploadPicture(swdjzPicture));
        req.setDzzPicture(uploadPicture(dzzPicture));

        req.setFrPicture(uploadPicture(frPicture));
        req.setOtherPicture(uploadPicture(otherPicture));
        return BizConnecter.getBizData("fd2031", JsonUtils.object2Json(req),
            Object.class);

    }

    private String uploadPicture(String picture) {
        Pattern pattern = Pattern.compile("data:image/(.+?);base64");
        Matcher matcher = pattern.matcher(picture);
        if (!matcher.find()) {
            return picture;
        }
        return UploadUtil.uploadPicture(picture);
    }

    @Override
    public Object queryCompanyList(String userId) {
        return BizConnecter.getBizData("fd2033",
            JsonUtils.string2Json("userId", userId), Object.class);
    }

    @Override
    public Object getCompany(String code, String userId) {
        return BizConnecter.getBizData("fd2034","{\"companyCode\":\"" + code
                + "\", \"userId\":\"" + userId + "\"}", Object.class);
    }

    @Override
    public Object applyCompany(String userId, String companyCode,
            String sqghPicture) {
        XNfd2060Req req = new XNfd2060Req();
        req.setCompanyCode(companyCode);
        req.setSqghPicture(uploadPicture(sqghPicture));
        req.setUserId(userId);

        return BizConnecter.getBizData("fd2060", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public Object queryRealCompanyList(String userId) {
        return BizConnecter.getBizData("fd2061",
            JsonUtils.string2Json("userId", userId), Object.class);
    }

    @Override
    public Object companyLetterList(String userId, String companyCode,
            String status) {
        XNfd2064Req req = new XNfd2064Req();
        req.setUserId(userId);
        req.setCompanyCode(companyCode);
        req.setStatus(status);

        return BizConnecter.getBizData("fd2064", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public Object isExistCompany(String name, String gsyyzzNo) {
        return BizConnecter.getBizData("fd2040", "{\"name\":\"" + name
                + "\", \"gsyyzzNo\":\"" + gsyyzzNo + "\"}", Object.class);
    }

    @Override
    public Object queryCompanyPage(String userId, String start, String limit,
            String orderColumn, String orderDir) {
        XNfd2042Req req = new XNfd2042Req();
        req.setUserId(userId);
        req.setStart(start);
        req.setLimit(limit);
        return BizConnecter.getBizData("fd2042", JsonUtils.object2Json(req),
            Object.class);
    }

}
