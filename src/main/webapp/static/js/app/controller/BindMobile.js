define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    init();
    var COMPANYCODE;

    function init() {
        if (!base.isLogin()) {
            location.href = "./login.html?return=" + base.makeReturnUrl();
        } else {
            if (COMPANYCODE = sessionStorage.getItem("compCode")) {
                addListeners();
            } else {
                base.getCompanyByUrl()
                    .then(function(res) {
                        if (COMPANYCODE = sessionStorage.getItem("compCode")) {
                            addListeners();
                        } else {
                            base.showMsg(res.msg);
                        }
                    }, function() {
                        base.showMsg("非常抱歉，暂时无法获取公司信息!");
                    });
            }
        }
    }

    function addListeners() {
        $("#sbtn").on("click", function(e) {
            bindMobile();
        });
        $("#getVerification").on("click", function() {
            if (validate_mobile()) {
                handleSendVerifiy();
            }
        });
    }

    function handleSendVerifiy() {
        var verification = $("#getVerification");
        verification.attr("disabled", "disabled");
        Ajax.post(APIURL + '/gene/bindmobile/send', {
            "mobile": $("#mobile").val()
        }).then(function(response) {
            if (response.success) {
                for (var i = 0; i <= 60; i++) {
                    (function(i) {
                        setTimeout(function() {
                            if (i < 60) {
                                verification.val((60 - i) + "s");
                            } else {
                                verification.val("获取验证码").removeAttr("disabled");
                            }
                        }, 1000 * i);
                    })(i);
                }
            } else {
                base.showMsg(response.msg);
                verification.val("获取验证码").removeAttr("disabled");
            }
        }, function() {
            base.showMsg("验证码获取失败");
            verification.val("获取验证码").removeAttr("disabled");
        });
    }

    function validate_mobile() {
        var value = $("#mobile").val();

        if (!value || value.trim() === "") {
            base.showMsg("手机号不能为空");
            return false;
        } else if (!/^1[3,4,5,7,8]\d{9}$/.test(value)) {
            base.showMsg("手机号格式错误");
            return false;
        }
        return true;
    }

    function validate_verification() {
        var value = $("#verification").val();
        if (!value || value.trim() === "") {
            base.showMsg("验证码不能为空");
            return false;
        } else if (!/^[\d]{4}$/.test(value)) {
            base.showMsg("验证码格式错误");
            return false;
        }
        return true;
    }

    function validate() {
        if (validate_mobile() && validate_verification()) {
            return true;
        }
        return false;
    }

    function doSuccess() {
        $("#sbtn").text("设置");
        base.showMsg("手机号绑定成功！");
        setTimeout(function() {
            location.href = './user_info.html';
        }, 1000);
    }

    function finalBindMobile() {
        $("#sbtn").attr("disabled", "disabled").text("设置中...");
        var param = {
            "mobile": $("#mobile").val(),
            "smsCaptcha": $("#verification").val(),
            "companyCode": COMPANYCODE
        };
        Ajax.post(APIURL + '/user/mobile/bind', param)
            .then(function(response) {
                if (response.success) {
                    doSuccess();
                } else {
                    $("#sbtn").removeAttr("disabled").text("设置");
                    base.showMsg(response.msg);
                }
            }, function() {
                $("#sbtn").removeAttr("disabled").text("设置");
                base.showMsg("手机号绑定失败，请稍后重试");
            });
    }

    function bindMobile() {
        if (validate()) {
            finalBindMobile();
        }
    }
});