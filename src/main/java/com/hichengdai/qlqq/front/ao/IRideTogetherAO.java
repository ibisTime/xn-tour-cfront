package com.hichengdai.qlqq.front.ao;

public interface IRideTogetherAO {
	public Object apply(String applyUser, String rider, String date,
			String duration, String contact, String note);

	public Object deal(String code, String isAgree);

	public Object cancel(String code);

	public Object pay(String code);

	public Object refund(String code);

	public Object evaluate(String content, String parentCode,
			String commentator, String remark, String entityCode);

	public Object queryPageApply(String applyUser, String rider, String start,
			String limit, String orderColumn, String orderDir);

	public Object queryApplyInfo(String code);

	public Object queryPageOrder(String applyUser, String type, String start,
			String limit, String orderColumn, String orderDir);

	public Object queryOrderInfo(String code);
}
