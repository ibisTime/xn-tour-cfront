package com.xnjr.moom.front.req;

public class XN602081Req {
	//维修单号
	private String code;
	//货编号
	private String goodsCode;
	//用户ID
	private String userId;
	//申请人
	private String applyUser;
	//状态
	private String status;
	//发货人
	private String updater;
	//开始
	private String start;
	//每页个数
	private String limit;
	//排序字段
	private String orderColumn;
	//排序方向
	private String orderDir;
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getGoodsCode() {
		return goodsCode;
	}
	public void setGoodsCode(String goodsCode) {
		this.goodsCode = goodsCode;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getApplyUser() {
		return applyUser;
	}
	public void setApplyUser(String applyUser) {
		this.applyUser = applyUser;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getUpdater() {
		return updater;
	}
	public void setUpdater(String updater) {
		this.updater = updater;
	}
	public String getStart() {
		return start;
	}
	public void setStart(String start) {
		this.start = start;
	}
	public String getLimit() {
		return limit;
	}
	public void setLimit(String limit) {
		this.limit = limit;
	}
	public String getOrderColumn() {
		return orderColumn;
	}
	public void setOrderColumn(String orderColumn) {
		this.orderColumn = orderColumn;
	}
	public String getOrderDir() {
		return orderDir;
	}
	public void setOrderDir(String orderDir) {
		this.orderDir = orderDir;
	}
}
