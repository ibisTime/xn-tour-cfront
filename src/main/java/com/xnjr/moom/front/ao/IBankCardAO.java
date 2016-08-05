package com.xnjr.moom.front.ao;

import java.util.List;

public interface IBankCardAO {
    /**
     * 绑定银行卡
     * @param userId
     * @param type
     * @param bankCode
     * @param bankName
     * @param bankCardNo
     * @param subbranch
     * @param bindMobile 
     * @create: 2016年1月19日 下午3:10:38 myb858
     * @history:
     */
    public void doBindBankCard(String userId, String bankCode, String bankCardNo, String subbranch);
    
    public Object doBindCompanyBankCard(String companyCode, String bankCode, String cardNo, String subbranch);
    
    public Object doEditBankCard(String id, String userId, String bankCode, 
    		String bankCardNo, String subbranch);
    
    public Object doEditCompanyBankCard(String id, String bankCode, String cardNo, String subbranch);
    
    public Object queryCompanyBankCardList(String companyCode);
    
    public Object queryCompanyBankCardPage(String companyCode, String start, String limit,
    		String orderColumn, String orderDir);
    
    public Object viewCompanyBankCard(String id);
    /*
     * 删除银行卡
     */
    public Object doDropBankCard(String id, String userId);
    
    public Object doViewBankCard(String id);

    /**
     * 获取银行卡列表
     */
    public Object queryBankCardList(String userId);
    
    /*
     * 分页查询银行卡
     */
    public Object queryBankCardPage(String userId, String start, String limit,
    		String orderColumn, String orderDir);
}
