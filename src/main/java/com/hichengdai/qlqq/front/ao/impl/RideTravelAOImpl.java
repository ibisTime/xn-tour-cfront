package com.hichengdai.qlqq.front.ao.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.IRideTravelAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.RideImgObj;
import com.hichengdai.qlqq.front.req.XN616000Req;
import com.hichengdai.qlqq.front.req.XN616001Req;
import com.hichengdai.qlqq.front.req.XN616002Req;
import com.hichengdai.qlqq.front.req.XN616003Req;
import com.hichengdai.qlqq.front.req.XN616004Req;
import com.hichengdai.qlqq.front.req.XN616005Req;
import com.hichengdai.qlqq.front.req.XN616006Req;
import com.hichengdai.qlqq.front.req.XN616020Req;
import com.hichengdai.qlqq.front.req.XN616022Req;

@Service
public class RideTravelAOImpl implements IRideTravelAO {

	@Override
	public Object publishRide(String title, String cover, String label1,
			String label2, String label3, List<RideImgObj> picList,
			String publisher, String isPublish) {
		XN616000Req req = new XN616000Req();
		req.setCover(cover);
		req.setIsPublish(isPublish);
		req.setLabel1(label1);
		req.setLabel2(label2);
		req.setLabel3(label3);
		req.setPicList(picList);
		req.setPublisher(publisher);
		req.setTitle(title);
		return BizConnecter.getBizData("616000", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object editDraft(String code, String title, String cover,
			String label1, String label2, String label3,
			List<RideImgObj> picList, String publisher, String isPublish) {
		XN616001Req req = new XN616001Req();
		req.setCode(code);
		req.setCover(cover);
		req.setIsPublish(isPublish);
		req.setLabel1(label1);
		req.setLabel2(label2);
		req.setLabel3(label3);
		req.setPicList(picList);
		req.setPublisher(publisher);
		req.setTitle(title);
		return BizConnecter.getBizData("616001", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object comment(String content, String parentCode,
			String commentator, String remark, String entityCode) {
		XN616002Req req = new XN616002Req();
		req.setCommentator(commentator);
		req.setContent(content);
		req.setEntityCode(entityCode);
		req.setParentCode(parentCode);
		req.setRemark(remark);
		return BizConnecter.getBizData("616002", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object like(String travelNoteCode, String userId) {
		XN616003Req req = new XN616003Req();
		req.setTravelNoteCode(travelNoteCode);
		req.setUserId(userId);
		return BizConnecter.getBizData("616003", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object collection(String travelNoteCode, String userId) {
		XN616004Req req = new XN616004Req();
		req.setTravelNoteCode(travelNoteCode);
		req.setUserId(userId);
		return BizConnecter.getBizData("616004", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object gratuity(String travelNoteCode, String amount, String userId) {
		XN616005Req req = new XN616005Req();
		req.setTravelNoteCode(travelNoteCode);
		req.setAmount(amount);
		req.setUserId(userId);
		return BizConnecter.getBizData("616005", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object read(String travelNoteCode, String userId) {
		XN616006Req req = new XN616006Req();
		req.setTravelNoteCode(travelNoteCode);
		req.setUserId(userId);
		return BizConnecter.getBizData("616006", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryPage(String title, String label1, String label2,
			String label3, String status, String publisher, String start,
			String limit, String orderColumn, String orderDir) {
		XN616020Req req = new XN616020Req();
		req.setTitle(title);
		req.setLabel1(label1);
		req.setLabel2(label2);
		req.setLabel3(label3);
		req.setStatus(status);
		req.setPublisher(publisher);
		req.setStart(start);
		req.setLimit(limit);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		return BizConnecter.getBizData("616020", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object info(String code) {
		return BizConnecter.getBizData("616021",
				JsonUtils.string2Json("code", code), Object.class);
	}

	@Override
	public Object queryCollectionPage(String userId, String start,
			String limit, String orderColumn, String orderDir) {
		XN616022Req req = new XN616022Req();
		req.setStart(start);
		req.setLimit(limit);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		return BizConnecter.getBizData("616022", JsonUtils.object2Json(req),
				Object.class);
	}
}