package com.hichengdai.qlqq.front.ao.impl;

import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.IRideTalentAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.XN616030Req;
import com.hichengdai.qlqq.front.req.XN616035Req;
import com.hichengdai.qlqq.front.req.XN616036Req;
import com.hichengdai.qlqq.front.req.XN616037Req;
import com.hichengdai.qlqq.front.req.XN616050Req;

@Service
public class RideTalentAOImpl implements IRideTalentAO {

	@Override
	public Object apply(String userId, String description, String label,
			String pic1, String pic2, String pic3, String price,
			String province, String city, String area, String time,
			String note, String realName, String wechat, String mobile,
			String payType, String payAccount) {
		XN616030Req req = new XN616030Req();
		req.setUserId(userId);
		req.setDescription(description);
		req.setLabel(label);
		req.setPic1(pic1);
		req.setPic2(pic2);
		req.setPic3(pic3);
		req.setPrice(price);
		req.setProvince(province);
		req.setCity(city);
		req.setArea(area);
		req.setTime(time);
		req.setNote(note);
		req.setRealName(realName);
		req.setWechat(wechat);
		req.setMobile(mobile);
		req.setPayType(payType);
		req.setPayAccount(payAccount);
		return BizConnecter.getBizData("616030", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object comment(String content, String parentCode,
			String commentator, String remark, String entityCode) {
		XN616035Req req = new XN616035Req();
		req.setCommentator(commentator);
		req.setContent(content);
		req.setParentCode(parentCode);
		req.setRemark(remark);
		req.setEntityCode(entityCode);
		return BizConnecter.getBizData("616035", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object gratuity(String rider, String amount, String userId) {
		XN616036Req req = new XN616036Req();
		req.setAmount(amount);
		req.setRider(rider);
		req.setUserId(userId);
		return BizConnecter.getBizData("616036", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object follow(String rider, String userId) {
		XN616037Req req = new XN616037Req();
		req.setRider(rider);
		req.setUserId(userId);
		return BizConnecter.getBizData("616037", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryPage(String userId, String realName, String wechat,
			String mobile, String status, String start, String limit) {
		XN616050Req req = new XN616050Req();
		req.setLimit(limit);
		req.setMobile(mobile);
		req.setRealName(realName);
		req.setStart(start);
		req.setStatus(status);
		req.setUserId(userId);
		req.setWechat(wechat);
		return BizConnecter.getBizData("616050", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryList() {
		return BizConnecter.getBizData("616051", null, Object.class);
	}
}