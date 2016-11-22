package com.xnjr.moom.front.ao.impl;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IAccountAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN805310Req;

@Service
public class AccountAOImpl implements IAccountAO {
    @Override
    public Object queryAccountDetail(String userId, String start, String limit) {
        XN805310Req req = new XN805310Req();
        req.setLimit(limit);
        req.setStart(start);
        req.setUserId(userId);
        return BizConnecter.getBizData("805310", JsonUtils.object2Json(req),
            Object.class);
    }
}
