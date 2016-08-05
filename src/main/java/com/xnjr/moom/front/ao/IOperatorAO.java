package com.xnjr.moom.front.ao;

import java.util.List;

public interface IOperatorAO {

    /**
     * 选择一个型号，提交订单
     * @param applyUser
     * @param modelCode
     * @param quantity
     * @param salePrice
     * @param addressCode
     * @param applyNote
     * @param receiptType
     * @param receiptTitle
     * @return
     */
    public Object submitOrder(String applyUser, String modelCode,
            String quantity, String salePrice, String addressCode,
            String applyNote, String receiptType, String receiptTitle);

    /**
     * 支付订单
     * @param code
     * @param userId
     * @param tradePwd
     * @return
     */
    public Object payOrder(String code, String userId, String tradePwd);

    /**
     * 取消订单
     * @param code
     * @param userId
     * @param applyNote
     * @return
     */
    public Object cancelOrder(String code, String userId, String applyNote);

    /**
     * 订单分页查询
     * @param applyUser
     * @param status
     * @param limit
     * @param orderColumn
     * @param orderDir
     * @param start
     * @return
     */
    public Object queryPageOrders(String applyUser, String status,
            String limit, String orderColumn, String orderDir, String start);

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
     * @return
     */
    public Object queryOrders(String applyUser, String status);

    /**
     * 将型号添加至购物车
     * @param userId
     * @param modelCode
     * @param quantity
     * @return
     */
    public Object add2Cart(String userId, String modelCode, String quantity);

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
     * 购物车选中型号，批量提交订单
     * @param applyUser
     * @param cartCodeList
     * @param addressCode
     * @param applyNote
     * @param receiptType
     * @param receiptTitle
     * @return
     */
    public Object submitCart(String applyUser, List<String> cartCodeList,
            String addressCode, String applyNote, String receiptType,
            String receiptTitle);

    /**
     * 查询购物车型号列表
     * @param userId
     * @return
     */
    public Object queryCart(String userId);

    /**
     * 货分页查询
     * @param userId
     * @param code
     * @param modelCode
     * @param logisticsCode
     * @param start
     * @param limit
     * @param orderColumn
     * @param orderDir
     * @return
     */
    public Object queryPageCommodity(String userId, String code,
            String modelCode, String logisticsCode, String start, String limit,
            String orderColumn, String orderDir);

    /**
     * 维修单提交
     * @param userId
     * @param goodsCode
     * @param applyUser
     * @param contact
     * @param applyReason
     * @return
     */
    public Object submitRepairOrder(String userId, String goodsCode,
            String applyUser, String contact, String applyReason);

    /**
     * 维修单分页查询
     * @param userId
     * @param code
     * @param goodsCode
     * @param applyUser
     * @param status
     * @param updater
     * @param start
     * @param limit
     * @param orderColumn
     * @param orderDir
     * @return
     */
    public Object queryPageRepairOrder(String userId, String code,
            String goodsCode, String applyUser, String status, String updater,
            String start, String limit, String orderColumn, String orderDir);

    /**
     * 分页查询受款账号
     * @param companyCode
     * @param subbranch
     * @param cardNo
     * @param status
     * @param start
     * @param limit
     * @param orderColumn
     * @param orderDir
     * @return 
     * @history:
     */
    public Object queryPageAccountNumber(String companyCode, String subbranch,
            String cardNo, String status, String start, String limit,
            String orderColumn, String orderDir);

    /**
     * 列表查询受款账号
     * @param companyCode
     * @param subbranch
     * @param cardNo
     * @param status
     * @return 
     * @history:
     */
    public Object queryAccountNumberList(String companyCode, String subbranch,
            String cardNo, String status);

    /**
     * 详情查询受款账号
     * @param code
     * @return 
     * @history:
     */
    public Object queryAccountNumber(String code);
}
