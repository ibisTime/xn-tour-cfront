package com.hichengdai.qlqq.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hichengdai.qlqq.front.ao.IRideTogetherAO;

/**
 * 约骑相关接口
 * 
 * @author: wulq
 * @since: 2016年12月9日 下午12:29:07
 * @history:
 */
@Controller
@RequestMapping(value = "/together")
public class RideTogetherController extends BaseController {
	@Autowired
	IRideTogetherAO rideTogetherAO;

	// 2.1、 申请约骑
	@RequestMapping(value = "/apply", method = RequestMethod.POST)
	@ResponseBody
	public Object apply(@RequestParam("rider") String rider,
			@RequestParam("date") String date,
			@RequestParam("duration") String duration,
			@RequestParam("contact") String contact,
			@RequestParam("note") String note) {
		return rideTogetherAO.apply(this.getSessionUser().getUserId(), rider,
				date, duration, contact, note);
	}

	// 2.2、 约骑处理
	@RequestMapping(value = "/deal", method = RequestMethod.POST)
	@ResponseBody
	public Object deal(@RequestParam("code") String code,
			@RequestParam("isAgree") String isAgree) {
		return rideTogetherAO.deal(code, isAgree);
	}

	// 2.3、 取消约骑订单
	@RequestMapping(value = "/cancel", method = RequestMethod.POST)
	@ResponseBody
	public Object cancel(@RequestParam("code") String code) {
		return rideTogetherAO.cancel(code);
	}

	// 2.4、 支付约骑订单
	@RequestMapping(value = "/pay", method = RequestMethod.POST)
	@ResponseBody
	public Object pay(@RequestParam("code") String code) {
		return rideTogetherAO.cancel(code);
	}

	// 2.5、 退款申请
	@RequestMapping(value = "/refund", method = RequestMethod.POST)
	@ResponseBody
	public Object refund(@RequestParam("code") String code) {
		return rideTogetherAO.refund(code);
	}

	// 2.7、 评价约骑订单
	@RequestMapping(value = "/evaluate", method = RequestMethod.POST)
	@ResponseBody
	public Object evaluate(@RequestParam("content") String content,
			@RequestParam("parentCode") String parentCode,
			@RequestParam(value = "remark", required = false) String remark,
			@RequestParam("entityCode") String entityCode) {
		return rideTogetherAO.evaluate(content, parentCode, this
				.getSessionUser().getUserId(), remark, entityCode);
	}

	// 2.8、 分页查询陪骑申请
	@RequestMapping(value = "/apply/page", method = RequestMethod.GET)
	@ResponseBody
	public Object evaluate(
			@RequestParam(value = "applyUser", required = false) String applyUser,
			@RequestParam(value = "rider", required = false) String rider,
			@RequestParam("start") String start,
			@RequestParam("limit") String limit,
			@RequestParam(value = "orderColumn", required = false) String orderColumn,
			@RequestParam(value = "orderDir", required = false) String orderDir) {
		return rideTogetherAO.queryPageApply(applyUser, rider, start, limit,
				orderColumn, orderDir);
	}

	// 2.9、 详情查询陪骑申请
	@RequestMapping(value = "/apply/info", method = RequestMethod.GET)
	@ResponseBody
	public Object queryApplyInfo(@RequestParam("code") String code) {
		return rideTogetherAO.queryApplyInfo(code);
	}

	// 2.10、 分页查询陪骑订单
	@RequestMapping(value = "/order/page", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPageOrder(
			@RequestParam(value = "applyUser", required = false) String applyUser,
			@RequestParam(value = "type", required = false) String type,
			@RequestParam("start") String start,
			@RequestParam("limit") String limit,
			@RequestParam(value = "orderColumn", required = false) String orderColumn,
			@RequestParam(value = "orderDir", required = false) String orderDir) {
		return rideTogetherAO.queryPageOrder(applyUser, type, start, limit,
				orderColumn, orderDir);
	}

	// 2.11、 详情查询陪骑订单
	@RequestMapping(value = "/order/info", method = RequestMethod.GET)
	@ResponseBody
	public Object queryOrderInfo(@RequestParam("code") String code) {
		return rideTogetherAO.queryOrderInfo(code);
	}
}
