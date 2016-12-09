package com.hichengdai.qlqq.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hichengdai.qlqq.front.ao.INewsAO;

/**
 * 吐槽接口
 * 
 * @author: wulq
 * @since: 2016年12月9日 下午3:58:26
 * @history:
 */
@Controller
@RequestMapping(value = "/complaints")
public class NewsController extends BaseController {
	@Autowired
	INewsAO newsAO;

	// 1.6、 分页查询资讯
	@RequestMapping(value = "/page", method = RequestMethod.GET)
	@ResponseBody
	public Object queryPageNews(
			@RequestParam("type") String type,
			@RequestParam("title") String title,
			@RequestParam("keywords") String keywords,
			@RequestParam(value = "publisher", required = false) String publisher,
			@RequestParam("start") String start,
			@RequestParam("limit") String limit,
			@RequestParam(value = "orderColumn", required = false) String orderColumn,
			@RequestParam(value = "orderDir", required = false) String orderDir) {
		return newsAO.queryPageNews(type, title, keywords, publisher, start,
				limit, orderColumn, orderDir);
	}

	// 1.7、 详情查询资讯
	@RequestMapping(value = "/info", method = RequestMethod.GET)
	@ResponseBody
	public Object queryNewsInfo(@RequestParam("code") String code) {
		return newsAO.queryNewsInfo(code);
	}
}
