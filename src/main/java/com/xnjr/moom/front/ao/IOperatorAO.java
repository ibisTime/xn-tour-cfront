package com.xnjr.moom.front.ao;

import java.util.List;

public interface IOperatorAO {
	
	/**
     * 将型号添加至购物车
     * @param userId
     * @param modelCode
     * @param quantity
     * @return
     */
    public Object add2Cart(String userId, String productCode, String quantity);

    /**
     * 将型号从购物车中删除
     * @param userId
     * @param code
     * @return
     */
    public Object deleteFromCart(String userId, String code);

    /**
     * 将多个型号从购物车中删除
     * @param userId
     * @param cartCodeList
     * @return
     */
    public Object deleteCartItems(String userId, List<String> cartCodeList);

    /**
     * 编辑购物车中的型号
     * @param userId
     * @param code
     * @param quantity
     * @return
     */
    public Object editCart(String userId, String code, String quantity);

    /**
     * 查询购物车型号分页列表
     * @param userId
     * @param start
     * @param limit
     * @param orderColumn
     * @param orderDir
     * @return
     */
    public Object queryPageCart(String userId, String start, String limit,
            String orderColumn, String orderDir);
    

    /**
     * 查询购物车型号列表
     * @param userId
     * @return
     */
    public Object queryCartList(String userId);
	
    /**
     * 购物车选中型号，批量提交订单
     * @param receiver
     * @param reMobile
     * @param reAddress
     * @param applyUser
     * @param applyNote
     * @param receiptType
     * @param receiptTitle
     * @param cartCodeList
     * @return
     */
    public Object submitCart(String receiver, String reMobile,
    		String reAddress, String applyUser, String applyNote,
    		String receiptType, String receiptTitle,
    		List<String> cartCodeList);
	
    /**
     * 选择一个产品，提交订单
     * @param productCode
     * @param quantity
     * @param receiver
     * @param reMobile
     * @param reAddress
     * @param applyUser
     * @param applyNote
     * @param receiptType
     * @param receiptTitle
     * @return
     */
    public Object submitOrder(String productCode, String quantity,
            String receiver, String reMobile, String reAddress,
            String applyUser, String applyNote, String receiptType,
            String receiptTitle);

    /**
     * 支付订单
     * @param code
     * @param userId
     * @return
     */
    public Object payOrder(String code, String userId);

    /**
     * 取消订单
     * @param code
     * @param userId
     * @param remark
     * @return
     */
    public Object cancelOrder(String code, String userId, String remark);
    
    /**
     * 物流单确认收货
     * @param code
     * @param updater
     * @param remark
     * @return
     */
    public Object confirmOrder(String code, String updater, String remark);
    
    /**
     * 订单分页查询
     * @param applyUser
     * @param status
     * @param limit
     * @param orderColumn
     * @param orderDir
     * @param start
     * @param mobile
     * @param companyCode
     * @return
     */
    public Object queryPageOrders(String applyUser, String status,
            String limit, String orderColumn, String orderDir,
            String start, String mobile, String companyCode);

    /**
     * 订单详情查询
     * @param invoiceCode
     * @return
     */
    public Object queryOrder(String invoiceCode);

    /**
     * 订单列表查询
     * @param applyUser
     * @param status
     * @param mobile
     * @param companyCode
     * @return
     */
    public Object queryOrders(String applyUser, String status,
    		String mobile, String companyCode);

}
