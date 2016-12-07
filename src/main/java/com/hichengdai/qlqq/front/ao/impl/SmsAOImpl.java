/**
 * @Title SmsAOImpl.java 
 * @Package com.ibis.pz.ao.impl 
 * @Description 
 * @author miyb  
 * @date 2015-5-12 下午2:52:31 
 * @version V1.0   
 */
package com.hichengdai.qlqq.front.ao.impl;

import org.springframework.stereotype.Service;

import com.hichengdai.qlqq.front.ao.ISmsAO;
import com.hichengdai.qlqq.front.http.BizConnecter;
import com.hichengdai.qlqq.front.http.JsonUtils;
import com.hichengdai.qlqq.front.req.XN805904Req;

/** 
 * @author: miyb 
 * @since: 2015-5-12 下午2:52:31 
 * @history:
 */
@Service
public class SmsAOImpl implements ISmsAO {

    /** 
     * @see com.ibis.pz.ao.ISmsAO#sendSmsCaptcha(java.lang.String, java.lang.String)
     */
    @Override
    public void sendSmsCaptcha(String mobile, String bizType) {
        XN805904Req req = new XN805904Req();
        req.setMobile(mobile);
        req.setBizType(bizType);
        BizConnecter.getBizData("805904", JsonUtils.object2Json(req),
            Object.class);
    }
}