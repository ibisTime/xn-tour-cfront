package com.xnjr.moom.front.ao.impl;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IProjectAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XNyw4007Req;
import com.xnjr.moom.front.req.XNyw4008Req;
import com.xnjr.moom.front.req.XNyw4009Req;
import com.xnjr.moom.front.req.XNyw4020Req;
import com.xnjr.moom.front.req.XNyw4030Req;
import com.xnjr.moom.front.req.XNyw4031Req;
import com.xnjr.moom.front.req.XNyw4036Req;
import com.xnjr.moom.front.res.XNyw4020Res;
import com.xnjr.moom.front.res.XNyw4030Res;
import com.xnjr.moom.front.util.AmountUtil;

@Service
public class ProjectAOImpl implements IProjectAO {
    @Override
    public String investProject(String userId, String projectCode,
            String investAmount, String tradePwd) {
        XNyw4020Req req = new XNyw4020Req();
        req.setUserId(userId);
        req.setProjectCode(projectCode);
        req.setInvestAmount(investAmount);
        req.setTradePwd(tradePwd);
        return BizConnecter.getBizData("yw4020", JsonUtils.object2Json(req),
            XNyw4020Res.class).getCode();
    }

    /** 
     * @see com.xnjr.moom.front.ao.IProjectAO#willInvestProject(java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public String willInvestProject(String userId, String projectCode,
            String nowAmount, String nowNote, String tradePwd) {
        XNyw4030Req req = new XNyw4030Req();
        req.setUserId(userId);
        req.setProjectCode(projectCode);
        req.setNowAmount(nowAmount);
        req.setNowNote(nowNote);
        req.setTradePwd(tradePwd);
        return BizConnecter.getBizData("yw4030", JsonUtils.object2Json(req),
            XNyw4030Res.class).getCode();
    }

    /** 
     * @see com.xnjr.moom.front.ao.IProjectAO#queryMyInvestList(java.lang.String, java.lang.String)
     */
    @Override
    public Object queryMyInvestList(String userId, String status) {
        XNyw4036Req req = new XNyw4036Req();
        req.setUserId(userId);
        req.setStatus(status);
        return BizConnecter.getBizData("yw4036", JsonUtils.object2Json(req),
            Object.class);
    }

    /** 
     * @see com.xnjr.moom.front.ao.IProjectAO#queryMyWillInvestList(java.lang.String, java.lang.String)
     */
    @Override
    public Object queryMyWillInvestList(String userId, String status) {
        XNyw4031Req req = new XNyw4031Req();
        req.setUserId(userId);
        req.setStatus(status);
        return BizConnecter.getBizData("yw4031", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public Object queryProjectList(String userId, String serveId) {
        XNyw4007Req req = new XNyw4007Req();
        req.setUserId(userId);
        req.setServeId(serveId);
        return BizConnecter.getBizData("yw4007", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public Object getProject(String userId, String projectCode) {
        XNyw4008Req req = new XNyw4008Req();
        req.setUserId(userId);
        req.setProjectCode(projectCode);
        return BizConnecter.getBizData("yw4008", JsonUtils.object2Json(req),
            Object.class);
    }

    /** 
     * @see com.xnjr.moom.front.ao.IProjectAO#queryProjectPage(java.lang.String)
     */
    @Override
    public Object queryProjectPage(String userId, String start, String limit,
            String orderColumn, String orderDir) {
        XNyw4009Req req = new XNyw4009Req();
        req.setUserId(userId);
        req.setStart(start);
        req.setLimit(limit);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        return BizConnecter.getBizData("yw4009", JsonUtils.object2Json(req),
            Object.class);

    }
}
