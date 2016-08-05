package com.xnjr.moom.front.req;

public class XNfd0050Req extends APageReq {
    /** 
     * @Fields serialVersionUID : TODO(用一句话描述这个变量表示什么) 
     */
    private static final long serialVersionUID = 6071246599336546565L;

    // 账号(必传字段，因为只能查某个账号的流水)
    private String accountNumber;

    // 状态
    private String status;

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
