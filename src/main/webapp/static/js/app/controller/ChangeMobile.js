define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    init();

    function init() {
        if (!base.isLogin()) {
            location.href = "./login.html?return=" + base.makeReturnUrl();
        } else {
            addListeners();
        }
    }

    function addListeners() {
        $("#sbtn").on("click", function(e) {
            changeMobile();
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
        Ajax.post(APIURL + '/gene/changemobile/send', {
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
        base.showMsg("手机号修改成功！");
        setTimeout(function() {
            location.href = './user_info.html';
        }, 1000);
    }

    function finalChangeMobile() {
        $("#sbtn").attr("disabled", "disabled").text("设置中...");
        var param = {
            "newMobile": $("#mobile").val(),
            "smsCaptcha": $("#verification").val()
        };
        Ajax.post(APIURL + '/user/mobile/change', param)
            .then(function(response) {
                if (response.success) {
                    doSuccess();
                } else {
                    $("#sbtn").removeAttr("disabled").text("设置");
                    base.showMsg(response.msg);
                }
            });
    }

    function changeMobile() {
        if (validate()) {
            finalChangeMobile();
        }
    }
});