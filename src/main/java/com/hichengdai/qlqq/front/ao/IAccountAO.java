package com.hichengdai.qlqq.front.ao;

public interface IAccountAO {

    /**
     * 查询资金明细
     * @param userId
     * @param accountNumber
     * @param ajNo
     * @param start
     * @param limit
     * @param bizType
     * @param dateStart
     * @param dateEnd
     * @return 
     * @history:
     */
    Object queryAccountDetail(String userId, String start, String limit);

}
