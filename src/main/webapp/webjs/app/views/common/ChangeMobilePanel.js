define("app/views/common/ChangeMobilePanel", [
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
    'dojo/text!./templates/ChangeMobilePanel.html',
    'app/jquery/$'
], function(declare, _WidgetBase, _TemplatedMixin, domStyle, on, mouse, 
		DialogUnderlay, Global, query, focusUtil, dom, domConstruct, string,
        domClass, Position, Moveable, TextBox, Button, ViewMixin, Ajax, RSA,
        Tooltip, lang, cookie, MiniMsgBox, LoginTopbar, when, Data, template, J){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {
    	
    	templateString: template,
        closeAction: 'hide',
        loginWin: "",
        nextHandler: "",
    	contentClass: '',

    	show: function() {
    		var me = this;
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
    		DialogUnderlay.hide();
    	},
    	
    	addListeners: function() {
    		var me = this;
    	},

        render: function() {
            var me = this,
                handleSend = {};
            on(me.mobile,"keyup", getLisFunc("mobile", 2));
            on(me.mobile, "change", validate_mobile);
            on(me.verification, "keyup", getLisFunc("verification", 1));
            on(me.verification, "change",validate_verification);
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
            me.nextHandler = on(me.nextAction, "click", function (e) {
                changeMobile();
            });
            function handleSendVerifiy() {
                handleSend.remove && handleSend.remove();
                Ajax.post(Global.baseUrl + '/gene/changemobile/send',
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
                    handleSend.remove && handleSend.remove();
                    handleSend = on.once(me.getVerification, "click", handleSendVerifiy);
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
            function validate(){
                if(validate_mobile() && validate_verification() && validate_password()){
                    return true;
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
                        changeMobile();
                    }
                }
            }
            function checkMobile (){
                Ajax.post(Global.baseUrl + '/user/mobile/check',
                    {"loginName": me.mobile.value})
                    .then(function (response) {
                        var parent = me.mobile.parentNode;
                        if (response.success) {
                            $(parent).find("span.success")[0].style.display = "block";
                            finalChangeMobile();
                        } else {
                            var span = $(parent).find("span.warning")[2];
                            span.style.display = "block";
                            fadeOut(span);
                            me.nextHandler = on(me.nextAction, "click", function (e) {
                                changeMobile();
                            });
                            $(me.nextAction).css("cursor", "pointer").text("下一步");
                        }
                    });
            }
            function doSuccess(){
                $(".register_title h4").text("手机号修改成功");
                var userCont = $(".register_dialog");
                userCont.css({
                    "height": "auto",
                    "margin-top": "-211.5px"
                });
                $(".register_content form").html('<div class="tupian"></div>' +
                    '<div class="wenzi">恭喜您，手机号修改成功！</div>' +
                    '<div class="register_btn-wrapper">' +
                    '<div class="register_btn register_btn-primary btnshezhi">' +
                    '<a href="'+Global.baseUrl+'/home/index.htm">重回首页</a></div></div>');
            }
            function finalChangeMobile() {
                var param = {
                    "newMobile": me.mobile.value,
                    "tradePwd": me.password.value,
                    "smsCaptcha": me.verification.value
                };
                Ajax.post(Global.baseUrl + '/user/mobile/change', param)
                    .then(function (response) {
                        if (response.success) {
                            doSuccess();
                        } else {
                            Tooltip.show(response.msg, me.nextAction, 'warning');
                            me.nextHandler = on(me.nextAction, "click", function (e) {
                                changeMobile();
                            });
                            $(me.nextAction).css("cursor", "pointer").text("下一步");
                        }
                    });
            }
            function changeMobile(){
                if(validate()){
                    me.nextHandler.remove();
                    $(me.nextAction).css("cursor", "defult").text("修改中...");
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