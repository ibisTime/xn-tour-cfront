package com.xnjr.moom.front.req;

public class XN602023Req {
    // 订单编号
    private String code;

    // 用户编号
    private String userId;

    // 取消说明
    private String approveNote;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getApproveNote() {
        return approveNote;
    }

    public void setApproveNote(String approveNote) {
        this.approveNote = approveNote;
    }
}
