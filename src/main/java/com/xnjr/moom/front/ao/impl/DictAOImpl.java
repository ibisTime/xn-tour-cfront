package com.xnjr.moom.front.ao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.xnjr.moom.front.ao.IDictAO;
import com.xnjr.moom.front.req.StatusReq;
import com.xnjr.moom.front.req.XN707000Req;
import com.xnjr.moom.front.res.XN707000Res;
import com.xnjr.moom.front.res.XNlh5014Res;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;

@Service
public class DictAOImpl implements IDictAO {

    @Override
    public List<XNlh5014Res> queryDictList(String type) {
    	return BizConnecter.getBizData("lh5014",
                JsonUtils.string2Json("parentKey", type), List.class);
    }

	@Override
	public List queryBanks(String status, String orderColumn, String orderDir) {
		StatusReq req = new StatusReq();
		req.setStatus(status);
		req.setOrderColumn(orderColumn);
		req.setOrderDir(orderDir);
		return BizConnecter.getBizData("bk2004",
                JsonUtils.object2Json(req), List.class);
	}

}
