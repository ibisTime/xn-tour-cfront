define([
	'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'Handlebars'
], function (base, Ajax, dialog, Handlebars) {
	$(function(){
		var count = 1, returnUrl = base.getUrlParam("return");
		addListeners();
		init();
        function init(){
        	$("#captchaImg").click();
            var url = "./login.html";
            if(returnUrl){
                url = url + "?return=" + encodeURIComponent(returnUrl);
            }
            $("#toLogin").attr("href", url);
        }
		function addListeners() {
            $("#mobile").on("change", validate_mobile);
            $("#captcha").on("change", validate_captcha);
            $("#verification").on("change",validate_verification);
            $("#password").on("change", validate_password)
	            .on("focus", function(){
	                $(this).parent().find(".register_verifycon")
		                .css({
		                    "display": "block"
		                });
	            })
	            .on("blur", function(){
	                $(this).parent().find(".register_verifycon")
		                .css({
		                    "display": "none"
		                });
	            });
            $("#repassword").on("change", validate_repassword)
	            .on("focus", function(){
	                $(this).parent().find(".register_verifycon")
		                .css({
		                    "display": "block"
		                });
	            })
	            .on("blur", function(){
	                $(this).parent().find(".register_verifycon")
		                .css({
		                    "display": "none"
		                });
	            });
            $("#registerBtn").on("click", function (e) {
                register();
            });
            $("#captchaImg").on("click", function () {
                $(this).attr( 'src', APIURL + '/captcha?_=' + new Date().getTime() );
            });
        }

        function checkMobile (){
            Ajax.post(APIURL + '/user/mobile/check',
                {"loginName": $("#mobile").val()})
                .then(function (response) {
                    var $parent = $("#mobile").parent();
                    if (response.success) {
                        isReady(finalRegister);
                    } else {
                    	if(response.msg.indexOf("服务器") == -1){
	                        var span = $parent.find("span.warning")[2];
	                        $(span).fadeIn(150).fadeOut(3000);
	                        notOk();
	                        $("#registerBtn").removeAttr("disabled").val("注册");
	                    }
                    }
                });
        }
        function isReady(func) {
            if(!--count){
                func();
            }
        }
        function notOk() {
            count = -1;
        }
        function handleSendVerifiy() {
            $("#getVerification").addClass("cancel-send");
            Ajax.post(APIURL + '/gene/register/send',
                {
                    "mobile": $("#mobile").val()
                }).then(function (response) {
	                if (response.success) {
	                    for (var i = 0; i <= 60; i++) {
	                        (function (i) {
	                            setTimeout(function () {
	                                if (i < 60) {
	                                    $("#getVerification").text((60 - i) + "s");
	                                } else {
	                                    $("#getVerification").text("获取验证码").removeClass("cancel-send")
	                                    	.one("click", handleSendVerifiy);
	                                }
	                            }, 1000 * i);
	                        })(i);
	                    }
	                } else {
	                    $("#getVerification").one("click", handleSendVerifiy);
                        var parent = $("#verification").parent();
	                    var span = parent.find("span.warning")[2];
	                    $(span).fadeIn(150).fadeOut(3000);
	                }
	            });
        }
        function validate_mobile(){
            var $elem = $("#mobile"),
                $parent = $elem.parent(),
                span;
            $("#getVerification").off("click");
            if($elem.val() == ""){
                span = $parent.find("span.warning")[0];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }else if(!/^1[3,4,5,7,8]\d{9}$/.test($elem.val()) ){
                span = $parent.find("span.warning")[1];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }
            if(!$("#getVerification").hasClass("cancel-send")){
                $("#getVerification").one("click", handleSendVerifiy);
            }
            return true;
        }
        function validate_captcha(){
            var $elem = $("#captcha"),
                $parent = $elem.parent(),
                span;
            if($elem.val() == ""){
                span = $parent.find("span.warning")[0];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }else if(!/^[\d,a-z,A-Z]{4}$/.test($elem.val())){
                span = $parent.find("span.warning")[1];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }
            return true;
        }
        function validate_verification(){
            var $elem = $("#verification"),
                $parent = $elem.parent(),
                span;
            if($elem.val() == ""){
                span = $parent.find("span.warning")[0];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }else if(!/^[\d]{4}$/.test($elem.val())){
                span = $parent.find("span.warning")[1];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }
            return true;
        }
        function validate_password(){
            var $elem = $("#password"),
                $parent = $elem.parent(),
                myreg = /^[^\s]{6,16}$/,
                span;
            if($elem.val() == ""){
                span = $parent.find("span.warning")[0];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }else if(!myreg.test($elem.val())){
                span = $parent.find("span.warning")[1];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }
            return true;
        }
        function validate_repassword(){
            var $elem1 = $("#password"),
                $elem2 = $("#repassword"),
                $parent = $elem2.parent(),
                span;
            if($elem2.val() == ""){
                span = $parent.find("span.warning")[0];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }else if($elem2.val() !== $elem1.val()){
                span = $parent.find("span.warning")[1];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }
            return true;
        }
        function validate(){
            if(validate_mobile() && validate_captcha() && validate_verification()
                && validate_password() && validate_repassword()){
                if($("#registCheck")[0].checked){
                    return true;
                }
                var d = dialog({
						content: "请勾选协议！",
						quickClose: true
					});
				d.show();
				setTimeout(function () {
					d.close().remove();
				}, 2000);
                return false;
            }
            return false;
        }
        function finalRegister() {
            var param = {
                "loginName": $("#mobile").val(),
                "loginPwd": $("#password").val(),
                "smsCaptcha": $("#verification").val(),
                "captcha": $("#captcha").val()
            };
            Ajax.post(APIURL + '/user/regist', param)
                .then(function (response) {
                    if (response.success) {
                        loginUser({
                            "loginName": param.loginName,
                            "loginPwd": param.loginPwd,
                            "terminalType": "1"
                        });
                    } else {
                        $("#captchaImg").attr('src', APIURL+'/captcha?_=' + new Date().getTime());
                        var d = dialog({
								content: response.msg,
								quickClose: true
							});
						d.show();
						setTimeout(function () {
							d.close().remove();
						}, 2000);
						$("#registerBtn").removeAttr("disabled").val("注册");
                    }
                });
        }

        function loginUser(param) {
            var url = APIURL + "/user/login";
            Ajax.post(url, param)
                .then(function (response) {
                    if (response.success) {
                        if(returnUrl){
                            location.href = returnUrl;
                        }else{
                            location.href = "./user_info.html";
                        }
                    } else {
                        if(returnUrl){
                            location.href = "./login.html?return="+encodeURIComponent(returnUrl);
                        }else{
                            location.href = "./login.html";
                        }
                    }
                });
        }

        function register(){
            if(validate()){
                count = 1;
                $("#registerBtn").attr("disabled", "disabled").val("注册中...");
                checkMobile();
            }
        }
	});
});