package com.hichengdai.qlqq.front.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hichengdai.qlqq.front.util.UploadUtil;

/**
 * 上传接口
 * 
 * @author: wulq
 * @since: 2016年12月9日 下午3:58:26
 * @history:
 */
@Controller
@RequestMapping(value = "/upload")
public class UploadController extends BaseController {
	// 上传图片
	@RequestMapping(value = "/img", method = RequestMethod.POST)
	@ResponseBody
	public Object uploadImg(@RequestParam(value = "photo") String photo) {
		return UploadUtil.uploadPicture(photo);
	}

}
