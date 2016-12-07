/**
 * @Title IUserAO.java 
 * @Package com.ibis.pz.ao 
 * @Description 
 * @author miyb  
 * @date 2015-5-12 下午1:43:05 
 * @version V1.0   
 */
package com.hichengdai.qlqq.front.ao;

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
	 * @return
	 * @create: 2016年12月7日 上午10:29:25 wulq
	 * @history:
	 */
	public Object checkMobileExit(String mobile);

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
	 * @return
	 * @create: 2016年12月7日 上午11:15:08 wulq
	 * @history:
	 */
	public Object doFindLoginPwd(String mobile, String newLoginPwd,
			String smsCaptcha);

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
	 * 绑定手机号
	 * 
	 * @param userId
	 * @param mobile
	 * @param smsCaptcha
	 * @param companyCode
	 * @return
	 * @create: 2016年11月29日 下午4:13:33 wulq
	 * @history:
	 */
	public Object doBindMoblie(String userId, String mobile, String smsCaptcha,
			String companyCode);
}
