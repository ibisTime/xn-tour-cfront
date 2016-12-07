package com.hichengdai.qlqq.front.ao.impl;

import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.INavigateAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.XN806051Req;

@Service
public class NavigateAOImpl implements INavigateAO {

	@Override
	public Object getNavigateList(String companyCode, String location,
			String parentCode, String type) {
		XN806051Req req = new XN806051Req();
		req.setParentCode(parentCode);
		req.setType(type);
		req.setCompanyCode(companyCode);
		req.setLocation(location);
		return BizConnecter.getBizData("806051", JsonUtils.object2Json(req),
				Object.class);
	}

}
