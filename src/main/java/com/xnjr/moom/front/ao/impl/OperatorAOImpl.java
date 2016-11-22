package com.xnjr.moom.front.ao.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IOperatorAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN808030Req;
import com.xnjr.moom.front.req.XN808031Req;
import com.xnjr.moom.front.req.XN808033Req;
import com.xnjr.moom.front.req.XN808040Req;
import com.xnjr.moom.front.req.XN808041Req;
import com.xnjr.moom.front.req.XN808032Req;
import com.xnjr.moom.front.req.XN808050Req;
import com.xnjr.moom.front.req.XN808051Req;
import com.xnjr.moom.front.req.XN808053Req;
import com.xnjr.moom.front.req.XN808070Req;
import com.xnjr.moom.front.req.XN808071Req;
import com.xnjr.moom.front.req.XN808057Req;

@Service
public class OperatorAOImpl implements IOperatorAO {

    public Object submitOrder(String productCode, String quantity,
            String receiver, String reMobile, String reAddress,
            String applyUser, String applyNote, String receiptType,
            String receiptTitle) {
        XN808050Req req = new XN808050Req();
        req.setApplyNote(applyNote);
        req.setApplyUser(applyUser);
        req.setProductCode(productCode);
        req.setQuantity(quantity);
        req.setReAddress(reAddress);
        req.setReceiptTitle(receiptTitle);
        req.setReceiptType(receiptType);
        req.setReceiver(receiver);
        req.setReMobile(reMobile);
        return BizConnecter.getBizData("808050", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object payOrder(String code, String userId) {
        return BizConnecter.getBizData("808052", JsonUtils.string2Json("code", code),
            Object.class);
    }

    public Object cancelOrder(String code, String userId, String remark) {
        XN808053Req req = new XN808053Req();
        req.setCode(code);
        req.setRemark(remark);
        req.setUserId(userId);
        return BizConnecter.getBizData("808053", JsonUtils.object2Json(req),
            Object.class);
    }
    
    public Object confirmOrder(String code, String updater, String remark){
    	XN808057Req req = new XN808057Req();
    	req.setCode(code);
    	req.setRemark(remark);
    	req.setUpdater(updater);
    	return BizConnecter.getBizData("808057", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryPageOrders(String applyUser, String status,
            String limit, String orderColumn, String orderDir,
            String start, String mobile, String companyCode) {
        XN808070Req req = new XN808070Req();
        req.setApplyUser(applyUser);
        req.setLimit(limit);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        req.setStart(start);
        req.setStatus(status);
        req.setMobile(mobile);
        req.setCompanyCode(companyCode);
        return BizConnecter.getBizData("808070", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryOrder(String invoiceCode) {
        return BizConnecter.getBizData("808072", JsonUtils.string2Json("code", invoiceCode),
            Object.class);
    }

    public Object queryOrders(String applyUser, String status,
    		String mobile, String companyCode) {
        XN808071Req req = new XN808071Req();
        req.setApplyUser(applyUser);
        req.setStatus(status);
        req.setCompanyCode(companyCode);
        req.setMobile(mobile);
        return BizConnecter.getBizData("808071", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object add2Cart(String userId, String productCode, String quantity) {
        XN808030Req req = new XN808030Req();
        req.setProductCode(productCode);
        req.setQuantity(quantity);
        req.setUserId(userId);
        return BizConnecter.getBizData("808030", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object deleteFromCart(String userId, String code) {
        XN808031Req req = new XN808031Req();
        req.setCode(code);
        req.setUserId(userId);
        return BizConnecter.getBizData("808031", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object deleteCartItems(String userId, List<String> cartCodeList) {
        XN808032Req req = new XN808032Req();
        req.setUserId(userId);
        req.setCartCodeList(cartCodeList);
        return BizConnecter.getBizData("808032", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object editCart(String userId, String code, String quantity) {
        XN808033Req req = new XN808033Req();
        req.setCode(code);
        req.setQuantity(quantity);
        req.setUserId(userId);
        return BizConnecter.getBizData("808033", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryPageCart(String userId, String start, String limit,
            String orderColumn, String orderDir) {
        XN808040Req req = new XN808040Req();
        req.setLimit(limit);
        req.setStart(start);
        req.setUserId(userId);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        return BizConnecter.getBizData("808040", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryCartList(String userId) {
        XN808041Req req = new XN808041Req();
        req.setUserId(userId);
        return BizConnecter.getBizData("808041", JsonUtils.object2Json(req),
            Object.class);
    }
    
    public Object submitCart(String receiver, String reMobile,
    		String reAddress, String applyUser, String applyNote,
    		String receiptType, String receiptTitle,
    		List<String> cartCodeList) {
        
        XN808051Req req = new XN808051Req();
        req.setReAddress(reAddress);
        req.setReceiver(receiver);
        req.setReMobile(reMobile);
        req.setApplyNote(applyNote);
        req.setApplyUser(applyUser);
        req.setCartCodeList(cartCodeList);
        req.setReceiptTitle(receiptTitle);
        req.setReceiptType(receiptType);
        return BizConnecter.getBizData("808051", JsonUtils.object2Json(req),
            Object.class);
    }
}
