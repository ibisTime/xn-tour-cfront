package com.xnjr.moom.front.ao;


public interface ICompanyAO {

    Object addCompany(String name, String gsyyzzNo, String idKind, String idNo,
            String realName, String currency, String capital, String province,
            String city, String address, String userId);

    public Object addCompanyAndCard(String name, String gsyyzzNo,
            String idKind, String idNo, String realName, String currency,
            String capital, String province, String city, String address,
            String userId, String bankCode, String subbranch, String cardNo);

    String addCompanyInfo(String companyName, String licenceNo, String idNo,
            String realName, String capital, String province, String city,
            String IDKind, String currency, String address, String userId);

    Object editCompany(String code, String name, String gsyyzzNo,
            String idKind, String idNo, String realName, String currency,
            String capital, String province, String city, String address);

    Object uploadCompanyPicture(String code, String gsyyzzPicture,
            String zzjgdmzPicture, String swdjzPicture, String dzzPicture,
            String frPicture, String otherPicture);

    Object queryCompanyList(String userId);

    Object queryCompanyPage(String userId, String start, String limit,
            String orderColumn, String orderDir);

    Object getCompany(String code, String userId);

    Object applyCompany(String userId, String companyCode, String sqghPicture);

    Object companyLetterList(String userId, String companyCode, String status);

    Object queryRealCompanyList(String userId);

    Object isExistCompany(String name, String gsyyzzNo);

}
