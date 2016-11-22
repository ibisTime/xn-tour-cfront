package com.xnjr.moom.front.ao;


public interface ICommodityAO {
	/**
	 * 查询列表产品
	 * @param category
	 * @param type
	 * @param name
	 * @param status
	 * @param companyCode
	 * @return
	 */
	public Object queryListProducts(String category, String type,
			String name, String status, String companyCode);
	/**
	 * 详情查询产品
	 * @param code
	 * @return
	 */
	public Object queryProduct(String code);
	/**
	 * 分页查询产品
	 * @param category
	 * @param type
	 * @param name
	 * @param status
	 * @param companyCode
	 * @param start
	 * @param limit
	 * @param orderColumn
	 * @param orderDir
	 * @param location
	 * @return
	 */
	public Object queryPageProducts(String category, String type,
			String name, String status, String companyCode,
			String start, String limit, String orderColumn,
			String orderDir, String location);
	/**
	 * 列表查询类别
	 * @param parentCode
	 * @param name
	 * @param companyCode
	 * @return
	 */
	public Object queryListCategory(String parentCode, String name, String companyCode);
}
