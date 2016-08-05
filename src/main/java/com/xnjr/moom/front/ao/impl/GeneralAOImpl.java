package com.xnjr.moom.front.ao.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IGeneralAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.StatusReq;
import com.xnjr.moom.front.req.XNlh5034Req;
import com.xnjr.moom.front.res.XNlh5034Res;

@Service
public class GeneralAOImpl implements IGeneralAO {

    @Override
    public List queryBanks(String status, String orderColumn, String orderDir) {
        StatusReq req = new StatusReq();
        req.setStatus(status);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        return BizConnecter.getBizData("bk2004", JsonUtils.object2Json(req),
            List.class);
    }

    public XNlh5034Res queryUrl(String key) {
        XNlh5034Req req = new XNlh5034Req();
        req.setKey(key);
        return BizConnecter.getBizData("lh5034", JsonUtils.object2Json(req),
            XNlh5034Res.class);
    }

}
