package com.xnjr.moom.front.req;

public class XN602025Req {
	//下单人编号
	private String applyUser;
	//状态     1 已提交，待支付；2已取消；3已支付，待发货； 4 已发货，待收；5 已收货
	private String status;
	//第几页
	private String start;
	//页面个数
	private String limit;
	//排序字段
	private String orderColumn;
	//排序方向
	private String orderDir;
	
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
