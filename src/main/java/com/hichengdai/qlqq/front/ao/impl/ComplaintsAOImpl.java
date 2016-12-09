package com.hichengdai.qlqq.front.ao.impl;

import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.IComplaintsAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.XN616160Req;
import com.hichengdai.qlqq.front.req.XN616170Req;

@Service
public class ComplaintsAOImpl implements IComplaintsAO {

	@Override
	public Object publish(String type, String title, String content,
			String remark, String submiter) {
		XN616160Req req = new XN616160Req();
		req.setTitle(title);
		req.setType(type);
		req.setContent(content);
		req.setRemark(remark);
		req.setSubmiter(submiter);
		return BizConnecter.getBizData("616160", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryPageComplaints(String status, String start,
			String limit, String orderColumn, String orderDir) {
		XN616170Req req = new XN616170Req();
		req.setStart(start);
		req.setStatus(status);
		req.setLimit(limit);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		return BizConnecter.getBizData("616170", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryInfo(String code) {
		return BizConnecter.getBizData("616171",
				JsonUtils.string2Json("code", code), Object.class);
	}

}
