/**
 * @Title IUserAO.java 
 * @Package com.ibis.pz.ao 
 * @Description 
 * @author miyb  
 * @date 2015-5-12 下午1:43:05 
 * @version V1.0   
 */
package com.xnjr.moom.front.ao;

import com.xnjr.moom.front.res.XN805041Res;
import com.xnjr.moom.front.res.XN805043Res;
import com.xnjr.moom.front.res.XN805056Res;

/** 
 * @author: miyb 
 * @since: 2015-5-12 下午1:43:05 
 * @history:
 */
public interface IUserAO {
    /**
     * 手机号是否存在
     * @param mobile 
     * @create: 2016年1月21日 下午1:30:49 myb858
     * @history:
     */
    public Object checkMobileExit(String mobile);

    /**
     * 用户注册
     * @param mobile
     * @param loginPwd
     * @param registerIp
     * @param userReferee
     * @param smsCaptcha
     * @return 
     * @create: 2015年9月19日 上午11:24:33 myb858
     * @history:
     */
    public XN805041Res doRegister(String mobile, String loginPwd,
            String userReferee, String smsCaptcha);

    /**
     * 身份认证
     * @param userId
     * @param realName
     * @param idKind
     * @param idNo
     * @create: 2015-3-22 下午3:26:44 xieyj
     * @history:
     */
    public void doIdentify(String userId, String realName, String idKind,
            String idNo);

    /**
     * 设置交易密码
     * @param userId
     * @param tradePwd
     * @param smsCaptcha
     * @return 
     * @create: 2015年9月19日 上午11:25:35 myb858
     * @history:
     */
    public void doSetTradePwd(String userId, String tradePwd, String smsCaptcha);

    /**
     * 用户登陆
     * @param loginName
     * @param loginPwd
     * @param loginIp
     * @create: 2014-12-10 下午7:37:18 miyb
     * @history:
     */

    public XN805043Res doLogin(String loginName, String loginPwd);

    /**
     * 查询用户的详细信息
     * @param userId
     * @create: 2014-12-10 下午7:37:18 miyb
     * @history:
     */
    public XN805056Res doGetUser(String userId);

    /**
     * 找回登录密码
     * @param mobile
     * @param newLoginPwd
     * @param smsCaptcha
     * @return 
     * @create: 2015年9月18日 上午10:44:31 myb858
     * @history:
     */
    public void doFindLoginPwd(String mobile, String newLoginPwd,
            String smsCaptcha);

    /**
     * 重置登陆密码
     * @param userId
     * @param oldPwd
     * @param newPwd
     * @create: 2015-3-22 下午3:55:03 xieyj
     * @history:
     */
    public void doResetLoginPwd(String userId, String oldPwd, String newPwd);

    /**
     * 找回交易密码
     * @param userId
     * @param newTradePwd
     * @param smsCaptcha
     * @param idKind
     * @param idNo
     * @return 
     * @create: 2015年9月18日 上午11:14:39 myb858
     * @history:
     */
    public void doFindTradePwd(String userId, String newTradePwd,
            String smsCaptcha);

    /**
     * 重置交易密码
     * @param userId
     * @param oldTradePwd
     * @param newTradePwd
     * @create: 2015-3-22 下午4:03:31 xieyj
     * @history:
     */
    public void doResetTradePwd(String userId, String oldTradePwd,
            String newTradePwd);

    /**
     * 更换手机号
     * @param userId
     * @param newMobile
     * @param smsCaptcha
     * @param tradePwd
     * @return 
     * @create: 2015年9月18日 上午11:21:26 myb858
     * @history:
     */
    public void doChangeMoblie(String userId, String newMobile,
            String smsCaptcha, String tradePwd);

    /**
     * 检查是否实名
     * @param userId
     * @return 
     * @create: 2015-3-22 下午3:26:51 xieyj
     * @history:
     */
    public boolean doIdentityCheck(String userId);

    /**
     * 获取登录日志
     * @param userId
     * @return 
     * @create: 2015年9月29日 上午11:53:44 myb858
     * @history:
     */
    public Object doGetLog(String userId);

    /**
     * 实名认证+交易密码设置
     * @param userId
     * @param realName
     * @param idKind
     * @param idNO
     * @param tradePwd
     * @param tradeCaptcha 
     * @create: 2016年1月28日 下午3:45:55 myb858
     * @history:
     */
    public void doIdentifySetTradePwd(String userId, String realName,
            String idKind, String idNO, String tradePwd, String tradeCaptcha);

    /**
     * 设置个体户
     * @param userId
     * @return 
     * @create: 2016年5月5日 下午9:03:55 xieyj
     * @history:
     */
    Object doKyc(String userId);

    /**
     * 添加收件地址
     * @param userId
     * @param addressee
     * @param mobile
     * @param province
     * @param city
     * @param district
     * @param detailAddress
     * @param isDefault
     * @return
     */
    public Object addAddress(String userId, String addressee, String mobile,
            String province, String city, String district,
            String detailAddress, String isDefault);

    /**
     * 删除收件地址
     * @param code
     * @return
     */
    public Object deleteAddress(String code);

    /**
     * 修改收件地址
     * @param code
     * @param userId
     * @param addressee
     * @param mobile
     * @param province
     * @param city
     * @param district
     * @param detailAddress
     * @param isDefault
     * @return
     */
    public Object editAddress(String code, String userId, String addressee,
            String mobile, String province, String city, String district,
            String detailAddress, String isDefault);

    /**
     * 设置收件地址默认地址
     * @param code
     * @param userId
     * @return
     */
    public Object setDefaultAddress(String code, String userId);

    /**
     * 列表查询收件地址
     * @param code
     * @param userId
     * @param isDefault
     * @return
     */
    public Object queryAddresses(String code, String userId, String isDefault);

    /**
     * 详情查询收件地址
     * @param code
     * @return
     */
    public Object queryAddress(String code);
}
