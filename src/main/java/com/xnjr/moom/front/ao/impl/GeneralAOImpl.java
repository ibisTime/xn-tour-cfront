package com.xnjr.moom.front.ao.impl;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IGeneralAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;

@Service
public class GeneralAOImpl implements IGeneralAO {

	@Override
	public Object getCompanyByUrl(String url) {
		return BizConnecter.getBizData("806015",
    		JsonUtils.string2Json("domain", url), Object.class);
	}

}
