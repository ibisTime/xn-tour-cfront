package com.hichengdai.qlqq.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hichengdai.qlqq.front.ao.IAccountAO;
import com.hichengdai.qlqq.front.ao.IUserAO;

/** 
 * @author: miyb 
 * @since: 2015-4-14 下午1:41:46 
 * @history:
 */
@Controller
@RequestMapping(value = "/account")
public class AccountController extends BaseController {
    @Autowired
    IAccountAO accountAO;

    @Autowired
    IUserAO userAO;

    // *********查询资金明细start****
    @RequestMapping(value = "/detail/page", method = RequestMethod.GET)
    @ResponseBody
    public Object queryAccountDetail(
            @RequestParam("start") String start,
            @RequestParam("limit") String limit) {
        return accountAO.queryAccountDetail(this.getSessionUser().getUserId(),
        		start, limit);
    }
    // *********查询资金明细end****
}
