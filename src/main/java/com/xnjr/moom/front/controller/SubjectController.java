package com.xnjr.moom.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.ISubjectAO;

@Controller
@RequestMapping(value = "/subject")
public class SubjectController extends BaseController {
    @Autowired
    ISubjectAO subjectAO;

    // 我的认购和项目列表
    @RequestMapping(value = "/investSubject/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryInvestSubjectList(
            @RequestParam(value = "userId", required = false) String userId) {
        return subjectAO.queryInvestSubjectList(getSessionUserId(userId));
    }

    // 我的项目列表
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public Object querySubjectList(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "status", required = false) String status) {
        return subjectAO.querySubjectList(getSessionUserId(userId), status);
    }

    // 我的项目详情
    @RequestMapping(value = "/detail", method = RequestMethod.GET)
    @ResponseBody
    public Object getProject(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("subjectCode") String subjectCode) {
        return subjectAO.getSubject(getSessionUserId(userId), subjectCode);
    }

    // 合同查询
    @RequestMapping(value = "/contract", method = RequestMethod.GET)
    @ResponseBody
    public Object getContract(@RequestParam("contractCode") String contractCode) {
        return subjectAO.getContract(contractCode);
    }

    // 我的业务详情
    @RequestMapping(value = "business/detail", method = RequestMethod.GET)
    @ResponseBody
    public Object getBusiness(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("businessCode") String businessCode) {
        return subjectAO.getBusiness(getSessionUserId(userId), businessCode);
    }
}
