package com.hichengdai.qlqq.front.ao.impl;

import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.IRideTogetherAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.XN616060Req;
import com.hichengdai.qlqq.front.req.XN616061Req;
import com.hichengdai.qlqq.front.req.XN616066Req;
import com.hichengdai.qlqq.front.req.XN616080Req;
import com.hichengdai.qlqq.front.req.XN616082Req;

@Service
public class RideTogetherAOImpl implements IRideTogetherAO {

	@Override
	public Object apply(String applyUser, String rider, String date,
			String duration, String contact, String note) {
		XN616060Req req = new XN616060Req();
		req.setApplyUser(applyUser);
		req.setRider(rider);
		req.setDate(date);
		req.setDuration(duration);
		req.setContact(contact);
		req.setNote(note);
		return BizConnecter.getBizData("616060", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object deal(String code, String isAgree) {
		XN616061Req req = new XN616061Req();
		req.setCode(code);
		req.setIsAgree(isAgree);
		return BizConnecter.getBizData("616061", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object cancel(String code) {
		return BizConnecter.getBizData("616062",
				JsonUtils.string2Json("code", code), Object.class);
	}

	@Override
	public Object pay(String code) {
		return BizConnecter.getBizData("616063",
				JsonUtils.string2Json("code", code), Object.class);
	}

	@Override
	public Object refund(String code) {
		return BizConnecter.getBizData("616064",
				JsonUtils.string2Json("code", code), Object.class);
	}

	@Override
	public Object evaluate(String content, String parentCode,
			String commentator, String remark, String entityCode) {
		XN616066Req req = new XN616066Req();
		req.setCommentator(commentator);
		req.setContent(content);
		req.setEntityCode(entityCode);
		req.setParentCode(parentCode);
		req.setRemark(remark);
		return BizConnecter.getBizData("616066", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryPageApply(String applyUser, String rider, String start,
			String limit, String orderColumn, String orderDir) {
		XN616080Req req = new XN616080Req();
		req.setApplyUser(applyUser);
		req.setRider(rider);
		req.setStart(start);
		req.setLimit(limit);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		return BizConnecter.getBizData("616080", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryApplyInfo(String code) {
		return BizConnecter.getBizData("616081",
				JsonUtils.string2Json("code", code), Object.class);
	}

	@Override
	public Object queryPageOrder(String applyUser, String type, String start,
			String limit, String orderColumn, String orderDir) {
		XN616082Req req = new XN616082Req();
		req.setApplyUser(applyUser);
		req.setLimit(limit);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		req.setStart(start);
		req.setType(type);
		return BizConnecter.getBizData("616082", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryOrderInfo(String code) {
		return BizConnecter.getBizData("616083",
				JsonUtils.string2Json("code", code), Object.class);
	}
}