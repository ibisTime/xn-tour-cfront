package com.hichengdai.qlqq.front.ao;

public interface IActivityAO {
	public Object intentionApply(String activityCode, String userId);

	public Object comment(String content, String parentCode,
			String commentator, String remark, String entityCode);

	public Object consultationApply(String activityCode, String content,
			String remark, String submiter);

	public Object gratuity(String activityCode, String amount, String userId);

	public Object queryPageActivity(String publisher, String category,
			String status, String start, String limit, String orderColumn,
			String orderDir);

	public Object queryActivityInfo(String code);

	public Object apply(String applyUser, String productCode, String realName,
			String mobile, String bookNum);

	public Object payOrder(String code);

	public Object cancelOrder(String code);
}