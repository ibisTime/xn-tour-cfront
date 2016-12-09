package com.hichengdai.qlqq.front.ao;

import java.util.Map;

public interface IGeneralAO {
	public Object getCompanyByUrl(String url);

	public Object getInfoByKey(String key, String companyCode);

	/**
	 * 列表查询密码记录(微信公众号配置)
	 * 
	 * @param type
	 * @param account
	 * @param companyCode
	 * @return
	 */
	public Map[] queryPasswordList(String type, String account,
			String companyCode);
}
