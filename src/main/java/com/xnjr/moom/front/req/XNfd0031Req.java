package com.xnjr.moom.front.req;

public class XNfd0031Req extends APageReq {
    /** 
     * @Fields serialVersionUID : TODO(用一句话描述这个变量表示什么) 
     */
    private static final long serialVersionUID = 6071246599336546565L;

    // 用户编号(必填)
    private String userId;

    // 业务类型（0虚拟币兑换;1充值-1取现;2转入-2转出;9蓝补-9红冲）
    private String bizType;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getBizType() {
        return bizType;
    }

    public void setBizType(String bizType) {
        this.bizType = bizType;
    }

}
