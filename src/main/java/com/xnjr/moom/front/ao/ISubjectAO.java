package com.xnjr.moom.front.ao;


public interface ISubjectAO {

    Object querySubjectList(String userId, String status);

    Object queryInvestSubjectList(String userId);

    Object getSubject(String userId, String subjectCode);

    Object getBusiness(String userId, String businessCode);

    Object getContract(String contractNo);
}
