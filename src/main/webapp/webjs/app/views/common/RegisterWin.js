define("app/views/common/RegisterWin", [
    'dojo/_base/declare',
    'dijit/_WidgetBase', 
    'dijit/_TemplatedMixin',
    'dojo/dom-style',
    'dojo/on',
    'dojo/mouse',
    'dijit/DialogUnderlay',
    'app/common/Global',
    'dojo/query',
    'dijit/focus',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/string',
    "dojo/dom-class",
    'app/common/Position',
    'dojo/dnd/Moveable',
    'app/ux/GenericTextBox',
    'app/ux/GenericButton',
    'app/views/ViewMixin',
    'app/common/Ajax',
    'app/common/RSA',
    'app/ux/GenericTooltip',
    'dojo/_base/lang',
    'dojo/cookie',
    'app/ux/GenericMiniMsgBox',
    'app/views/common/LoginTopbar',
    'dojo/when',
    'app/common/Data',
    'dojo/text!./templates/RegisterWin.html',
    'app/jquery/$'
], function(declare, _WidgetBase, _TemplatedMixin, domStyle, on, mouse, 
		DialogUnderlay, Global, query, focusUtil, dom, domConstruct, string,
        domClass, Position, Moveable, TextBox, Button, ViewMixin, Ajax, RSA,
        Tooltip, lang, cookie, MiniMsgBox, LoginTopbar, when, Data, template, J){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {
    	
    	templateString: template,
        closeAction: 'hide',
        loginWin: "",
        registerHandler: "",
    	contentClass: '',

        _setLoginWinAttr: function(value){
            this._set('loginWin', value);
        },

    	show: function() {
    		var me = this;
    		me.enterBtns = query('.dijitButton.enterbutton').filter(function(i) {
    			return i != me.loginBtn.domNode;
    		});
    		me.enterBtns.removeClass('enterbutton');
            $(me.captchaImg).attr('src', Global.baseUrl+'/captcha?' + new Date().getTime());
    		domStyle.set(me.domNode, {
    			display: 'block'
    		});
            $(".register_dialog").length > 0 ? domStyle.set(me.domNode, {
                "display": "block"
            }) : query("body")[0].appendChild(me.domNode);
    		DialogUnderlay.show({}, 9999);
    		if (document.activeElement) {
    			document.activeElement.blur();
    		}
    		me.domNode.focus();
    	},
    	
    	close: function() {
    		var me = this;
    		if (me.enterBtns) {
    			me.enterBtns.addClass('enterbutton');
    		}
    		domConstruct.destroy(me.domNode);
    		DialogUnderlay.hide();
    	},
    	
    	hide: function() {
    		var me = this;
    		if (me.enterBtns) {
    			me.enterBtns.addClass('enterbutton');
    		}
    		domStyle.set(me.domNode, {
    			display: 'none'
    		});
    		//DialogUnderlay.hide();
    	},
    	
    	addListeners: function() {
    		var me = this;
            on(me.loginClose, 'click', function() {
                me[me.get('closeAction')]();
            });
    	},

        render: function() {
            var me = this,
                count = 2,
                handleSend = {};

            on(me.mobile,"keyup", getLisFunc("mobile", 2));
            on(me.mobile, "change", validate_mobile);
            on(me.captcha, "keyup", getLisFunc("captcha", 1));
            on(me.captcha, "change", validate_captcha);
            on(me.verification, "keyup", getLisFunc("verification", 1));
            on(me.verification, "change",validate_verification);
            /*on(me.mail, "keyup", getLisFunc("mail", 1));
            on(me.mail, "change", validate_mail);*/
            on(me.password, "keyup", getLisFunc("password", 1));
            on(me.password, "change", validate_password);
            on(me.password, "focus", function(){
                var parent = this.parentNode;
                $(parent).next().css({
                    "display": "block"
                });
            });
            on(me.password, "blur", function(){
                var parent = this.parentNode;
                $(parent).next().css({
                    "display": "none"
                });
            });
            on(me.repassword, "keyup", getLisFunc("repassword", 1));
            on(me.repassword, "change", validate_repassword);
            on(me.repassword, "focus", function(){
                var parent = this.parentNode;
                $(parent).next().css({
                    "display": "block"
                });
            });
            on(me.repassword, "blur", function(){
                var parent = this.parentNode;
                $(parent).next().css({
                    "display": "none"
                });
            });
            on(me.regClose, "click", function(e){
                me.hide();
            });
            on(me.regLogin, "click", function(e){
                me.loginWin.show();
                me.hide();
            });
            me.registerHandler = on(me.registerAction, "click", function (e) {
                register();
            });
            on(me.captchaImg, "click", function () {
                $(me.captchaImg).attr('src', Global.baseUrl+'/captcha?' + new Date().getTime());
            });
            function checkMobile (){
                Ajax.post(Global.baseUrl + '/user/mobile/check',
                    {"loginName": me.mobile.value})
                    .then(function (response) {
                        var parent = me.mobile.parentNode;
                        if (response.success) {
                            $(parent).find("span.success")[0].style.display = "block";
                            isReady(finalRegister);
                        } else {
                            var span = $(parent).find("span.warning")[2];
                            span.style.display = "block";
                            fadeOut(span);
                            notOk();
                            me.registerAction.innerHTML = "注册";
                            $(me.registerAction).css("cursor", "pointer");
                            me.registerHandler = on(me.registerAction, "click", function (e) {
                                register();
                            });
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
                Ajax.post(Global.baseUrl + '/gene/register/send',
                    {
                        "mobile": me.mobile.value
                    }).then(function (response) {

                    var parent = me.verification.parentNode;
                    if (response.success) {
                        domStyle.set(me.getVerification, {
                            cursor: "no-drop"
                        });
                        $(me.getVerification).addClass("cancel-send");
                        for (var i = 0; i <= 60; i++) {
                            (function (i) {
                                setTimeout(function () {
                                    if (i < 60) {
                                        me.getVerification.innerHTML = (60 - i) + "s";
                                    } else {
                                        me.getVerification.innerHTML = "获取验证码";
                                        domStyle.set(me.getVerification, {
                                            cursor: "pointer"
                                        });
                                        $(me.getVerification).removeClass("cancel-send");
                                        handleSend = on.once(me.getVerification, "click", handleSendVerifiy);
                                    }
                                }, 1000 * i);
                            })(i);
                        }
                    } else {
                        handleSend = on.once(me.getVerification, "click", handleSendVerifiy);
                        var span = $(parent).find("span.warning")[2];
                        span.style.display = "block";
                        fadeOut(span);
                    }
                });
            }
            function validate_mobile(){
                var elem = me.mobile,
                    parent = elem.parentNode,
                    span;
                handleSend.remove && handleSend.remove();
                if(elem.value == ""){
                    span = $(parent).find("span.warning")[0];
                    span.style.display = "block";
                    fadeOut(span);
                    return false;
                }else if(!/^1[3,4,5,7,8]\d{9}$/.test(elem.value)){
                    span = $(parent).find("span.warning")[1];
                    span.style.display = "block";
                    fadeOut(span);
                    return false;
                }
                if(!$(me.getVerification).hasClass("cancel-send")){
                    handleSend = on.once(me.getVerification, "click", handleSendVerifiy);
                }
                return true;
            }
            function validate_captcha(){
                var elem = me.captcha,
                    parent = elem.parentNode,
                    span;
                if(elem.value == ""){
                    span = $(parent).find("span.warning")[0];
                    span.style.display = "block";
                    fadeOut(span);
                    return false;
                }else if(!/^[\d,a-z,A-Z]{4}$/.test(elem.value)){
                    span = $(parent).find("span.warning")[1];
                    span.style.display = "block";
                    fadeOut(span);
                    return false;
                }
                return true;
            }
            function validate_verification(){
                var elem = me.verification,
                    parent = elem.parentNode,
                    span;
                if(elem.value == ""){
                    span = $(parent).find("span.warning")[0];
                    span.style.display = "block";
                    fadeOut(span);
                    return false;
                }else if(!/^[\d]{4}$/.test(elem.value)){
                    span = $(parent).find("span.warning")[1];
                    span.style.display = "block";
                    fadeOut(span);
                    return false;
                }
                return true;
            }
            function validate_password(){
                var elem = me.password,
                    parent = elem.parentNode,
                    myreg = /^[^\s]{6,16}$/,
                    span;
                if(elem.value == ""){
                    span = $(parent).find("span.warning")[0];
                    span.style.display = "block";
                    fadeOut(span);
                    return false;
                }else if(!myreg.test(elem.value)){
                    span = $(parent).find("span.warning")[1];
                    span.style.display = "block";
                    fadeOut(span);
                    return false;
                }
                return true;
            }
            function validate_repassword(){
                var elem1 = me.password,
                    elem2 = me.repassword,
                    parent = elem2.parentNode,
                    span;
                if(elem2.value == ""){
                    span = $(parent).find("span.warning")[0];
                    span.style.display = "block";
                    fadeOut(span);
                    return false;
                }else if(elem2.value !== elem1.value){
                    span = $(parent).find("span.warning")[1];
                    span.style.display = "block";
                    fadeOut(span);
                    return false;
                }
                return true;
            }
            function validate(){
                if(validate_mobile() && validate_captcha() && validate_verification()
                    && validate_password() && validate_repassword()){
                    if(me.registCheck.checked){
                        return true;
                    }
                    Tooltip.show("请勾选协议！", me.registerAction, 'warning');
                    return false;
                }
                return false;
            }
            function setOpacity(elem, level) {
                if (elem.filters) {
                    elem.style.filters = 'alpha(opacity=' + level + ')';
                } else {
                    elem.style.opacity = level / 100;
                }
            }
            function fadeOut(elem) {
                var me = this;
                setOpacity(elem, 1);
                for (var i = 0; i <= 100; i += 5) {
                    (function (i) {
                        var pos = i;
                        setTimeout(function () {
                            setOpacity(elem, 100 - pos);
                        }, (pos + 1) * 30)
                    })(i);
                }
            }
            function getLisFunc(id, i){
                return function (e){
                    var elem = me[id],
                        keyCode = e.charCode || e.keyCode,
                        placeholder = elem.parentNode.getElementsByTagName("span")[i];
                    elem.value != "" ? ( placeholder.style.display = "none" )
                        : placeholder.style.display = "block";
                    if(keyCode == 13){
                        register();
                    }
                }
            }
            function finalRegister() {
                var param = {
                    "loginName": me.mobile.value,
                    "loginPwd": me.password.value,
                    "smsCaptcha": me.verification.value,
                    "captcha": me.captcha.value
                };
                Ajax.post(Global.baseUrl + '/user/regist', param)
                    .then(function (response) {
                        if (response.success) {
                            loginUser({
                                "loginName": param.loginName,
                                "loginPwd": param.loginPwd,
                                "terminalType": "1"
                            }, me);
                        } else {
                            $(me.captchaImg).attr('src', Global.baseUrl+'/captcha?' + new Date().getTime());
                            Tooltip.show(response.msg, me.registerAction, 'warning');
                        }
                        me.registerAction.innerHTML = "注册";
                        $(me.registerAction).css("cursor", "pointer");
                        me.registerHandler = on(me.registerAction, "click", function (e) {
                            register();
                        });
                    });
            }

            function loginUser(param, me) {
                var url = Global.baseUrl + "/user/login";

                Ajax.post(url, param)
                    .then(function (response) {
                        if (response.success) {
                            var returnUrl = Global.getUrlParam("return");
                            if(returnUrl){
                                location.href = decodeURIComponent(returnUrl);
                            }else{
                                location.reload(true);
                            }
                        } else {
                            me.loginWin.show();
                        }
                        me.hide();
                    });
            }

            function register(){
                if(validate()){
                    count = 1;
                    me.registerHandler && me.registerHandler.remove && me.registerHandler.remove();
                    me.registerAction.innerHTML = "注册中...";
                    $(me.registerAction).css("cursor", "default");
                    checkMobile();
                }
            }
        },
    	postCreate: function(){
    		var me = this;
    		
    		domStyle.set(me.domNode, {
    			position: 'absolute',
    			'zIndex': '10000'
    		});

            me.render();
    		
    		me.inherited(arguments);
    	}
    });
});