package com.hichengdai.qlqq.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hichengdai.qlqq.front.ao.IRideTalentAO;

/**
 * 骑行达人接口
 * 
 * @author: wulq
 * @since: 2016年12月9日 上午10:27:27
 * @history:
 */
@Controller
@RequestMapping(value = "/talent")
public class RideTalentController extends BaseController {
	@Autowired
	IRideTalentAO rideTalentAO;

	// 1.1、 骑行达人认证申请
	@RequestMapping(value = "/apply", method = RequestMethod.POST)
	@ResponseBody
	public Object apply(@RequestParam("description") String description,
			@RequestParam("label") String label,
			@RequestParam("pic1") String pic1,
			@RequestParam("pic2") String pic2,
			@RequestParam("pic3") String pic3,
			@RequestParam("price") String price,
			@RequestParam("province") String province,
			@RequestParam("city") String city,
			@RequestParam("area") String area,
			@RequestParam("time") String time,
			@RequestParam("note") String note,
			@RequestParam("realName") String realName,
			@RequestParam("wechat") String wechat,
			@RequestParam("mobile") String mobile,
			@RequestParam("payType") String payType,
			@RequestParam("payAccount") String payAccount) {
		return rideTalentAO
				.apply(this.getSessionUser().getUserId(), description, label,
						pic1, pic2, pic3, price, province, city, area, time,
						note, realName, wechat, mobile, payType, payAccount);
	}

	// 1.6、 评论达人
	@RequestMapping(value = "/comment", method = RequestMethod.POST)
	@ResponseBody
	public Object comment(@RequestParam("content") String content,
			@RequestParam("parentCode") String parentCode,
			@RequestParam(value = "remark", required = false) String remark,
			@RequestParam("entityCode") String entityCode) {
		return rideTalentAO.comment(content, parentCode, this.getSessionUser()
				.getUserId(), remark, entityCode);
	}

	// 1.7、 打赏达人
	@RequestMapping(value = "/gratuity", method = RequestMethod.POST)
	@ResponseBody
	public Object gratuity(@RequestParam("rider") String rider,
			@RequestParam("amount") String amount) {
		return rideTalentAO.gratuity(rider, amount, this.getSessionUser()
				.getUserId());
	}

	// 1.8、 关注/取消关注达人
	@RequestMapping(value = "/follow", method = RequestMethod.POST)
	@ResponseBody
	public Object follow(@RequestParam("rider") String rider) {
		return rideTalentAO.follow(rider, this.getSessionUser().getUserId());
	}

	// 1.9、 分页查询达人
	@RequestMapping(value = "/page", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPage(
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam(value = "realName", required = false) String realName,
			@RequestParam(value = "wechat", required = false) String wechat,
			@RequestParam(value = "mobile", required = false) String mobile,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam("start") String start,
			@RequestParam("limit") String limit) {
		return rideTalentAO.queryPage(userId, realName, wechat, mobile, status,
				start, limit);
	}

	// 1.10、 列表查询一周推荐达人
	@RequestMapping(value = "/week/list", method = RequestMethod.GET)
	@ResponseBody
	public Object queryList() {
		return rideTalentAO.queryList();
	}
}
