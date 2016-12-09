package com.hichengdai.qlqq.front.ao.impl;

import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.IActivityAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.XN616103Req;
import com.hichengdai.qlqq.front.req.XN616104Req;
import com.hichengdai.qlqq.front.req.XN616105Req;
import com.hichengdai.qlqq.front.req.XN616107Req;
import com.hichengdai.qlqq.front.req.XN616120Req;
import com.hichengdai.qlqq.front.req.XN616130Req;

@Service
public class ActivityAOImpl implements IActivityAO {

	@Override
	public Object intentionApply(String activityCode, String userId) {
		XN616103Req req = new XN616103Req();
		req.setActivityCode(activityCode);
		req.setUserId(userId);
		return BizConnecter.getBizData("616103", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object comment(String content, String parentCode,
			String commentator, String remark, String entityCode) {
		XN616104Req req = new XN616104Req();
		req.setCommentator(commentator);
		req.setContent(content);
		req.setEntityCode(entityCode);
		req.setParentCode(parentCode);
		req.setRemark(remark);
		return BizConnecter.getBizData("616104", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object consultationApply(String activityCode, String content,
			String remark, String submiter) {
		XN616105Req req = new XN616105Req();
		req.setActivityCode(activityCode);
		req.setContent(content);
		req.setRemark(remark);
		req.setSubmiter(submiter);
		return BizConnecter.getBizData("616105", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object gratuity(String activityCode, String amount, String userId) {
		XN616107Req req = new XN616107Req();
		req.setActivityCode(activityCode);
		req.setAmount(amount);
		req.setUserId(userId);
		return BizConnecter.getBizData("616107", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryPageActivity(String publisher, String category,
			String status, String start, String limit, String orderColumn,
			String orderDir) {
		XN616120Req req = new XN616120Req();
		req.setPublisher(publisher);
		req.setCategory(category);
		req.setStart(start);
		req.setStatus(status);
		req.setLimit(limit);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		return BizConnecter.getBizData("616120", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryActivityInfo(String code) {
		return BizConnecter.getBizData("616121",
				JsonUtils.string2Json("code", code), Object.class);
	}

	@Override
	public Object apply(String applyUser, String productCode, String realName,
			String mobile, String bookNum) {
		XN616130Req req = new XN616130Req();
		req.setApplyUser(applyUser);
		req.setProductCode(productCode);
		req.setRealName(realName);
		req.setMobile(mobile);
		req.setBookNum(bookNum);
		return BizConnecter.getBizData("616130", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object payOrder(String code) {
		return BizConnecter.getBizData("616131",
				JsonUtils.string2Json("code", code), Object.class);
	}

	@Override
	public Object cancelOrder(String code) {
		return BizConnecter.getBizData("616132",
				JsonUtils.string2Json("code", code), Object.class);
	}

}
