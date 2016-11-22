define([
    'app/controller/base',
    'app/util/ajax',
    'lib/swiper-3.3.1.jquery.min'
], function(base, Ajax, Swiper) {
    var count = 1,
        COMPANYCODE = "";
    init();

    function init() {
        if (COMPANYCODE = sessionStorage.getItem("compCode")) {
            getBanner();
            addListeners();
            $("#captchaImg").click();
        } else {
            base.getCompanyByUrl()
                .then(function() {
                    if (COMPANYCODE = sessionStorage.getItem("compCode")) {
                        getBanner();
                        addListeners();
                        $("#captchaImg").click();
                    } else {
                        base.showMsg("非常抱歉，暂时无法获取公司信息!");
                    }
                });
        }
        var url = "./login.html?return=" + base.getReturnParam();
        $("#toLogin").attr("href", url);
    }

    function getBanner() {
        base.getBanner(COMPANYCODE, "B_Mobile_ZC_CSH")
            .then(function(res) {
                if (res.success) {
                    var data = res.data,
                        html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += '<div class="swiper-slide"><img class="wp100" src="' + data[i].pic + '"></div>';
                    }
                    if (data.length == 1) {
                        $("#swiper-pagination").remove();
                    }
                    $("#swr").html(html);
                    swiperImg();
                }
            });
    }

    function addListeners() {
        $("#password")
            .on("focus", function() {
                $(this).parent().find(".register_verifycon")
                    .css({
                        "display": "block"
                    });
            })
            .on("blur", function() {
                $(this).parent().find(".register_verifycon")
                    .css({
                        "display": "none"
                    });
            });
        $("#getVerification").on("click", function() {
            if (validate_mobile() && validate_captcha()) {
                $(this).attr("disabled", "disabled");
                handleSendVerifiy();
            }
        })
        $("#registerBtn").on("click", function(e) {
            register();
        });
        $("#captchaImg").on("click", function() {
            $(this).attr('src', APIURL + '/captcha?_=' + new Date().getTime());
        });
    }

    function handleSendVerifiy() {
        Ajax.post(APIURL + '/gene/register/send', {
            "mobile": $("#mobile").val(),
            "captcha": $("#captcha").val()
        }).then(function(response) {
            if (response.success) {
                for (var i = 0; i <= 60; i++) {
                    (function(i) {
                        setTimeout(function() {
                            if (i < 60) {
                                $("#getVerification").val((60 - i) + "s");
                            } else {
                                $("#getVerification").val("获取验证码").removeAttr("disabled");
                            }
                        }, 1000 * i);
                    })(i);
                }
            } else {
                base.showMsg(response.msg);
                $("#getVerification").val("获取验证码").removeAttr("disabled");
            }
        });
    }

    function validate_mobile() {
        var value = $("#mobile").val();
        $("#getVerification").off("click");
        if (value == "") {
            base.showMsg('手机号不能为空');
            return false;
        } else if (!/^1[3,4,5,7,8]\d{9}$/.test(value)) {
            base.showMsg("手机号格式错误");
            return false;
        }
        return true;
    }

    function validate_captcha() {
        var value = $("#captcha").val();
        if (value == "") {
            base.showMsg("图片验证码不能为空");
            return false;
        } else if (!/^[\d,a-z,A-Z]{4}$/.test(value)) {
            base.showMsg("图片验证码格式错误");
            return false;
        }
        return true;
    }

    function validate_verification() {
        var value = $("#verification").val();
        if (value == "") {
            base.showMsg("短信验证码不能为空");
            return false;
        } else if (!/^[\d]{4}$/.test(value)) {
            base.showMsg("短信验证码格式错误");
            return false;
        }
        return true;
    }

    function validate_password() {
        var value = $("#password").val(),
            myreg = /^[^\s]{6,16}$/;
        if (value == "") {
            base.showMsg("密码不能为空");
            return false;
        } else if (!myreg.test(value)) {
            base.showMsg("密码格式错误");
            return false;
        }
        return true;
    }

    function validate() {
        if (validate_mobile() && validate_captcha() && validate_verification() &&
            validate_password()) {
            return true;
        }
        return false;
    }

    function finalRegister() {
        var param = {
            "mobile": $("#mobile").val(),
            "loginPwd": $("#password").val(),
            "smsCaptcha": $("#verification").val(),
            "companyCode": COMPANYCODE
        };
        Ajax.post(APIURL + '/user/regist', param)
            .then(function(response) {
                if (response.success) {
                    loginUser({
                        "loginName": param.mobile,
                        "loginPwd": param.loginPwd
                    });
                } else {
                    $("#captchaImg").attr('src', APIURL + '/captcha?_=' + new Date().getTime());
                    base.showMsg(response.msg);
                    $("#registerBtn").removeAttr("disabled").val("注册");
                }
            });
    }

    function loginUser(param) {
        var url = APIURL + "/user/login";
        Ajax.post(url, param)
            .then(function(response) {
                if (response.success) {
                    sessionStorage.setItem("user", true);
                    base.goBackUrl("./user_info.html");
                } else {
                    base.showMsg("注册成功！");
                    sessionStorage.setItem("user", false);
                    setTimeout(function() {
                        location.href = "./login.html?return=" + base.getReturnParam();
                    }, 1000);
                }
            });
    }

    function register() {
        if (validate()) {
            $("#registerBtn").attr("disabled", "disabled").val("注册中...");
            finalRegister();
        }
    }

    function swiperImg() {
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            autoplay: 2000,
            autoplayDisableOnInteraction: false,
            // 如果需要分页器
            pagination: '.swiper-pagination'
        });
    }
});