package com.xnjr.moom.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IProjectAO;
import com.xnjr.moom.front.enums.EServe;

@Controller
@RequestMapping(value = "/project")
public class ProjectController extends BaseController {
    @Autowired
    IProjectAO projectAO;

    // -----------------标的列表----------------
    // 获取标的分页列表
    @RequestMapping(value = "/page", method = RequestMethod.GET)
    @ResponseBody
    public Object queryProjectPage(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return projectAO.queryProjectPage(getSessionUserId(userId), start,
            limit, orderColumn, orderDir);
    }
    
    // 获取企业降本标的列表
    @RequestMapping(value = "/qyjb/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryQYJBProjectList(
            @RequestParam(value = "userId", required = false) String userId) {
        return projectAO.queryProjectList(getSessionUserId(userId),
            EServe.QYJB.getCode());
    }

    // 获取现金管理标的列表
    @RequestMapping(value = "/xjgl/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryXJGLProjectList(
            @RequestParam(value = "userId", required = false) String userId) {
        return projectAO.queryProjectList(getSessionUserId(userId),
            EServe.XJGL.getCode());
    }

    // 获取贸易重构标的列表
    @RequestMapping(value = "/mycg/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryMYCGProjectList(
            @RequestParam(value = "userId", required = false) String userId) {
        return projectAO.queryProjectList(getSessionUserId(userId),
            EServe.MYCG.getCode());
    }

    // 获取财报优化标的列表
    @RequestMapping(value = "/cbyh/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryCBYHProjectList(
            @RequestParam(value = "userId", required = false) String userId) {
        return projectAO.queryProjectList(getSessionUserId(userId),
            EServe.CBYH.getCode());
    }

    // 获取市值管理标的列表
    @RequestMapping(value = "/szgl/list", method = RequestMethod.GET)
    @ResponseBody
    public Object querySZGLProjectList(
            @RequestParam(value = "userId", required = false) String userId) {
        return projectAO.queryProjectList(getSessionUserId(userId),
            EServe.SZGL.getCode());
    }

    // 获取等分模式标的列表
    @RequestMapping(value = "/dfms/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryDFMSProjectList(
            @RequestParam(value = "userId", required = false) String userId) {
        return projectAO.queryProjectList(getSessionUserId(userId),
            EServe.DFMS.getCode());
    }

    // 获取优先劣后模式标的列表
    @RequestMapping(value = "/yxlhms/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryYXLHMSProjectList(
            @RequestParam(value = "userId", required = false) String userId) {
        return projectAO.queryProjectList(getSessionUserId(userId),
            EServe.YXLHMS.getCode());
    }

    // 获取项目众筹标的列表
    @RequestMapping(value = "/xmzc/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryXMZCProjectList(
            @RequestParam(value = "userId", required = false) String userId) {
        return projectAO.queryProjectList(getSessionUserId(userId),
            EServe.XMZC.getCode());
    }

    // 获取金融众筹标的列表
    @RequestMapping(value = "/jrzc/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryJRZCProjectList(
            @RequestParam(value = "userId", required = false) String userId) {
        return projectAO.queryProjectList(getSessionUserId(userId),
            EServe.JRZC.getCode());
    }

    // 获取标的详情：入参为标的Id
    @RequestMapping(value = "/detail", method = RequestMethod.GET)
    @ResponseBody
    public Object getProject(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("projectCode") String projectCode) {
        return projectAO.getProject(getSessionUserId(userId), projectCode);
    }

    // -----------------认购----------------
    
    // 企业降本认购
    @RequestMapping(value = "/qyjb/invest", method = RequestMethod.POST)
    @ResponseBody
    public String investQYJBProject(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("projectCode") String projectCode,
            @RequestParam("investAmount") String investAmount,
            @RequestParam("tradePwd") String tradePwd) {
        return projectAO.investProject(getSessionUserId(userId), projectCode,
            investAmount, tradePwd);
    }

    // 现金管理认购
    @RequestMapping(value = "/xjgl/invest", method = RequestMethod.POST)
    @ResponseBody
    public String investXJGLProject(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("projectCode") String projectCode,
            @RequestParam("investAmount") String investAmount,
            @RequestParam("tradePwd") String tradePwd) {
        return projectAO.investProject(getSessionUserId(userId), projectCode,
            investAmount, tradePwd);
    }

    // 贸易重构认购
    @RequestMapping(value = "/mycg/invest", method = RequestMethod.POST)
    @ResponseBody
    public String investMYCGProject(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("projectCode") String projectCode,
            @RequestParam("investAmount") String investAmount,
            @RequestParam("tradePwd") String tradePwd) {
        return projectAO.investProject(getSessionUserId(userId), projectCode,
            investAmount, tradePwd);
    }

    // 财报优化认购
    @RequestMapping(value = "/cbyh/invest", method = RequestMethod.POST)
    @ResponseBody
    public String investCBYHProject(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("projectCode") String projectCode,
            @RequestParam("nowAmount") String nowAmount,
            @RequestParam("nowNote") String nowNote,
            @RequestParam("tradePwd") String tradePwd) {
        return projectAO.willInvestProject(getSessionUserId(userId),
            projectCode, nowAmount, nowNote, tradePwd);
    }

    // 市值管理认购
    @RequestMapping(value = "/szgl/invest", method = RequestMethod.POST)
    @ResponseBody
    public String investSZGLProject(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("projectCode") String projectCode,
            @RequestParam("nowNote") String nowNote,
            @RequestParam("tradePwd") String tradePwd) {
        return projectAO.willInvestProject(getSessionUserId(userId),
            projectCode, null, nowNote, tradePwd);
    }

    // 等分模式认购
    @RequestMapping(value = "/dfms/invest", method = RequestMethod.POST)
    @ResponseBody
    public String investDFMSProject(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("projectCode") String projectCode,
            @RequestParam("investAmount") String investAmount,
            @RequestParam("tradePwd") String tradePwd) {
        return projectAO.investProject(getSessionUserId(userId), projectCode,
            investAmount, tradePwd);
    }

    // 优先劣后模式认购
    @RequestMapping(value = "/yxlhms/invest", method = RequestMethod.POST)
    @ResponseBody
    public String investYXLHMSProject(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("projectCode") String projectCode,
            @RequestParam("investAmount") String investAmount,
            @RequestParam("tradePwd") String tradePwd) {
        return projectAO.investProject(getSessionUserId(userId), projectCode,
            investAmount, tradePwd);
    }

    // 查询我的真实认购列表
    @RequestMapping(value = "/invest/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryMyInvestList(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "status", required = false) String status) {
        return projectAO.queryMyInvestList(getSessionUserId(userId), status);
    }

    // 查询我的意向认购列表
    @RequestMapping(value = "/willInvest/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryMyWillInvestList(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "status", required = false) String status) {
        return projectAO
            .queryMyWillInvestList(getSessionUserId(userId), status);
    }
}
