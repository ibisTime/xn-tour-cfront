package com.xnjr.moom.front.res;

import java.util.Date;

/**
 * 项目
 * @author: myb858 
 * @since: 2016年1月16日 下午3:20:56 
 * @history:
 */
public class Subject {

    // 项目编号
    private String code;

    // 项目类型 额度/期限
    private String type;

    // 项目状态
    private String status;

    // 项目总金额（5亿）
    private Long totalAmount;

    // 本金(累加)
    private Long totalPrincipal;

    // 收益(累加)
    private Long totalProfit;

    // 项目名称
    private String name;

    // 服务类型
    private String serve;

    // 报价模式
    private String quote;

    // 受众等级
    private Integer level;

    // 操盘手(标的没有，他哪去找操盘手)
    private String trader;

    // 开始时间（手工开始）
    private Date startDatetime;

    // 结束时间（手工结束）
    private Date endDatetime;

    // 流标时间
    private Date unstartDatetime;

    // 备注
    private String remark;

    // 标的编号
    private String projectCode;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Long totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getTotalPrincipal() {
        return totalPrincipal;
    }

    public void setTotalPrincipal(Long totalPrincipal) {
        this.totalPrincipal = totalPrincipal;
    }

    public Long getTotalProfit() {
        return totalProfit;
    }

    public void setTotalProfit(Long totalProfit) {
        this.totalProfit = totalProfit;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getServe() {
        return serve;
    }

    public void setServe(String serve) {
        this.serve = serve;
    }

    public String getQuote() {
        return quote;
    }

    public void setQuote(String quote) {
        this.quote = quote;
    }

    public String getTrader() {
        return trader;
    }

    public void setTrader(String trader) {
        this.trader = trader;
    }

    public Date getStartDatetime() {
        return startDatetime;
    }

    public void setStartDatetime(Date startDatetime) {
        this.startDatetime = startDatetime;
    }

    public Date getEndDatetime() {
        return endDatetime;
    }

    public void setEndDatetime(Date endDatetime) {
        this.endDatetime = endDatetime;
    }

    public Date getUnstartDatetime() {
        return unstartDatetime;
    }

    public void setUnstartDatetime(Date unstartDatetime) {
        this.unstartDatetime = unstartDatetime;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

}
