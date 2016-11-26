package com.xnjr.moom.front.ao;

public interface IGeneralAO {
	public Object getCompanyByUrl(String url);

	public Object getPageBroadcast(String title, String toCompany,
			String toLevel, String toUser, String companyCode, String updater,
			String start, String limit);

	public Object getBroadcastInfo(String code);

	public Object getInfoByKey(String key, String companyCode);
}
