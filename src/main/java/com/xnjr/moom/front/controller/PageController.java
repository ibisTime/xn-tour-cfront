package com.xnjr.moom.front.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.xnjr.moom.front.session.ISessionProvider;

@Controller
public class PageController {

	// private static final String SESSION_KEY_USER = "user";

	@Autowired
	protected ISessionProvider sessionProvider;

	public boolean JudgeIsMoblie(HttpServletRequest request) {
		boolean isMoblie = false;
		String[] mobileAgents = { "iphone", "android", "phone", "mobile",
				"wap", "netfront", "java", "opera mobi", "opera mini", "ucweb",
				"windows ce", "symbian", "series", "webos", "sony",
				"blackberry", "dopod", "nokia", "samsung", "palmsource", "xda",
				"pieplus", "meizu", "midp", "cldc", "motorola", "foma",
				"docomo", "up.browser", "up.link", "blazer", "helio", "hosin",
				"huawei", "novarra", "coolpad", "webos", "techfaith",
				"palmsource", "alcatel", "amoi", "ktouch", "nexian",
				"ericsson", "philips", "sagem", "wellcom", "bunjalloo", "maui",
				"smartphone", "iemobile", "spice", "bird", "zte-", "longcos",
				"pantech", "gionee", "portalmmm", "jig browser", "hiptop",
				"benq", "haier", "^lct", "320x320", "240x320", "176x220",
				"w3c ", "acs-", "alav", "alca", "amoi", "audi", "avan", "benq",
				"bird", "blac", "blaz", "brew", "cell", "cldc", "cmd-", "dang",
				"doco", "eric", "hipt", "inno", "ipaq", "java", "jigs", "kddi",
				"keji", "leno", "lg-c", "lg-d", "lg-g", "lge-", "maui", "maxo",
				"midp", "mits", "mmef", "mobi", "mot-", "moto", "mwbp", "nec-",
				"newt", "noki", "oper", "palm", "pana", "pant", "phil", "play",
				"port", "prox", "qwap", "sage", "sams", "sany", "sch-", "sec-",
				"send", "seri", "sgh-", "shar", "sie-", "siem", "smal", "smar",
				"sony", "sph-", "symb", "t-mo", "teli", "tim-", "tsm-", "upg1",
				"upsi", "vk-v", "voda", "wap-", "wapa", "wapi", "wapp", "wapr",
				"webc", "winw", "winw", "xda", "xda-", "Googlebot-Mobile" };
		System.out.println("UserAgent: " + request.getHeader("User-Agent"));
		if (request.getHeader("User-Agent") != null) {
			for (String mobileAgent : mobileAgents) {
				if (request.getHeader("User-Agent").toLowerCase()
						.indexOf(mobileAgent) >= 0) {
					isMoblie = true;
					break;
				}
			}
		} else {
			isMoblie = true;
		}
		System.out.println("isMobile: " + isMoblie);
		return isMoblie;
	}

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String page(HttpServletRequest request) {
		// SessionUser user = (SessionUser) sessionProvider
		// .getAttribute(SESSION_KEY_USER);
		// if (JudgeIsMoblie(request)) {
		return "redirect:/m/home/index.html";
		// }
		// if (null == user) {
		// return "redirect:home/index.htm";
		// }
		// return (JudgeIsMoblie(request) ? "m/project/l" : "home/index");
	}

	@RequestMapping(value = "/{module}.html", method = RequestMethod.GET)
	public String indexAction(@PathVariable String module,
			HttpServletRequest request) {
		// if (JudgeIsMoblie(request)) {
		return "redirect:/m/" + module + ".html";
		// }
		// String url = module;
		// System.out.println("url: " + url);
		// return url;
	}

	@RequestMapping(value = "/{first}/{page}.html", method = RequestMethod.GET)
	public String commonPage1Action(@PathVariable String first,
			@PathVariable String page, HttpServletRequest request) {
		// if (JudgeIsMoblie(request)) {
		return "redirect:/m/" + first + "/" + page + ".html";
		// }
		// String url = first + "/" + page;
		// System.out.println("url: " + url);
		// return url;
	}

	@RequestMapping(value = "/{first}/{second}/{page}.html", method = RequestMethod.GET)
	public String commonPage2Action(@PathVariable String first,
			@PathVariable String second, @PathVariable String page,
			HttpServletRequest request) {
		// if (JudgeIsMoblie(request)) {
		return "redirect:/m/" + first + "/" + second + "/" + page + ".html";
		// }
		// String url = first + "/" + second + "/" + page;
		// System.out.println("url: " + url);
		// return url;
	}
}
