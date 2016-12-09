package com.hichengdai.qlqq.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hichengdai.qlqq.front.ao.IActivityAO;

/**
 * 活动接口、活动报名相关接口
 * 
 * @author: wulq
 * @since: 2016年12月9日 上午10:27:27
 * @history:
 */
@Controller
@RequestMapping(value = "/activity")
public class ActivityController extends BaseController {
	@Autowired
	IActivityAO activityAO;

	// 1.4、 活动意向提交
	@RequestMapping(value = "/intention/apply", method = RequestMethod.POST)
	@ResponseBody
	public Object intentionApply(
			@RequestParam("activityCode") String activityCode) {
		return activityAO.intentionApply(activityCode, this.getSessionUser()
				.getUserId());
	}

	// 1.5、 评论活动
	@RequestMapping(value = "/comment", method = RequestMethod.POST)
	@ResponseBody
	public Object comment(@RequestParam("content") String content,
			@RequestParam("parentCode") String parentCode,
			@RequestParam(value = "remark", required = false) String remark,
			@RequestParam("entityCode") String entityCode) {
		return activityAO.comment(content, parentCode, this.getSessionUser()
				.getUserId(), remark, entityCode);
	}

	// 1.6、 活动咨询提交
	@RequestMapping(value = "/consultation/apply", method = RequestMethod.POST)
	@ResponseBody
	public Object comment(@RequestParam("content") String content,
			@RequestParam("activityCode") String activityCode,
			@RequestParam(value = "remark", required = false) String remark) {
		return activityAO.consultationApply(activityCode, content, remark, this
				.getSessionUser().getUserId());
	}

	// 1.8、 打赏活动
	@RequestMapping(value = "/gratuity", method = RequestMethod.POST)
	@ResponseBody
	public Object gratuity(@RequestParam("activityCode") String activityCode,
			@RequestParam("amount") String amount) {
		return activityAO.gratuity(activityCode, amount, this.getSessionUser()
				.getUserId());
	}

	// 1.9、 分页查询活动
	@RequestMapping(value = "/page", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPageActivity(
			@RequestParam(value = "publisher", required = false) String publisher,
			@RequestParam(value = "category", required = false) String category,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam("start") String start,
			@RequestParam("limit") String limit,
			@RequestParam(value = "orderColumn", required = false) String orderColumn,
			@RequestParam(value = "orderDir", required = false) String orderDir) {
		return activityAO.queryPageActivity(publisher, category, status, start,
				limit, orderColumn, orderDir);
	}

	// 1.10、 详情查询活动
	@RequestMapping(value = "/info", method = RequestMethod.GET)
	@ResponseBody
	public Object queryActivityInfo(@RequestParam("code") String code) {
		return activityAO.queryActivityInfo(code);
	}

	// 2.1、 活动报名提交
	@RequestMapping(value = "/apply", method = RequestMethod.POST)
	@ResponseBody
	public Object apply(@RequestParam("productCode") String productCode,
			@RequestParam("realName") String realName,
			@RequestParam("mobile") String mobile,
			@RequestParam("bookNum") String bookNum) {
		return activityAO.apply(this.getSessionUser().getUserId(), productCode,
				realName, mobile, bookNum);
	}

	// 2.2、 支付活动订单
	@RequestMapping(value = "/order/pay", method = RequestMethod.POST)
	@ResponseBody
	public Object payOrder(@RequestParam("code") String code) {
		return activityAO.payOrder(code);
	}

	// 2.3、 取消活动订单
	@RequestMapping(value = "/order/cancel", method = RequestMethod.POST)
	@ResponseBody
	public Object cancelOrder(@RequestParam("code") String code) {
		return activityAO.cancelOrder(code);
	}
	// 2.4、 评价活动订单 调 评论达人的接口(RideTalentController)
	// 2.5、 分页查询活动订单 调 分页查询陪骑订单(RideTogetherController)
	// 2.6、 详情查询活动订单 调 详情查询陪骑订单(RideTogetherController)
}
