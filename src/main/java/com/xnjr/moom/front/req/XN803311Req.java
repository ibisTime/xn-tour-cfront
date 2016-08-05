package com.xnjr.moom.front.req;

public class XN803311Req {

    // userId(必填)
    private String userId;

    // 服务ID(非必填)
    private String serveId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getServeId() {
        return serveId;
    }

    public void setServeId(String serveId) {
        this.serveId = serveId;
    }

}
