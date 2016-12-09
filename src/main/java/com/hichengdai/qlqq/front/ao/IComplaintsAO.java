package com.hichengdai.qlqq.front.ao;

public interface IComplaintsAO {
	public Object publish(String type, String title, String content,
			String remark, String submiter);

	public Object queryPageComplaints(String status, String start,
			String limit, String orderColumn, String orderDir);

	public Object queryInfo(String code);
}
