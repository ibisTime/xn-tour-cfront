package com.xnjr.moom.front.ao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IOperatorAO;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN602000Req;
import com.xnjr.moom.front.req.XN602001Req;
import com.xnjr.moom.front.req.XN602002Req;
import com.xnjr.moom.front.req.XN602003Req;
import com.xnjr.moom.front.req.XN602004Req;
import com.xnjr.moom.front.req.XN602006Req;
import com.xnjr.moom.front.req.XN602020Req;
import com.xnjr.moom.front.req.XN602021Req;
import com.xnjr.moom.front.req.XN602022Req;
import com.xnjr.moom.front.req.XN602023Req;
import com.xnjr.moom.front.req.XN602025Req;
import com.xnjr.moom.front.req.XN602026Req;
import com.xnjr.moom.front.req.XN602027Req;
import com.xnjr.moom.front.req.XN602061Req;
import com.xnjr.moom.front.req.XN602080Req;
import com.xnjr.moom.front.req.XN602081Req;
import com.xnjr.moom.front.req.XN602403Req;
import com.xnjr.moom.front.req.XN602404Req;
import com.xnjr.moom.front.req.XN602405Req;

@Service
public class OperatorAOImpl implements IOperatorAO {

    public Object submitOrder(String applyUser, String modelCode,
            String quantity, String salePrice, String addressCode,
            String applyNote, String receiptType, String receiptTitle) {

        if (StringUtils.isBlank(applyUser)) {
            throw new BizException("A010001", "申请人编号不能为空");
        }
        if (StringUtils.isBlank(modelCode)) {
            throw new BizException("A010001", "型号编号不能为空");
        }
        if (StringUtils.isBlank(quantity)) {
            throw new BizException("A010001", "数量不能为空");
        }
        if (StringUtils.isBlank(salePrice)) {
            throw new BizException("A010001", "单价不能为空");
        }
        if (StringUtils.isBlank(addressCode)) {
            throw new BizException("A010001", "收货信息编号不能为空");
        }
        XN602020Req req = new XN602020Req();
        req.setAddressCode(addressCode);
        req.setApplyNote(applyNote);
        req.setApplyUser(applyUser);
        req.setModelCode(modelCode);
        req.setQuantity(quantity);
        req.setReceiptTitle(receiptTitle);
        req.setReceiptType(receiptType);
        req.setSalePrice(salePrice);
        return BizConnecter.getBizData("602020", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object payOrder(String code, String userId, String tradePwd) {
        if (StringUtils.isBlank(code)) {
            throw new BizException("A010001", "订单编号不能为空");
        }
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        tradePwd = "123456";
        if (StringUtils.isBlank(tradePwd)) {
            throw new BizException("A010001", "交易密码不能为空");
        }
        XN602022Req req = new XN602022Req();
        req.setCode(code);
        req.setTradePwd(tradePwd);
        req.setUserId(userId);
        return BizConnecter.getBizData("602022", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object cancelOrder(String code, String userId, String applyNote) {
        if (StringUtils.isBlank(code)) {
            throw new BizException("A010001", "订单编号不能为空");
        }
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(applyNote)) {
            throw new BizException("A010001", "取消说明不能为空");
        }
        XN602023Req req = new XN602023Req();
        req.setCode(code);
        req.setApproveNote(applyNote);
        req.setUserId(userId);
        return BizConnecter.getBizData("602023", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryPageOrders(String applyUser, String status,
            String limit, String orderColumn, String orderDir, String start) {
        if (StringUtils.isBlank(applyUser)) {
            throw new BizException("A010001", "下单人编号不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "页面个数不能为空");
        }
        if (StringUtils.isBlank(start)) {
            throw new BizException("A010001", "第几页不能为空");
        }
        XN602025Req req = new XN602025Req();
        req.setApplyUser(applyUser);
        req.setLimit(limit);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        req.setStart(start);
        req.setStatus(status);
        return BizConnecter.getBizData("602025", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryOrder(String invoiceCode) {
        if (StringUtils.isBlank(invoiceCode)) {
            throw new BizException("A010001", "订单编号不能为空");
        }
        XN602027Req req = new XN602027Req();
        req.setInvoiceCode(invoiceCode);
        return BizConnecter.getBizData("602027", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryOrders(String applyUser, String status) {
        if (StringUtils.isBlank(applyUser)) {
            throw new BizException("A010001", "下单人编号不能为空");
        }
        XN602026Req req = new XN602026Req();
        req.setApplyUser(applyUser);
        req.setStatus(status);
        return BizConnecter.getBizData("602026", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object add2Cart(String userId, String modelCode, String quantity) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(modelCode)) {
            throw new BizException("A010001", "型号编号不能为空");
        }
        if (StringUtils.isBlank(quantity)) {
            throw new BizException("A010001", "数量不能为空");
        }
        XN602000Req req = new XN602000Req();
        req.setModelCode(modelCode);
        req.setQuantity(quantity);
        req.setUserId(userId);
        return BizConnecter.getBizData("602000", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object deleteFromCart(String userId, String code) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(code)) {
            throw new BizException("A010001", "型号编号不能为空");
        }
        XN602001Req req = new XN602001Req();
        req.setCode(code);
        req.setUserId(userId);
        return BizConnecter.getBizData("602001", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object deleteCartItems(String userId, List<String> cartCodeList) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (cartCodeList == null || cartCodeList.isEmpty()) {
            throw new BizException("A010001", "购物车编号列表不能为空");
        }
        XN602006Req req = new XN602006Req();
        req.setUserId(userId);
        req.setCartCodeList(cartCodeList);
        return BizConnecter.getBizData("602006", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object editCart(String userId, String code, String quantity) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(code)) {
            throw new BizException("A010001", "型号编号不能为空");
        }
        if (StringUtils.isBlank(quantity)) {
            throw new BizException("A010001", "数量不能为空");
        }
        XN602002Req req = new XN602002Req();
        req.setCode(code);
        req.setQuantity(quantity);
        req.setUserId(userId);
        return BizConnecter.getBizData("602002", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryPageCart(String userId, String start, String limit,
            String orderColumn, String orderDir) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(start)) {
            throw new BizException("A010001", "第几页不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "页面个数不能为空");
        }
        if (StringUtils.isBlank(orderColumn)) {
            orderColumn = "";
        }
        if (StringUtils.isBlank(orderDir)) {
            orderDir = "";
        }
        XN602003Req req = new XN602003Req();
        req.setLimit(limit);
        req.setStart(start);
        req.setUserId(userId);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        return BizConnecter.getBizData("602003", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object submitCart(String applyUser, List<String> cartCodeList,
            String addressCode, String applyNote, String receiptType,
            String receiptTitle) {
        if (StringUtils.isBlank(applyUser)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(addressCode)) {
            throw new BizException("A010001", "地址编号不能为空");
        }
        if (cartCodeList == null || cartCodeList.isEmpty()) {
            throw new BizException("A010001", "购物车编号列表不能为空");
        }
        if (StringUtils.isBlank(receiptType)) {
            receiptType = "";
        }
        if (StringUtils.isBlank(applyNote)) {
            applyNote = "";
        }
        if (StringUtils.isBlank(receiptTitle)) {
            receiptTitle = "";
        }
        XN602021Req req = new XN602021Req();
        req.setAddressCode(addressCode);
        req.setApplyNote(applyNote);
        req.setApplyUser(applyUser);
        req.setCartCodeList(cartCodeList);
        req.setReceiptTitle(receiptTitle);
        req.setReceiptType(receiptType);
        return BizConnecter.getBizData("602021", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryCart(String userId) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        XN602004Req req = new XN602004Req();
        req.setUserId(userId);
        return BizConnecter.getBizData("602004", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryPageCommodity(String userId, String code,
            String modelCode, String logisticsCode, String start, String limit,
            String orderColumn, String orderDir) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(start)) {
            throw new BizException("A010001", "开始页不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "每页个数不能为空");
        }
        XN602061Req req = new XN602061Req();
        req.setUserId(userId);
        req.setCode(code);
        req.setLimit(limit);
        req.setLogisticsCode(logisticsCode);
        req.setModelCode(modelCode);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        req.setStart(start);
        return BizConnecter.getBizData("602061", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object submitRepairOrder(String userId, String goodsCode,
            String applyUser, String contact, String applyReason) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(goodsCode)) {
            throw new BizException("A010001", "货编号不能为空");
        }
        if (StringUtils.isBlank(applyUser)) {
            throw new BizException("A010001", "申请人不能为空");
        }
        if (StringUtils.isBlank(contact)) {
            throw new BizException("A010001", "联系方式不能为空");
        }
        if (StringUtils.isBlank(applyReason)) {
            throw new BizException("A010001", "问题描述不能为空");
        }
        XN602080Req req = new XN602080Req();
        req.setApplyReason(applyReason);
        req.setApplyUser(applyUser);
        req.setContact(contact);
        req.setGoodsCode(goodsCode);
        req.setUserId(userId);
        return BizConnecter.getBizData("602080", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryPageRepairOrder(String userId, String code,
            String goodsCode, String applyUser, String status, String updater,
            String start, String limit, String orderColumn, String orderDir) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(start)) {
            throw new BizException("A010001", "开始页不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "每页个数不能为空");
        }
        XN602081Req req = new XN602081Req();
        req.setUserId(userId);
        req.setCode(code);
        req.setLimit(limit);
        req.setGoodsCode(goodsCode);
        req.setStatus(status);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        req.setStart(start);
        return BizConnecter.getBizData("602081", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryPageAccountNumber(String companyCode, String subbranch,
            String cardNo, String status, String start, String limit,
            String orderColumn, String orderDir) {
        if (StringUtils.isBlank(start)) {
            throw new BizException("A010001", "开始页不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "每页个数不能为空");
        }
        status = "1";
        XN602403Req req = new XN602403Req();
        req.setCardNo(cardNo);
        req.setCompanyCode(companyCode);
        req.setSubbranch(subbranch);
        req.setLimit(limit);
        req.setStatus(status);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        req.setStart(start);
        return BizConnecter.getBizData("602403", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryAccountNumberList(String companyCode, String subbranch,
            String cardNo, String status) {
        XN602404Req req = new XN602404Req();
        req.setCardNo(cardNo);
        req.setCompanyCode(companyCode);
        req.setSubbranch(subbranch);
        req.setStatus(status);
        return BizConnecter.getBizData("602404", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryAccountNumber(String code) {
        XN602405Req req = new XN602405Req();
        req.setCode(code);
        return BizConnecter.getBizData("602405", JsonUtils.object2Json(req),
            Object.class);
    }
}
