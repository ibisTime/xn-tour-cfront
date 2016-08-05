package com.xnjr.moom.front.enums;

/** 
 * 服务类型
 * @author: miyb 
 * @since: 2015-2-26 下午2:42:59 
 * @history:
 */
public enum EServe {
    XJGL("A", "现金管理"), MYCG("B", "贸易重构"), CBYH("C", "财报优化"), SZGL("D", "市值管理"), 
    QYJB("E", "企业降本"), DFMS("1", "等分模式"), YXLHMS("2", "有限劣后模式"), XMZC("a", "项目众筹"), 
    JRZC("b", "金融众筹");

    EServe(String code, String value) {
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
