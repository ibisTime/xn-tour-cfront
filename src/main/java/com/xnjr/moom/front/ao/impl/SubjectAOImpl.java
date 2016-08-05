package com.xnjr.moom.front.ao.impl;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.ISubjectAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XNyw4029Req;
import com.xnjr.moom.front.req.XNyw4037Req;
import com.xnjr.moom.front.req.XNyw4066Req;
import com.xnjr.moom.front.req.XNyw4067Req;
import com.xnjr.moom.front.req.XNyw4082Req;

@Service
public class SubjectAOImpl implements ISubjectAO {

    @Override
    public Object querySubjectList(String userId, String status) {
        XNyw4029Req req = new XNyw4029Req();
        req.setUserId(userId);
        req.setStatus(status);
        return BizConnecter.getBizData("yw4029", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public Object queryInvestSubjectList(String userId) {
        XNyw4037Req req = new XNyw4037Req();
        req.setUserId(userId);
        return BizConnecter.getBizData("yw4037", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public Object getSubject(String userId, String subjectCode) {
        XNyw4066Req req = new XNyw4066Req();
        req.setUserId(userId);
        req.setSubjectCode(subjectCode);
        return BizConnecter.getBizData("yw4066", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public Object getBusiness(String userId, String businessCode) {
        XNyw4067Req req = new XNyw4067Req();
        req.setUserId(userId);
        req.setBusinessCode(businessCode);
        return BizConnecter.getBizData("yw4067", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public Object getContract(String contractCode) {
        XNyw4082Req req = new XNyw4082Req();
        req.setContractCode(contractCode);
        return BizConnecter.getBizData("yw4082", JsonUtils.object2Json(req),
            Object.class);
    }

}
