package com.hichengdai.qlqq.front.ao.impl;

import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.INewsAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.XN616190Req;

@Service
public class NewsAOImpl implements INewsAO {

	@Override
	public Object queryPageNews(String type, String title, String keywords,
			String publisher, String start, String limit, String orderColumn,
			String orderDir) {
		XN616190Req req = new XN616190Req();
		req.setTitle(title);
		req.setType(type);
		req.setKeywords(keywords);
		req.setPublisher(publisher);
		req.setStart(start);
		req.setLimit(limit);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		return BizConnecter.getBizData("616190", JsonUtils.object2Json(req),
				Object.class);
	}

	@Override
	public Object queryNewsInfo(String code) {
		return BizConnecter.getBizData("616191",
				JsonUtils.string2Json("code", code), Object.class);
	}

}
