package com.xnjr.moom.front.ao;

public interface ICommodityAO {
	/**
	 * 查询列表产品
	 * 
	 * @param category
	 * @param type
	 * @param name
	 * @param status
	 * @param companyCode
	 * @return
	 */
	public Object queryListProducts(String category, String type, String name,
			String status, String companyCode);

	/**
	 * 详情查询产品
	 * 
	 * @param code
	 * @return
	 */
	public Object queryProduct(String code);

	/**
	 * 分页查询产品
	 * 
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
	public Object queryPageProducts(String category, String type, String name,
			String status, String companyCode, String start, String limit,
			String orderColumn, String orderDir, String location);

	/**
	 * 列表查询类别
	 * 
	 * @param parentCode
	 * @param name
	 * @param companyCode
	 * @param type
	 * @return
	 * @create: 2016年11月24日 下午5:07:19 wulq
	 * @history:
	 */
	public Object queryListCategory(String parentCode, String name,
			String companyCode, String type);

	/**
	 * 分页查询类别
	 * 
	 * @param parentCode
	 * @param name
	 * @param companyCode
	 * @param type
	 * @param start
	 * @param limit
	 * @param orderColumn
	 * @param orderDir
	 * @return
	 * @create: 2016年11月24日 下午5:11:40 wulq
	 * @history:
	 */
	public Object queryPageCategory(String parentCode, String name,
			String companyCode, String type, String start, String limit,
			String orderColumn, String orderDir);
}
