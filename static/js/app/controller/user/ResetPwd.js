define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/validate/validate',
    'app/module/loading/loading'
], function(base, Ajax, Validate, loading) {
    init();

    function init() {
        if (!base.isLogin()) {
            base.goLogin();
            return;
        }
        $("#userId").val(base.getUserId());
        addListeners();
    }

    function addListeners() {
        $("#resetForm").validate({
            'rules': {
                oldLoginPwd: {
                    required: true,
                    maxlength: 16,
                    minlength: 6,
                    isNotFace: true
                },
                newLoginPwd: {
                    required: true,
                    maxlength: 16,
                    minlength: 6,
                    isNotFace: true
                },
                repassword: {
                    required: true,
                    equalTo: "#newLoginPwd"
                }
            },
            onkeyup: false
        });
        $("#sbtn").on("click", function() {
            valide();
        });
    }

    function valide() {
        $("#resetForm").valid() && resetPassword();
    }

    function resetPassword() {
        loading.createLoading("设置中...");
        var data = $("#resetForm").serializeObject();
        data.loginPwdStrength = base.calculateSecurityLevel(data.newLoginPwd);
        Ajax.post('805049', {
                json: data
            })
            .then(function(response) {
                if (response.success) {
                    doSuccess();
                } else {
                    base.showMsg(response.msg);
                }
                loading.hideLoading();
            }, function() {
                loading.hideLoading();
                base.showMsg("非常抱歉，登录密码修改失败");
            });
    }

    function doSuccess() {
        base.showMsg("登录密码修改成功!");
        setTimeout(function() {
            base.logout();
            location.href = './login.html';
        }, 1000);
    }
});