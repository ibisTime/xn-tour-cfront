package com.xnjr.moom.front.res;

public class XN802400Res {
    // userid
    private String userId;

    // 账号
    private String accountNumber;

    // 状态(0正常,1程序锁定,2人工锁定)
    private String status;

    // 账户余额(精确到厘）
    private Long amount;

    // 冻结金额（精确到厘）
    private Long frozenAmount;

    // 币种（默认CNY）
    private String currency;

    // ------------
    // 账户余额(精确到元）
    private Double view_amount;

    // 冻结金额(精确到元）
    private Double view_frozenAmount;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

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

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public Long getFrozenAmount() {
        return frozenAmount;
    }

    public void setFrozenAmount(Long frozenAmount) {
        this.frozenAmount = frozenAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Double getView_amount() {
        return view_amount;
    }

    public void setView_amount(Double view_amount) {
        this.view_amount = view_amount;
    }

    public Double getView_frozenAmount() {
        return view_frozenAmount;
    }

    public void setView_frozenAmount(Double view_frozenAmount) {
        this.view_frozenAmount = view_frozenAmount;
    }

}
