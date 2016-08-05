package com.xnjr.moom.front.req;

public class XN802211Req {
    // 账户标号
    private String accountNumber;

    // 取现金额
    private String amount;

    // 取现方式
    private String toType;

    // 取现编号
    private String toCode;

    // 交易密码
    private String tradePwd;

    // 开户支行
    private String toBelong;

    public String getToBelong() {
        return toBelong;
    }

    public void setToBelong(String toBelong) {
        this.toBelong = toBelong;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getToType() {
        return toType;
    }

    public void setToType(String toType) {
        this.toType = toType;
    }

    public String getToCode() {
        return toCode;
    }

    public void setToCode(String toCode) {
        this.toCode = toCode;
    }

    public String getTradePwd() {
        return tradePwd;
    }

    public void setTradePwd(String tradePwd) {
        this.tradePwd = tradePwd;
    }
}
