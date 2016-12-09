package com.hichengdai.qlqq.front.ao;

public interface INewsAO {
	public Object queryPageNews(String type, String title, String keywords,
			String publisher, String start, String limit, String orderColumn,
			String orderDir);

	public Object queryNewsInfo(String code);
}
