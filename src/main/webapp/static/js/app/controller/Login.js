define([
	'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'Handlebars'
], function (base, Ajax, dialog, Handlebars) {
	$(function(){
        var returnUrl;
		addListeners();
        init();
        function init(){
            returnUrl = base.getUrlParam("return");
            if(returnUrl){
                $("#toRegister").attr("href", './register.html?return='+ encodeURIComponent(returnUrl));
                $("#fdPwd").attr("href", './findPwd.html?return='+ encodeURIComponent(returnUrl));
            }else{
                $("#toRegister").attr("href", './register.html');
                $("#fdPwd").attr("href", './findPwd.html');
            }
        }
		function addListeners() {
            $("#loginBtn").on('click', loginAction);
            $("#mobile").on("change", function (e) {
                validate_username();
            });
            $("#password").on("change", function () {
                validate_password();
            });
            fdPwd
        }

		function validate_username(){
            var username = $("#mobile")[0],
                parent = username.parentNode,
                span;
            if (username.value == "") {
                span = $(parent).find("span.warning")[0];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            } else if (!/^1[3,4,5,7,8]\d{9}$/.test(username.value)) {
                span =  $(parent).find("span.warning")[1];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }
            return true;
		}
		function validate_password() {
            var password = $("#password")[0],
                parent = password.parentNode,
                span;
            if (password.value == "") {
                span =  $(parent).find("span.warning")[0];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }
            return true;
		}
		function validate(){
            if (validate_username() && validate_password()) {
                return true;
            }
            return false;
		}
		function loginAction () {
            if (validate()) {
                $("#loginBtn").attr("disabled", "disabled").val("登录中...");
                var param = {
                    "loginName": $("#mobile").val(),
                    "loginPwd": $("#password").val(),
                    "terminalType": "1"
                }, url = APIURL + "/user/login";

                Ajax.post(url, param)
                    .then(function (response) {
                        if (response.success) {
                            if(returnUrl){
                                location.href = returnUrl;
                            }else{
                                location.href = "./user_info.html";
                            }
                        } else {
                			$("#loginBtn").removeAttr("disabled").val("登录");
                            var d = dialog({
								content: response.msg,
								quickClose: true
							});
							d.show();
							setTimeout(function () {
								d.close().remove();
							}, 2000);
                        }
                    });
            }
        }
	});      
});