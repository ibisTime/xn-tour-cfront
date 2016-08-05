package com.xnjr.moom.front.enums;

/** 
 * 报价模式
 * @author: miyb 
 * @since: 2015-2-26 下午2:42:59 
 * @history:
 */
public enum EQuote {
    NH_ZRR("A", "年化自然日"), NH_GZR("B", "年化工作日"), FC("C", "分成"), BDFC("D",
            "保底加分成");

    EQuote(String code, String value) {
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
