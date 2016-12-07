package com.hichengdai.qlqq.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hichengdai.qlqq.front.ao.INavigateAO;

/**
 * 导航接口
 * 
 * @author: wulq
 * @since: 2016年12月7日 上午11:08:49
 * @history:
 */
@Controller
@RequestMapping(value = "/navigate")
public class NavigateController extends BaseController {
	@Autowired
	INavigateAO navigeteAO;

	// 获取导航列表
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public Object getBannerList(
			@RequestParam("location") String location,
			@RequestParam(value = "companyCode", required = true) String companyCode,
			@RequestParam(value = "type", required = false) String type,
			@RequestParam(value = "parentCode", required = false) String parentCode) {
		return navigeteAO.getNavigateList(companyCode, location, parentCode,
				type);
	}
}
