package com.xnjr.moom.front.req;

public class StatusReq {
    // 状态
    private String status;

    // 排序字段
    private String orderColumn;

    // 排序方向
    private String orderDir;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
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
