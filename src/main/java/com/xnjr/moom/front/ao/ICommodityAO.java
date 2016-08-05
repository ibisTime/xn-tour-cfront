package com.xnjr.moom.front.ao;


public interface ICommodityAO {
	/**
	 * 列表查询产品
	 * @param type
	 * @param name
	 * @param updater
	 * @param status
	 * @return
	 */
	public Object queryProduces(String type, String name, String updater, String status);
	/**
	 * 详情查询产品
	 * @param code
	 * @return
	 */
	public Object queryProduce(String code);
	/**
	 * 查询列表型号
	 * @param code
	 * @param name
	 * @param status
	 * @param productCode
	 * @return
	 */
	public Object queryListModel(String code, String name, String status, String productCode);
	/**
	 * 详情查询型号
	 * @param code
	 * @return
	 */
	public Object queryModel(String code);
	/**
	 * 分页查询型号
	 * @param code
	 * @param name
	 * @param status
	 * @param productCode
	 * @param start
	 * @param limit
	 * @param orderColumn
	 * @param orderDir
	 * @return
	 */
	public Object queryPageModel(String code, String name, String status, String productCode,
			String start, String limit, String orderColumn, String orderDir, String productName);
}
