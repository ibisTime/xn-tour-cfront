package com.xnjr.moom.front.ao.impl;


import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IBannerAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN806051Req;


@Service
public class BannerAOImpl implements IBannerAO {

	@Override
	public Object getBannerList(String companyCode, String location, String belong) {
		XN806051Req req = new XN806051Req();
		req.setBelong(belong);
        req.setType("2");
        req.setCompanyCode(companyCode);
        req.setLocation(location);
        return BizConnecter.getBizData("806051", JsonUtils.object2Json(req),
            Object.class);
	}

}
