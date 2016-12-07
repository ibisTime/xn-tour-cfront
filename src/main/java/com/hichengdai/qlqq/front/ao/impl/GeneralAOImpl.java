package com.hichengdai.qlqq.front.ao.impl;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.IGeneralAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.XN805130Req;
import com.hichengdai.qlqq.front.req.XN806031Req;
import com.hichengdai.qlqq.front.req.XN808917Req;

@Service
public class GeneralAOImpl implements IGeneralAO {

	@Override
	public Object getCompanyByUrl(String url) {
		return BizConnecter.getBizData("806015",
				JsonUtils.string2Json("domain", url), Object.class);
	}

	@Override
	public Object getPageBroadcast(String title, String toCompany,
			String toLevel, String toUser, String companyCode, String updater,
			String start, String limit) {
		XN805130Req req = new XN805130Req();
		req.setCompanyCode(companyCode);
		req.setLimit(limit);
		req.setStart(start);
		req.setStatus("1");
		req.setTitle(title);
		req.setToCompany(toCompany);
		req.setToLevel(toLevel);
		req.setToUser(toUser);
		req.setType("1");
		req.setUpdater(updater);
		return BizConnecter.getBizData("805130", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object getBroadcastInfo(String code) {
		return BizConnecter.getBizData("805132",
				JsonUtils.string2Json("code", code), Object.class);
	}

	@Override
	public Object getInfoByKey(String key, String companyCode) {
		XN808917Req req = new XN808917Req();
		req.setCompanyCode(companyCode);
		req.setKey(key);
		return BizConnecter.getBizData("808917", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Map[] queryPasswordList(String type, String account,
			String companyCode) {
		XN806031Req req = new XN806031Req();
		req.setAccount(account);
		req.setCompanyCode(companyCode);
		req.setType(type);
		return BizConnecter.getBizData("806031", JsonUtils.object2Json(req),
				Map[].class);
	}
}
