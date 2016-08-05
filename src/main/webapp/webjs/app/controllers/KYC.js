define([
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/views/KYCPanel1',
    'app/views/KYCPanel2',
    'app/views/KYCPanel3',
    'app/ux/GenericPrompt',
    'app/ux/GenericTooltip',
    'app/ux/GenericWindow',
    'dojo/_base/lang',
    'app/controllers/Helper',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, Global, KYCPanel1, KYCPanel2, KYCPanel3, Prompt, Tooltip, Win, lang, Helper) {

    var panel1, panel2, panel3, companyId = Global.getUrlParam('c'), step = Global.getUrlParam('s'), company = {}, win, isLetter;
    if (companyId) {
        var url = Global.baseUrl + '/company/edit';
    } else {
        var url = Global.baseUrl + '/company/addAll';
    }
    function initView() {
        // request data by ajax, render data
        showStep1();

        if (step == 2) {
            showStep2();
        }
    }

    function finishStep1(letter) {
        panel1.confirmBtn.loading(true);
        if (!isLetter && companyId) {
            var params = {
                code: companyId,
                name: panel1.companyFld.get('value'),
                gsyyzzNo: panel1.licenceFld.get('value'),
                idNo: panel1.IDNoFld.get('value'),
                realName: panel1.realNameFld.get('value'),
                capital: panel1.amountFld.getAmount(),
                province: panel1.addressFld.get('value'),
                city: panel1.cityFld.get('value'),
                idKind: panel1.IDTypeFld.value,
                currency: panel1.currencyTypeFld.value
            };
            url = Global.baseUrl + '/company/edit';
        } else {
            var params = {
                name: panel1.companyFld.get('value'),
                gsyyzzNo: panel1.licenceFld.get('value'),
                idNo: panel1.IDNoFld.get('value'),
                realName: panel1.realNameFld.get('value'),
                capital: panel1.amountFld.getAmount(),
                province: panel1.addressFld.get('value'),
                city: panel1.cityFld.get('value'),
                bankCode: panel1.bankFld.value,
                subbranch: panel1.subbankFld.get('value'),
                cardNo: panel1.bankAccountFld.get('value'),
                idKind: panel1.IDTypeFld.value,
                currency: panel1.currencyTypeFld.value
            };
            url = Global.baseUrl + '/company/addAll';
            isLetter = false;
            companyId = '';
        }
        Ajax.post(url, params).then(function(response) {
            panel1.confirmBtn.loading(false);
            if (response.success) {
                companyId = companyId || response.data.code;
                url = Global.baseUrl + '/company/edit';
                showStep2(letter);
            } else {
                Tooltip.show(response.msg, panel1.confirmBtn.innerNode, 'warning');
            }
        });
    }

    function showStep1() {
        query('.processOne').addClass('active');
        query('.processTwo').removeClass('active');
        if (!panel1) {
            panel1 = new KYCPanel1({
                company: companyId
            });
            panel1.placeAt('container');

            if (companyId) {
                Ajax.post(Global.baseUrl + '/company/detail', {
                    'code': companyId
                }).then(function(res) {
                    if (res.success) {
                        var data = res.data;
                        company = data;
                        panel1.setData(data);
                    }
                });
            }


            on(panel1.confirmBtn, 'click', function() {
                if (panel1.isValid()) {
                    Ajax.get(Global.baseUrl + '/company/exist', {
                        'name': company.name || panel1.companyFld.get('value'),
                        'gsyyzzNo': company.gsyyzzNo || panel1.licenceFld.get('value')
                    }).then(function(res) {
                        if (res.success && res.data && res.data.companyCode) {
                            if (!win) {
                                win = new Win({
                                    msg: '<b>该公司已经审核通过，只需提交公函文件即可，是否申请加入？</b></br><span>（企业账户请在审核通过后添加）</span>',
                                    confirmAndCancel: true,
                                    onConfirm: function() {
                                        win.hide();
                                        companyId = res.data.companyCode;
                                        url = Global.baseUrl + '/company/edit';
                                        showStep2(true);
                                        isLetter = true;
                                    },
                                    onCancel: function() {
                                        win.hide();
                                        Tooltip.show('请重新填写企业名称与工商执照注册号', panel1.companyFld.domNode, 'info');
                                    }
                                });
                                win.placeAt(document.body);
                            }

                            win.show();
                        } else {
                            finishStep1();
                        }
                    });

                }

            });
        }
        panel1 && (panel1.domNode.style.display = 'block');
        panel2 && (panel2.domNode.style.display = 'none');
    }

    function showStep2(letter) {
        query('.processOne').removeClass('active');
        query('.processTwo').addClass('active');
        panel2 = new KYCPanel2({
            isLetter: letter
        });
        panel2.placeAt('container');
        if (companyId) {
            Ajax.post(Global.baseUrl + '/company/detail', {
                'code': companyId
            }).then(function(res) {
                if (res.success) {
                    var data = res.data;
                    panel2.setData(data);
                }
            });
            //if (!isLetter) {
            //    Ajax.get(Global.baseUrl + '/company/letter/list', {
            //        'companyCode': companyId
            //    }).then(function(res) {
            //        if (res.success) {
            //            var data = res.data[0];
            //            if (data.sqghPicture) {
            //                panel2.setData({'sqghPicture': data.sqghPicture});
            //            }
            //        }
            //    });
            //}

        }
        on(panel2.prevBtn, 'click', function() {
            showStep1();
        });
        on(panel2.confirmBtn, 'click', function() {
            if (panel2.isValid()) {
                panel2.confirmBtn.loading(true);
                if (panel2.isLetter) {
                    Ajax.post(Global.baseUrl + '/company/letter/add', {
                        companyCode: companyId,
                        sqghPicture: panel2.s6.src
                    }).then(function(response) {
                        panel2.confirmBtn.loading(false);
                        if (response.success) {
                            query('.processTwo').removeClass('active');
                            query('.processThree').addClass('active');
                            panel2.domNode.style.display = 'none';
                            panel3 = new KYCPanel3({
                            });
                            panel3.placeAt('container');
                        } else {
                            Tooltip.show(response.msg, panel2.confirmBtn.innerNode, 'warning');
                        }
                    });
                } else {
                    Ajax.post(Global.baseUrl + '/company/picture/upload', {
                        code: companyId,
                        gsyyzzPicture: panel2.s1.src,
                        zzjgdmzPicture: panel2.s2.src,
                        swdjzPicture: panel2.s3.src,
                        frPicture: panel2.s4.src,
                        dzzPicture: panel2.s5.src,
                        sqghPicture: panel2.s6.src,
                        otherPicture: panel2.s7.src
                    }).then(function(response) {
                        panel2.confirmBtn.loading(false);
                        if (response.success) {
                            query('.processTwo').removeClass('active');
                            query('.processThree').addClass('active');
                            panel2.domNode.style.display = 'none';
                            panel3 = new KYCPanel3({
                            });
                            panel3.placeAt('container');
                        } else {
                            Tooltip.show(response.msg, panel2.confirmBtn.innerNode, 'warning');
                        }
                    });
                }

            }

        });
        panel2 && (panel2.domNode.style.display = 'block');
        panel1 && (panel1.domNode.style.display = 'none');
    }

    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});