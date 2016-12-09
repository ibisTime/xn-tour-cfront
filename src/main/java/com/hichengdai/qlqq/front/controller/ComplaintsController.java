package com.hichengdai.qlqq.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hichengdai.qlqq.front.ao.IComplaintsAO;

/**
 * 吐槽接口
 * 
 * @author: wulq
 * @since: 2016年12月9日 下午3:58:26
 * @history:
 */
@Controller
@RequestMapping(value = "/complaints")
public class ComplaintsController extends BaseController {
	@Autowired
	IComplaintsAO complaintsAO;

	// 1.1、 发布吐槽
	@RequestMapping(value = "/publish", method = RequestMethod.POST)
	@ResponseBody
	public Object publish(@RequestParam("type") String type,
			@RequestParam("title") String title,
			@RequestParam("content") String content,
			@RequestParam("remark") String remark) {
		return complaintsAO.publish(type, title, content, remark, this
				.getSessionUser().getUserId());
	}

	// 1.3、 分页查询吐槽
	@RequestMapping(value = "/page", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPageComplaints(
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "orderColumn", required = false) String orderColumn,
			@RequestParam(value = "orderDir", required = false) String orderDir,
			@RequestParam("start") String start,
			@RequestParam("limit") String limit) {
		return complaintsAO.queryPageComplaints(status, start, limit,
				orderColumn, orderDir);
	}

	// 1.4、 详情查询吐槽
	@RequestMapping(value = "/info", method = RequestMethod.GET)
	@ResponseBody
	public Object queryInfo(@RequestParam("code") String code) {
		return complaintsAO.queryInfo(code);
	}

}
