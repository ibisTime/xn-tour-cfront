package com.hichengdai.qlqq.front.ao.impl;

import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.IDictAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.XN807715Req;
import com.hichengdai.qlqq.front.req.XN808906Req;

@Service
public class DictAOImpl implements IDictAO {

	@Override
	public Object queryDictList(String type, String parentKey, String dkey) {
		XN808906Req req = new XN808906Req();
		req.setDkey(dkey);
		req.setParentKey(parentKey);
		req.setType(type);
		return BizConnecter.getBizData("808906", JsonUtils.object2Json(req),
			Object.class);
	}

	@Override
	public Object querySysConfig(String userId, String ckey, String start,
			String limit, String orderColumn, String orderDir) {
		XN807715Req req = new XN807715Req();
		req.setCkey(ckey);
		req.setLimit(limit);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		req.setStart(start);
		return BizConnecter.getBizData("807715", JsonUtils.object2Json(req),
			Object.class);
	}

}
