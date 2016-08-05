package com.xnjr.moom.front.ao;

import java.util.List;

import com.xnjr.moom.front.res.XNlh5034Res;

public interface IGeneralAO {
    public List queryBanks(String status, String orderColumn, String orderDir);

    public XNlh5034Res queryUrl(String key);
}
