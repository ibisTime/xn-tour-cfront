package com.xnjr.moom.front.enums;

public enum EBankCardType {
    User("1", "个人账户"), Company("2", "公司账户");

    EBankCardType(String code, String value) {
        this.code = code;
        this.value = value;
    }

    private String code;

    private String value;

    public String getCode() {
        return code;
    }

    public String getValue() {
        return value;
    }
}
