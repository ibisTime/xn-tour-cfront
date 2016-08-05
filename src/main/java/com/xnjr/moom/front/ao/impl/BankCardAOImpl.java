package com.xnjr.moom.front.ao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IBankCardAO;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN801204Req;
import com.xnjr.moom.front.req.XN801214Req;
import com.xnjr.moom.front.req.XN801402Req;
import com.xnjr.moom.front.req.XNfd2010Req;
import com.xnjr.moom.front.req.XNfd2011Req;
import com.xnjr.moom.front.req.XNfd2013Req;
import com.xnjr.moom.front.req.XNfd2050Req;
import com.xnjr.moom.front.req.XNfd2052Req;
import com.xnjr.moom.front.req.XNfd2053Req;
import com.xnjr.moom.front.res.XN801204Res;

@Service
public class BankCardAOImpl implements IBankCardAO {

    @Override
    public void doBindBankCard(String userId, String bankCode, String bankCardNo, 
    		String subbranch) {
        XNfd2010Req req = new XNfd2010Req();
        req.setUserId(userId);
        req.setBankCode(bankCode);
        req.setBankCardNo(bankCardNo);
        req.setSubbranch(subbranch);
        BizConnecter.getBizData("fd2010", JsonUtils.object2Json(req),
            Object.class);
    }
    
    @Override
    public Object doBindCompanyBankCard(String companyCode, String bankCode, String cardNo, String subbranch) {
        XNfd2050Req req = new XNfd2050Req();
        req.setCompanyCode(companyCode);
        req.setBankCode(bankCode);
        req.setCardNo(cardNo);
        req.setSubbranch(subbranch);
        return BizConnecter.getBizData("fd2050", JsonUtils.object2Json(req),
            Object.class);
    }
    
    @Override
    public Object doEditBankCard(String id, String userId, String bankCode, 
    		String bankCardNo, String subbranch) {
        XNfd2011Req req = new XNfd2011Req();
        req.setId(id);
        req.setUserId(userId);
        req.setBankCode(bankCode);
        req.setBankCardNo(bankCardNo);
        req.setSubbranch(subbranch);
        return BizConnecter.getBizData("fd2011", JsonUtils.object2Json(req),
            Object.class);
    }
    
    @Override
    public Object doEditCompanyBankCard(String id, String bankCode, String cardNo, String subbranch) {
        XNfd2052Req req = new XNfd2052Req();
        req.setId(id);
        req.setBankCode(bankCode);
        req.setCardNo(cardNo);
        req.setSubbranch(subbranch);
        return BizConnecter.getBizData("fd2052", JsonUtils.object2Json(req),
            Object.class);
    }
    
    @Override
    public Object doViewBankCard(String id) {
        return BizConnecter.getBizData("fd2015", JsonUtils.string2Json("id", id),
            Object.class);
    }

    @Override
    public List queryBankCardList(String userId) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        return BizConnecter.getBizData("fd2014", JsonUtils.string2Json("userId", userId),
            List.class);

    }

	@Override
	public Object doDropBankCard(String id, String userId) {
		return BizConnecter.getBizData("fd2011", "{\"id\": \""+id+"\", \"userId\": \""+userId+"\"}",
				Object.class);
	}

	@Override
	public Object queryBankCardPage(String userId, String start, String limit,
			String orderColumn, String orderDir) {
		XNfd2013Req req = new XNfd2013Req();
		req.setUserId(userId);
		req.setStart(start);
		req.setLimit(limit);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		return BizConnecter.getBizData("fd2013", JsonUtils.object2Json(req),
	            Object.class);
	}

	@Override
	public Object queryCompanyBankCardList(String companyCode) {
		return BizConnecter.getBizData("fd2054", JsonUtils.string2Json("companyCode", companyCode),
	            Object.class);
	}

	@Override
	public Object queryCompanyBankCardPage(String companyCode, String start,
			String limit, String orderColumn, String orderDir) {
		XNfd2053Req req = new XNfd2053Req();
		req.setCompanyCode(companyCode);
		req.setStart(start);
		req.setLimit(limit);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		return BizConnecter.getBizData("fd2053", JsonUtils.object2Json(req),
	            Object.class);
	}

	@Override
	public Object viewCompanyBankCard(String id) {
		return BizConnecter.getBizData("fd2055", JsonUtils.string2Json("id", id),
	            Object.class);
	}
}
