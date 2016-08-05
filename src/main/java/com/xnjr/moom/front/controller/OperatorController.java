package com.xnjr.moom.front.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IOperatorAO;

@Controller
@RequestMapping(value = "operators")
public class OperatorController extends BaseController {

    @Autowired
    IOperatorAO operatorAO;

    @RequestMapping(value = "/submitOrder", method = RequestMethod.POST)
    @ResponseBody
    public Object submitOrder(
            @RequestParam(value = "applyUser", required = false) String applyUser,
            @RequestParam("modelCode") String modelCode,
            @RequestParam("quantity") String quantity,
            @RequestParam("salePrice") String salePrice,
            @RequestParam("addressCode") String addressCode,
            @RequestParam(value = "applyNote", required = false) String applyNote,
            @RequestParam(value = "receiptType", required = false) String receiptType,
            @RequestParam(value = "receiptTitle", required = false) String receiptTitle) {
        return operatorAO.submitOrder(getSessionUserId(applyUser), modelCode,
            quantity, salePrice, addressCode, applyNote, receiptType,
            receiptTitle);
    }

    @RequestMapping(value = "/payOrder", method = RequestMethod.POST)
    @ResponseBody
    public Object payOrder(@RequestParam("code") String code,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "tradePwd", required = false) String tradePwd) {
        return operatorAO.payOrder(code, getSessionUserId(userId), tradePwd);
    }

    @RequestMapping(value = "/cancelOrder", method = RequestMethod.POST)
    @ResponseBody
    public Object cancelOrder(@RequestParam("code") String code,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("applyNote") String applyNote) {
        return operatorAO
            .cancelOrder(code, getSessionUserId(userId), applyNote);
    }

    @RequestMapping(value = "/queryPageOrders", method = RequestMethod.POST)
    @ResponseBody
    public Object queryPageOrders(
            @RequestParam(value = "applyUser", required = false) String applyUser,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir,
            @RequestParam("start") String start) {
        return operatorAO.queryPageOrders(getSessionUserId(applyUser), status,
            limit, orderColumn, orderDir, start);
    }

    @RequestMapping(value = "/queryOrder", method = RequestMethod.POST)
    @ResponseBody
    public Object queryOrder(@RequestParam("invoiceCode") String invoiceCode) {
        return operatorAO.queryOrder(invoiceCode);
    }

    @RequestMapping(value = "/queryOrders", method = RequestMethod.POST)
    @ResponseBody
    public Object queryOrders(
            @RequestParam(value = "applyUser", required = false) String applyUser,
            @RequestParam(value = "status", required = false) String status) {
        return operatorAO.queryOrders(getSessionUserId(applyUser), status);
    }

    @RequestMapping(value = "/add2Cart", method = RequestMethod.POST)
    @ResponseBody
    public Object add2Cart(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("modelCode") String modelCode,
            @RequestParam("quantity") String quantity) {
        return operatorAO.add2Cart(getSessionUserId(userId), modelCode,
            quantity);
    }

    @RequestMapping(value = "/deleteFromCart", method = RequestMethod.POST)
    @ResponseBody
    public Object deleteFromCart(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("code") String code) {
        return operatorAO.deleteFromCart(getSessionUserId(userId), code);
    }

    @RequestMapping(value = "/deleteCartItems", method = RequestMethod.POST)
    @ResponseBody
    public Object deleteCartItems(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("cartCodeList") List<String> cartCodeList) {
        return operatorAO.deleteCartItems(getSessionUserId(userId),
            cartCodeList);
    }

    @RequestMapping(value = "/editCart", method = RequestMethod.POST)
    @ResponseBody
    public Object editCart(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("code") String code,
            @RequestParam("quantity") String quantity) {
        return operatorAO.editCart(getSessionUserId(userId), code, quantity);
    }

    @RequestMapping(value = "/queryPageCart", method = RequestMethod.POST)
    @ResponseBody
    public Object queryPageCart(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return operatorAO.queryPageCart(getSessionUserId(userId), start, limit,
            orderColumn, orderDir);
    }

    @RequestMapping(value = "/queryCart", method = RequestMethod.GET)
    @ResponseBody
    public Object queryCart(
            @RequestParam(value = "userId", required = false) String userId) {
        return operatorAO.queryCart(getSessionUserId(userId));
    }

    @RequestMapping(value = "/submitCart", method = RequestMethod.POST)
    @ResponseBody
    public Object submitCart(
            @RequestParam(value = "applyUser", required = false) String applyUser,
            @RequestParam("cartCodeList") List<String> cartCodeList,
            @RequestParam("addressCode") String addressCode,
            @RequestParam(value = "applyNote", required = false) String applyNote,
            @RequestParam(value = "receiptType", required = false) String receiptType,
            @RequestParam(value = "receiptTitle", required = false) String receiptTitle) {
        return operatorAO.submitCart(getSessionUserId(applyUser), cartCodeList,
            addressCode, applyNote, receiptType, receiptTitle);
    }

    // 货分页查询
    @RequestMapping(value = "/queryPageCommodity", method = RequestMethod.GET)
    @ResponseBody
    public Object queryPageCommodity(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "modelCode", required = false) String modelCode,
            @RequestParam(value = "logisticsCode", required = false) String logisticsCode,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return operatorAO.queryPageCommodity(getSessionUserId(userId), code,
            modelCode, logisticsCode, start, limit, orderColumn, orderDir);
    }

    // 提交维修单
    @RequestMapping(value = "/submitRepairOrder", method = RequestMethod.POST)
    @ResponseBody
    public Object submitRepairOrder(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("goodsCode") String goodsCode,
            @RequestParam("applyUser") String applyUser,
            @RequestParam("contact") String contact,
            @RequestParam("applyReason") String applyReason) {
        return operatorAO.submitRepairOrder(getSessionUserId(userId),
            goodsCode, applyUser, contact, applyReason);
    }

    // 维修单分页查询
    @RequestMapping(value = "/queryPageRepairOrder", method = RequestMethod.GET)
    @ResponseBody
    public Object queryPageRepairOrder(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "goodsCode", required = false) String goodsCode,
            @RequestParam(value = "applyUser", required = false) String applyUser,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "updater", required = false) String updater,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return operatorAO.queryPageRepairOrder(getSessionUserId(userId), code,
            goodsCode, applyUser, status, updater, start, limit, orderColumn,
            orderDir);
    }

    // 分页查询受款账号
    @RequestMapping(value = "page/accountNumber", method = RequestMethod.GET)
    @ResponseBody
    public Object queryPageAccountNumber(
            @RequestParam(value = "companyCode", required = false) String companyCode,
            @RequestParam(value = "subbranch", required = false) String subbranch,
            @RequestParam(value = "cardNo", required = false) String cardNo,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return operatorAO.queryPageAccountNumber(companyCode, subbranch,
            cardNo, status, start, limit, orderColumn, orderDir);
    }

    // 列表查询受款账号
    @RequestMapping(value = "list/accountNumber", method = RequestMethod.GET)
    @ResponseBody
    public Object queryAccountNumberList(
            @RequestParam(value = "companyCode", required = false) String companyCode,
            @RequestParam(value = "subbranch", required = false) String subbranch,
            @RequestParam(value = "cardNo", required = false) String cardNo,
            @RequestParam(value = "status", required = false) String status) {
        return operatorAO.queryAccountNumberList(companyCode, subbranch,
            cardNo, status);
    }

    // 详情查询受款账号
    @RequestMapping(value = "queryAccountNumber", method = RequestMethod.GET)
    @ResponseBody
    public Object queryAccountNumber(
            @RequestParam(value = "code", required = false) String code) {
        return operatorAO.queryAccountNumber(code);
    }
}
