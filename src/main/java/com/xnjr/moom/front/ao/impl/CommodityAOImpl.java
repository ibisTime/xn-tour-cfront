package com.xnjr.moom.front.ao.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.ICommodityAO;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN601005Req;
import com.xnjr.moom.front.req.XN601006Req;
import com.xnjr.moom.front.req.XN601024Req;
import com.xnjr.moom.front.req.XN601025Req;
import com.xnjr.moom.front.req.XN601026Req;

@Service
public class CommodityAOImpl implements ICommodityAO {

	@Override
	public Object queryProduces(String type, String name, String updater, String status) {
		if(StringUtils.isBlank(type)){
			type = "";
		}
		if(StringUtils.isBlank(name)){
			name = "";
		}
		if(StringUtils.isBlank(updater)){
			updater = "";
		}
		status = "3";
		XN601005Req req = new XN601005Req();
		req.setName(name);
		req.setStatus(status);
		req.setType(type);
		req.setUpdater(updater);
        return BizConnecter.getBizData("601005", JsonUtils.object2Json(req),
        		Object.class);
	}

	public Object queryProduce(String code){
		if(StringUtils.isBlank(code)){
			code = "";
		}
		XN601006Req req = new XN601006Req();
		req.setCode(code);
		return BizConnecter.getBizData("601006", JsonUtils.object2Json(req),
        		Object.class);
	}
	
	public Object queryListModel(String code, String name, String status, String productCode){
		if(StringUtils.isBlank(code)){
			code = "";
		}
		if(StringUtils.isBlank(name)){
			name = "";
		}
		if(StringUtils.isBlank(productCode)){
			productCode = "";
		}
		status = "3";
		XN601025Req xn601025Req = new XN601025Req();
		xn601025Req.setCode(code);
		xn601025Req.setName(name);
		xn601025Req.setProductCode(productCode);
		xn601025Req.setStatus(status);
		return BizConnecter.getBizData("601025", JsonUtils.object2Json(xn601025Req),
        		Object.class);
	}
	public Object queryModel(String code){
		if(StringUtils.isBlank(code)){
			throw new BizException("A010001", "型号编号不能为空");
		}
		XN601026Req xn601026Req = new XN601026Req();
		xn601026Req.setCode(code);
		return BizConnecter.getBizData("601026", JsonUtils.object2Json(xn601026Req),
        		Object.class);
	}
	
	public Object queryPageModel(String code, String name, String status, String productCode,
			String start, String limit, String orderColumn, String orderDir, String productName){
		if(StringUtils.isBlank(code)){
			code = "";
		}
		if(StringUtils.isBlank(name)){
			name = "";
		}
		if(StringUtils.isBlank(productCode)){
			productCode = "";
		}
		if(StringUtils.isBlank(orderColumn)){
			productCode = "";
		}
		if(StringUtils.isBlank(orderDir)){
			orderDir = "desc";
		}
		if(StringUtils.isBlank(productName)){
			productName = "";
		}
		if(StringUtils.isBlank(start)){
			throw new BizException("A010001", "开始页不能为空");
		}
		if(StringUtils.isBlank(limit)){
			throw new BizException("A010001", "每页个数不能为空");
		}
		status = "3";
		XN601024Req xn601024Req = new XN601024Req();
		xn601024Req.setCode(code);
		xn601024Req.setName(name);
		xn601024Req.setProductCode(productCode);
		xn601024Req.setStatus(status);
		xn601024Req.setLimit(limit);
		xn601024Req.setOrderDir(orderDir);
		xn601024Req.setOrderColumn(orderColumn);
		xn601024Req.setStart(start);
		xn601024Req.setProductName(productName);
		return BizConnecter.getBizData("601024", JsonUtils.object2Json(xn601024Req),
        		Object.class);
	}
}
