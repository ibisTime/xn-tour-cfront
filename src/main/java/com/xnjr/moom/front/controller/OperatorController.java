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
@RequestMapping(value = "/operators")
public class OperatorController extends BaseController {

	@Autowired
	IOperatorAO operatorAO;

	@RequestMapping(value = "/submitOrder", method = RequestMethod.POST)
	@ResponseBody
	public Object submitOrder(
			@RequestParam(value = "applyUser", required = false) String applyUser,
			@RequestParam("productCode") String productCode,
			@RequestParam("quantity") String quantity,
			@RequestParam("receiver") String receiver,
			@RequestParam("reMobile") String reMobile,
			@RequestParam("reAddress") String reAddress,
			@RequestParam(value = "applyNote", required = false) String applyNote,
			@RequestParam(value = "receiptType", required = false) String receiptType,
			@RequestParam(value = "receiptTitle", required = false) String receiptTitle) {
		return operatorAO.submitOrder(productCode, quantity, receiver,
				reMobile, reAddress, this.getSessionUser().getUserId(),
				applyNote, receiptType, receiptTitle);
	}

	@RequestMapping(value = "/payOrder", method = RequestMethod.POST)
	@ResponseBody
	public Object payOrder(@RequestParam("code") String code,
			@RequestParam(value = "userId", required = false) String userId) {
		return operatorAO.payOrder(code, this.getSessionUser().getUserId());
	}

	@RequestMapping(value = "/cancelOrder", method = RequestMethod.POST)
	@ResponseBody
	public Object cancelOrder(@RequestParam("code") String code,
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam("remark") String remark) {
		return operatorAO.cancelOrder(code, this.getSessionUser().getUserId(),
				remark);
	}

	@RequestMapping(value = "/confirmOrder", method = RequestMethod.POST)
	@ResponseBody
	public Object confirmOrder(@RequestParam("code") String code,
			@RequestParam("remark") String remark) {
		return operatorAO.confirmOrder(code, this.getSessionUser().getUserId(),
				remark);
	}

	@RequestMapping(value = "/queryPageOrders", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPageOrders(
			@RequestParam(value = "applyUser", required = false) String applyUser,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam("limit") String limit,
			@RequestParam(value = "orderColumn", required = false) String orderColumn,
			@RequestParam(value = "orderDir", required = false) String orderDir,
			@RequestParam("start") String start,
			@RequestParam(value = "mobile", required = false) String mobile,
			@RequestParam("companyCode") String companyCode) {
		return operatorAO.queryPageOrders(this.getSessionUser().getUserId(),
				status, limit, orderColumn, orderDir, start, mobile,
				companyCode);
	}

	@RequestMapping(value = "/queryOrder", method = RequestMethod.GET)
	@ResponseBody
	public Object queryOrder(@RequestParam("code") String code) {
		return operatorAO.queryOrder(code);
	}

	@RequestMapping(value = "/queryOrders", method = RequestMethod.GET)
	@ResponseBody
	public Object queryOrders(
			@RequestParam(value = "applyUser", required = false) String applyUser,
			@RequestParam(value = "mobile", required = false) String mobile,
			@RequestParam(value = "companyCode", required = true) String companyCode,
			@RequestParam(value = "status", required = false) String status) {
		return operatorAO.queryOrders(this.getSessionUser().getUserId(),
				status, mobile, companyCode);
	}

	@RequestMapping(value = "/add2Cart", method = RequestMethod.POST)
	@ResponseBody
	public Object add2Cart(
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam("productCode") String productCode,
			@RequestParam("quantity") String quantity) {
		return operatorAO.add2Cart(this.getSessionUser().getUserId(),
				productCode, quantity);
	}

	@RequestMapping(value = "/deleteFromCart", method = RequestMethod.POST)
	@ResponseBody
	public Object deleteFromCart(@RequestParam("code") String code) {
		return operatorAO.deleteFromCart(this.getSessionUser().getUserId(),
				code);
	}

	@RequestMapping(value = "/deleteCartItems", method = RequestMethod.POST)
	@ResponseBody
	public Object deleteCartItems(
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam("cartCodeList") List<String> cartCodeList) {
		return operatorAO.deleteCartItems(this.getSessionUser().getUserId(),
				cartCodeList);
	}

	@RequestMapping(value = "/editCart", method = RequestMethod.POST)
	@ResponseBody
	public Object editCart(
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam("code") String code,
			@RequestParam("quantity") String quantity) {
		return operatorAO.editCart(this.getSessionUser().getUserId(), code,
				quantity);
	}

	@RequestMapping(value = "/queryPageCart", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPageCart(
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam("start") String start,
			@RequestParam("limit") String limit,
			@RequestParam(value = "orderColumn", required = false) String orderColumn,
			@RequestParam(value = "orderDir", required = false) String orderDir) {
		return operatorAO.queryPageCart(this.getSessionUser().getUserId(),
				start, limit, orderColumn, orderDir);
	}

	@RequestMapping(value = "/queryCart", method = RequestMethod.GET)
	@ResponseBody
	public Object queryCart() {
		return operatorAO.queryCartList(this.getSessionUser().getUserId());
	}

	@RequestMapping(value = "/submitCart", method = RequestMethod.POST)
	@ResponseBody
	public Object submitCart(
			@RequestParam(value = "applyUser", required = false) String applyUser,
			@RequestParam("cartCodeList") List<String> cartCodeList,
			@RequestParam("receiver") String receiver,
			@RequestParam("reMobile") String reMobile,
			@RequestParam("reAddress") String reAddress,
			@RequestParam(value = "applyNote", required = false) String applyNote,
			@RequestParam(value = "receiptType", required = false) String receiptType,
			@RequestParam(value = "receiptTitle", required = false) String receiptTitle) {
		return operatorAO.submitCart(receiver, reMobile, reAddress, this
				.getSessionUser().getUserId(), applyNote, receiptType,
				receiptTitle, cartCodeList);
	}

	@RequestMapping(value = "/xpeditePurchase", method = RequestMethod.POST)
	@ResponseBody
	public Object xpeditePurchase(@RequestParam("code") String code) {
		return operatorAO.xpeditePurchase(code);
	}
}
