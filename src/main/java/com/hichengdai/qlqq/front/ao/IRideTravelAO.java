package com.hichengdai.qlqq.front.ao;

import java.util.List;

import com.hichengdai.qlqq.front.req.RideImgObj;

public interface IRideTravelAO {

	public Object publishRide(String title, String cover, String label1,
			String label2, String label3, List<RideImgObj> picList,
			String publisher, String isPublish);

	public Object editDraft(String code, String title, String cover,
			String label1, String label2, String label3,
			List<RideImgObj> picList, String publisher, String isPublish);

	public Object comment(String content, String parentCode,
			String commentator, String remark, String entityCode);

	public Object like(String travelNoteCode, String userId);

	public Object collection(String travelNoteCode, String userId);

	public Object gratuity(String travelNoteCode, String amount, String userId);

	public Object read(String travelNoteCode, String userId);

	public Object queryPage(String title, String label1, String label2,
			String label3, String status, String publisher, String start,
			String limit, String orderColumn, String orderDir);

	public Object info(String code);

	public Object queryCollectionPage(String userId, String start,
			String limit, String orderColumn, String orderDir);
}
