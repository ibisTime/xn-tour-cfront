package com.hichengdai.qlqq.front.ao;

public interface IDictAO {
    public Object queryDictList(String type, String parentKey, String dkey);
    public Object querySysConfig(String userId, String ckey,
    		String start, String limit, String orderColumn, String orderDir);
}
