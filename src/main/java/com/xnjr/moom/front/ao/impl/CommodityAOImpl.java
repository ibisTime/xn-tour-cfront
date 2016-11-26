package com.xnjr.moom.front.ao.impl;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.ICommodityAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN808005Req;
import com.xnjr.moom.front.req.XN808006Req;
import com.xnjr.moom.front.req.XN808020Req;
import com.xnjr.moom.front.req.XN808021Req;

@Service
public class CommodityAOImpl implements ICommodityAO {

	public Object queryListProducts(String category, String type, String name,
			String status, String companyCode) {
		status = "1";
		XN808021Req req = new XN808021Req();
		req.setCategory(category);
		req.setCompanyCode(companyCode);
		req.setName(name);
		req.setStatus(status);
		req.setType(type);
		return BizConnecter.getBizData("808021", JsonUtils.object2Json(req),
				Object.class);
	}

	public Object queryProduct(String code) {
		return BizConnecter.getBizData("808022",
				JsonUtils.string2Json("code", code), Object.class);
	}

	public Object queryPageProducts(String category, String type, String name,
			String status, String companyCode, String start, String limit,
			String orderColumn, String orderDir, String location) {
		status = "1";
		XN808020Req req = new XN808020Req();
		req.setCategory(category);
		req.setCompanyCode(companyCode);
		req.setLimit(limit);
		req.setName(name);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		req.setStart(start);
		req.setStatus(status);
		req.setType(type);
		req.setLocation(location);
		return BizConnecter.getBizData("808020", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryListCategory(String parentCode, String name,
			String companyCode, String type) {
		XN808006Req req = new XN808006Req();
		req.setCompanyCode(companyCode);
		req.setName(name);
		req.setParentCode(parentCode);
		req.setType(type);
		return BizConnecter.getBizData("808006", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryPageCategory(String parentCode, String name,
			String companyCode, String type, String start, String limit,
			String orderColumn, String orderDir) {
		XN808005Req req = new XN808005Req();
		req.setCompanyCode(companyCode);
		req.setLimit(limit);
		req.setName(name);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		req.setParentCode(parentCode);
		req.setStart(start);
		req.setType(type);
		return BizConnecter.getBizData("808005", JsonUtils.object2Json(req),
				Object.class);
	}
}
