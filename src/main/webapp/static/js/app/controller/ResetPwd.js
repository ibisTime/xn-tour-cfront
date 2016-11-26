define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    $(function() {
        init();

        function init() {
            if (!base.isLogin()) {
                location.href = "./login.html?return=" + base.makeReturnUrl();
            } else {
                addListeners();
            }
        }

        function addListeners() {
            $("#password")
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
            $("#repassword")
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
        }

        function valide() {
            if (validate_origPassword() && validate_password() && validate_repassword()) {
                resetPassword();
            }
        }

        function resetPassword() {
            $("#sbtn").attr("disabled", "disabled").text("设置中...");
            Ajax.post(APIURL + '/user/loginpwd/reset', {
                    "oldLoginPwd": $("#origPassword").val(),
                    "newLoginPwd": $("#password").val()
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
                    base.showMsg("非常抱歉，登录密码修改失败");
                });
        }

        function doSuccess() {
            $("#sbtn").text("设置");
            base.showMsg("登录密码修改成功!");
            setTimeout(function() {
                base.logout()
                    .then(function(res) {
                        location.href = './login.html';
                    }, function(res) {
                        location.href = './login.html';
                    });
            }, 1000);
        }

        function validate_origPassword() {
            var value = $("#origPassword").val(),
                myreg = /^[^\s]{6,16}$/;
            if (!value || value.trim() == "") {
                base.showMsg("原密码不能为空");
                return false;
            } else if (!myreg.test(value)) {
                base.showMsg("原密码格式错误");
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
            if (value2 == "") {
                base.showMsg("确认密码不能为空")
                return false;
            } else if (value2 !== value1) {
                base.showMsg("两次密码输入不一致");
                return false;
            }
            return true;
        }
    });
});