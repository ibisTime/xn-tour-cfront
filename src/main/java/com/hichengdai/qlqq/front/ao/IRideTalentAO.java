package com.hichengdai.qlqq.front.ao;

public interface IRideTalentAO {
	public Object apply(String userId, String description, String label,
			String pic1, String pic2, String pic3, String price,
			String province, String city, String area, String time,
			String note, String realName, String wechat, String mobile,
			String payType, String payAccount);

	public Object comment(String content, String parentCode,
			String commentator, String remark, String entityCode);

	public Object gratuity(String rider, String amount, String userId);

	public Object follow(String rider, String userId);

	public Object queryPage(String userId, String realName, String wechat,
			String mobile, String status, String start, String limit);

	public Object queryList();
}
