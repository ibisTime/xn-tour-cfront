define([
    'app/controller/base',
    'app/util/ajax',
    'lib/swiper-3.3.1.jquery.min'
], function(base, Ajax, Swiper) {
    var returnUrl;

    init();

    function init() {
        if (COMPANYCODE = sessionStorage.getItem("compCode")) {
            addListeners();
        } else {
            base.getCompanyByUrl()
                .then(function() {
                    if (COMPANYCODE = sessionStorage.getItem("compCode")) {
                        addListeners();
                    } else {
                        base.showMsg("非常抱歉，暂时无法获取公司信息!");
                    }
                });
        }
        returnUrl = base.getReturnParam();
        if (returnUrl) {
            $("#toRegister").attr("href", './register.html?return=' + returnUrl);
            $("#fdPwd").attr("href", './findPwd.html?return=' + returnUrl);
        } else {
            $("#toRegister").attr("href", './register.html');
            $("#fdPwd").attr("href", './findPwd.html');
        }
    }

    function getBanner() {
        base.getBanner(COMPANYCODE, "B_Mobile_DL_CSH")
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
        $("#loginBtn").on('click', loginAction);
    }

    function validate_username() {
        var value = $("#mobile").val();
        if (value == "") {
            base.showMsg("手机号不能为空");
            return false;
        } else if (!/^1[3,4,5,7,8]\d{9}$/.test(value)) {
            base.showMsg("手机号格式错误");
            return false;
        }
        return true;
    }

    function validate_password() {
        var password = $("#password").val();
        if (password.value == "") {
            base.showMsg("密码不能为空");
            return false;
        }
        return true;
    }

    function validate() {
        if (validate_username() && validate_password()) {
            return true;
        }
        return false;
    }

    function loginAction() {
        if (validate()) {
            $("#loginBtn").attr("disabled", "disabled").val("登录中...");
            var param = {
                    "loginName": $("#mobile").val(),
                    "loginPwd": $("#password").val()
                },
                url = APIURL + "/user/login";

            Ajax.post(url, param)
                .then(function(response) {
                    if (response.success) {
                        sessionStorage.setItem("user", true);
                        base.goBackUrl("./user_info.html");
                    } else {
                        sessionStorage.setItem("user", false);
                        $("#loginBtn").removeAttr("disabled").val("登录");
                        base.showMsg(response.msg);
                    }
                });
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