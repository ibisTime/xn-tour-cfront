/**
 * @Title IUserAO.java 
 * @Package com.ibis.pz.ao 
 * @Description 
 * @author miyb  
 * @date 2015-5-12 下午1:43:05 
 * @version V1.0   
 */
package com.xnjr.moom.front.ao;

import java.util.Map;

/**
 * @author: miyb
 * @since: 2015-5-12 下午1:43:05
 * @history:
 */
public interface IUserAO {
	/**
	 * 手机号是否存在
	 * 
	 * @param mobile
	 * @param companyCode
	 * @return
	 * @create: 2016年11月24日 下午1:53:23 wulq
	 * @history:
	 */
	public Object checkMobileExit(String mobile, String companyCode);

	/**
	 * 用户注册
	 * 
	 * @param mobile
	 * @param loginPwd
	 * @param userReferee
	 * @param smsCaptcha
	 * @param companyCode
	 * @return
	 * @create: 2016年11月24日 下午1:35:47 wulq
	 * @history:
	 */
	public Map doRegister(String mobile, String loginPwd, String userReferee,
			String smsCaptcha, String companyCode);

	/**
	 * 用户登陆
	 * 
	 * @param loginName
	 * @param loginPwd
	 * @param companyCode
	 * @return
	 * @create: 2016年11月24日 下午1:39:59 wulq
	 * @history:
	 */
	public Map doLogin(String loginName, String loginPwd, String companyCode);

	/**
	 * 查询用户的详细信息
	 * 
	 * @param userId
	 * @return
	 * @create: 2016年11月24日 下午1:55:13 wulq
	 * @history:
	 */
	public Map doGetUser(String userId);

	/**
	 * 找回登录密码
	 * 
	 * @param mobile
	 * @param newLoginPwd
	 * @param smsCaptcha
	 * @param companyCode
	 * @return
	 * @create: 2016年11月24日 下午1:48:14 wulq
	 * @history:
	 */
	public Object doFindLoginPwd(String mobile, String newLoginPwd,
			String smsCaptcha, String companyCode);

	/**
	 * 重置登陆密码
	 * 
	 * @param userId
	 * @param oldPwd
	 * @param newPwd
	 * @create: 2016年11月24日 下午1:55:28 wulq
	 * @history:
	 */
	public void doResetLoginPwd(String userId, String oldPwd, String newPwd);

	/**
	 * 更换手机号
	 * 
	 * @param userId
	 * @param newMobile
	 * @param smsCaptcha
	 * @create: 2016年11月24日 下午1:55:56 wulq
	 * @history:
	 */
	public void doChangeMoblie(String userId, String newMobile,
			String smsCaptcha);

	/**
	 * 添加收件地址
	 * 
	 * @param userId
	 * @param addressee
	 * @param mobile
	 * @param province
	 * @param city
	 * @param district
	 * @param detailAddress
	 * @param isDefault
	 * @return
	 * @create: 2016年11月24日 下午1:56:07 wulq
	 * @history:
	 */
	public Object addAddress(String userId, String addressee, String mobile,
			String province, String city, String district,
			String detailAddress, String isDefault);

	/**
	 * 删除收件地址
	 * 
	 * @param code
	 * @return
	 * @create: 2016年11月24日 下午1:56:15 wulq
	 * @history:
	 */
	public Object deleteAddress(String code);

	/**
	 * 修改收件地址
	 * 
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
	 * @create: 2016年11月24日 下午1:56:23 wulq
	 * @history:
	 */
	public Object editAddress(String code, String userId, String addressee,
			String mobile, String province, String city, String district,
			String detailAddress, String isDefault);

	/**
	 * 设置收件地址默认地址
	 * 
	 * @param code
	 * @param userId
	 * @return
	 * @create: 2016年11月24日 下午1:56:32 wulq
	 * @history:
	 */
	public Object setDefaultAddress(String code, String userId);

	/**
	 * 列表查询收件地址
	 * 
	 * @param code
	 * @param userId
	 * @param isDefault
	 * @return
	 * @create: 2016年11月24日 下午1:56:40 wulq
	 * @history:
	 */
	public Object queryAddresses(String code, String userId, String isDefault);

	/**
	 * 详情查询收件地址
	 * 
	 * @param code
	 * @return
	 * @create: 2016年11月24日 下午1:56:54 wulq
	 * @history:
	 */
	public Object queryAddress(String code);

	/**
	 * 扫描卡券二维码
	 * 
	 * @param userId
	 * @param couponCode
	 * @return
	 * @create: 2016年11月24日 下午9:55:19 wulq
	 * @history:
	 */
	public Object addCoupon(String userId, String couponCode);
}
