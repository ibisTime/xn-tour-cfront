define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    var COMPANYCODE;
    init();

    function init() {
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

    function addListeners() {
        $("#password").on("change", validate_password)
            .on("focus", function() {
                $(this).siblings(".register_verifycon")
                    .css({
                        "display": "block"
                    });
            })
            .on("blur", function() {
                $(this).siblings(".register_verifycon")
                    .css({
                        "display": "none"
                    });
            });
        $("#repassword").on("change", validate_repassword)
            .on("focus", function() {
                $(this).siblings(".register_verifycon")
                    .css({
                        "display": "block"
                    });
            })
            .on("blur", function() {
                $(this).siblings(".register_verifycon")
                    .css({
                        "display": "none"
                    });
            });
        $("#sbtn").on("click", function() {
            valide();
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
        Ajax.post(APIURL + '/gene/findloginpwd/send', {
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

    function valide() {
        if (validate_mobile() && validate_verification() &&
            validate_password() && validate_repassword()) {
            findPassword();
        }
    }

    function findPassword() {
        $("#sbtn").attr("disabled", "disabled").text("设置中...");
        Ajax.post(APIURL + '/user/loginpwd/find', {
                "mobile": $("#mobile").val(),
                "smsCaptcha": $("#verification").val(),
                "newLoginPwd": $("#password").val(),
                "companyCode": COMPANYCODE
            })
            .then(function(response) {
                if (response.success) {
                    doSuccess();
                } else {
                    $("#sbtn").removeAttr("disabled").text("设置");
                    base.showMsg(response.msg);
                }
            }, function() {
                $("#sbtn").removeAttr("disabled").text("设置");
                base.showMsg("密码设置失败，请稍后重试！");
            });
    }

    function doSuccess() {
        $("#sbtn").text("设置");
        base.showMsg("恭喜您，密码设置成功！");
        setTimeout(function() {
            base.goBackUrl("./login.html");
        }, 1000);
    }

    function validate_verification() {
        var value = $("#verification").val();
        if (!value || value.trim() === "") {
            base.showMsg("验证码不能为空");
            return false;
        } else if (!/^[\d]{4}$/.test(value)) {
            base.showMsg("验证码错误");
            return false;
        }
        return true;
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

    function validate_password() {
        var value = $("#password").val(),
            myreg = /^[^\s]{6,16}$/;
        if (value == "") {
            base.showMsg("新密码不能为空");
            return false;
        } else if (!myreg.test(value)) {
            base.showMsg("新密码格式错误");
            return false;
        }
        return true;
    }

    function validate_repassword() {
        var value1 = $("#password").val(),
            value2 = $("#repassword").val();
        if (!value2 || value2.trim() === "") {
            base.showMsg("确认密码不能为空");
            return false;
        } else if (value2 !== value1) {
            base.showMsg("两次密码输入不一致");
            return false;
        }
        return true;
    }
});