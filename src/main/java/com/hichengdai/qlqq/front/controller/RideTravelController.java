package com.hichengdai.qlqq.front.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hichengdai.qlqq.front.ao.IRideTravelAO;
import com.hichengdai.qlqq.front.req.RideImgObj;

/**
 * 骑游记接口
 * 
 * @author: wulq
 * @since: 2016年12月8日 下午8:18:58
 * @history:
 */
@Controller
@RequestMapping(value = "/ride")
public class RideTravelController extends BaseController {
	@Autowired
	IRideTravelAO rideTravelAO;

	// 1.1、 发布骑游记
	@RequestMapping(value = "/publish", method = RequestMethod.POST)
	@ResponseBody
	public Object publishRide(@RequestParam("title") String title,
			@RequestParam("cover") String cover,
			@RequestParam("label1") String label1,
			@RequestParam("label2") String label2,
			@RequestParam("label3") String label3,
			@RequestParam("picList") List<RideImgObj> picList,
			@RequestParam("isPublish") String isPublish) {
		return rideTravelAO.publishRide(title, cover, label1, label2, label3,
				picList, this.getSessionUser().getUserId(), isPublish);
	}

	// 1.2、 草稿发布骑游记
	@RequestMapping(value = "/draft/edit", method = RequestMethod.POST)
	@ResponseBody
	public Object editDraft(@RequestParam("code") String code,
			@RequestParam("title") String title,
			@RequestParam("cover") String cover,
			@RequestParam("label1") String label1,
			@RequestParam("label2") String label2,
			@RequestParam("label3") String label3,
			@RequestParam("picList") List<RideImgObj> picList,
			@RequestParam("isPublish") String isPublish) {
		return rideTravelAO.editDraft(code, title, cover, label1, label2,
				label3, picList, this.getSessionUser().getUserId(), isPublish);
	}

	// 1.3、 评论骑游记
	@RequestMapping(value = "/comment", method = RequestMethod.POST)
	@ResponseBody
	public Object comment(@RequestParam("content") String content,
			@RequestParam("parentCode") String parentCode,
			@RequestParam(value = "remark", required = false) String remark,
			@RequestParam("entityCode") String entityCode) {
		return rideTravelAO.comment(content, parentCode, this.getSessionUser()
				.getUserId(), remark, entityCode);
	}

	// 1.4、 点赞骑游记
	@RequestMapping(value = "/like", method = RequestMethod.POST)
	@ResponseBody
	public Object comment(@RequestParam("travelNoteCode") String travelNoteCode) {
		return rideTravelAO.like(travelNoteCode, this.getSessionUser()
				.getUserId());
	}

	// 1.5、 收藏骑游记
	@RequestMapping(value = "/collection", method = RequestMethod.POST)
	@ResponseBody
	public Object collection(
			@RequestParam("travelNoteCode") String travelNoteCode) {
		return rideTravelAO.collection(travelNoteCode, this.getSessionUser()
				.getUserId());
	}

	// 1.6、 打赏骑游记
	@RequestMapping(value = "/gratuity", method = RequestMethod.POST)
	@ResponseBody
	public Object gratuity(
			@RequestParam("travelNoteCode") String travelNoteCode,
			@RequestParam("amount") String amount) {
		return rideTravelAO.gratuity(travelNoteCode, amount, this
				.getSessionUser().getUserId());
	}

	// 1.7、 阅读骑游记
	@RequestMapping(value = "/read", method = RequestMethod.POST)
	@ResponseBody
	public Object read(@RequestParam("travelNoteCode") String travelNoteCode) {
		return rideTravelAO.read(travelNoteCode, this.getSessionUser()
				.getUserId());
	}

	// 1.10、 分页查询骑游记
	@RequestMapping(value = "/page", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPage(
			@RequestParam("title") String title,
			@RequestParam("label1") String label1,
			@RequestParam("label2") String label2,
			@RequestParam("label3") String label3,
			@RequestParam("status") String status,
			@RequestParam(value = "publisher", required = false) String publisher,
			@RequestParam("start") String start,
			@RequestParam("limit") String limit,
			@RequestParam(value = "orderColumn", required = false) String orderColumn,
			@RequestParam(value = "orderDir", required = false) String orderDir) {
		return rideTravelAO.queryPage(title, label1, label2, label3, status,
				publisher, start, limit, orderColumn, orderDir);
	}

	// 1.11、 详情查询骑游记
	@RequestMapping(value = "/info", method = RequestMethod.GET)
	@ResponseBody
	public Object info(@RequestParam("code") String code) {
		return rideTravelAO.info(code);
	}

	// 1.12、 分页查询我收藏的骑游记
	@RequestMapping(value = "/collection/page", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPage(
			@RequestParam("start") String start,
			@RequestParam("limit") String limit,
			@RequestParam(value = "orderColumn", required = false) String orderColumn,
			@RequestParam(value = "orderDir", required = false) String orderDir) {
		return rideTravelAO.queryCollectionPage(this.getSessionUser()
				.getUserId(), start, limit, orderColumn, orderDir);
	}
}
