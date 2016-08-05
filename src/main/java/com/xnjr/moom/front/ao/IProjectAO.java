package com.xnjr.moom.front.ao;

public interface IProjectAO {

    /**
     * 真实认购
     * @param userId
     * @param projectCode
     * @param investAmount
     * @param tradePwd
     * @return 
     * @create: 2016年4月27日 下午4:03:16 xieyj
     * @history:
     */
    String investProject(String userId, String projectCode,
            String investAmount, String tradePwd);

    /**
     * 意向认购
     * @param userId
     * @param projectCode
     * @param nowAmount
     * @param nowNote
     * @param tradePwd
     * @return 
     * @create: 2016年4月27日 下午4:03:27 xieyj
     * @history:
     */
    String willInvestProject(String userId, String projectCode,
            String nowAmount, String nowNote, String tradePwd);

    /**
     * 查询我的真实认购记录
     * @param userId
     * @param serveId
     * @return 
     * @create: 2016年4月29日 上午11:40:19 xieyj
     * @history:
     */
    Object queryMyInvestList(String userId, String status);

    /**
     * 查询我的意向认购记录
     * @param userId
     * @param serveId
     * @return 
     * @create: 2016年4月29日 上午11:40:19 xieyj
     * @history:
     */
    Object queryMyWillInvestList(String userId, String status);

    /**
     * 查询可投标的
     * @param userId
     * @param serveId
     * @return 
     * @create: 2016年4月27日 下午4:03:43 xieyj
     * @history:
     */
    Object queryProjectList(String userId, String serveId);

    /**
     * 分页查询可投标的
     * @param userId
     * @param serveId
     * @return 
     * @create: 2016年4月27日 下午4:03:43 xieyj
     * @history:
     */
    Object queryProjectPage(String userId, String start, String limit,
            String orderColumn, String orderDir);

    /**
     * 获取标的详情
     * @param user_id
     * @param projectCode
     * @return 
     * @create: 2016年4月27日 下午4:03:59 xieyj
     * @history:
     */
    Object getProject(String userId, String projectCode);
}
