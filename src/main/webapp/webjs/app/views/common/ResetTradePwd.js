define("app/views/common/ResetTradePwd", [
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
    'dojo/text!./templates/ResetTradePwd.html',
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
            var me = this;
            on(me.origPassword, "keyup", getLisFunc("origPassword", 1));
            on(me.origPassword, "change", validate_origPassword);
            on(me.origPassword, "focus", function(){
                var parent = this.parentNode;
                $(parent).next().css({
                    "display": "block"
                });
            });
            on(me.origPassword, "blur", function(){
                var parent = this.parentNode;
                $(parent).next().css({
                    "display": "none"
                });
            });
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
            me.nextHandler = on(me.nextAction, "click", function (e) {
                resetTradePwd();
            });

            function validate_origPassword(){
                var elem = me.origPassword,
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
                if(validate_origPassword() && validate_password() && validate_repassword()){
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
                        resetTradePwd();
                    }
                }
            }
            function doSuccess(){
                $(".register_title h4").text("交易密码重置成功");
                var userCont = $(".register_dialog");
                userCont.css({
                    "height": "auto",
                    "margin-top": "-211.5px"
                });
                $(".register_content form").html('<div class="tupian"></div>' +
                    '<div class="wenzi">恭喜您，交易密码重置成功！</div>' +
                    '<div class="register_btn-wrapper">' +
                    '<div class="register_btn register_btn-primary btnshezhi">' +
                    '<a href="'+Global.baseUrl+'/user/user_info.htm">返回个人中心</a></div></div>');
            }
            function resetTradePwd(){
                if(validate()){
                    me.nextHandler.remove();
                    $(me.nextAction).css("cursor", "default").text("重置中...");
                    var param = {
                        "newTradePwd": me.password.value,
                        "oldTradePwd": me.origPassword.value
                    };
                    Ajax.post(Global.baseUrl + '/user/tradepwd/reset', param)
                        .then(function (response) {
                            if (response.success) {
                                doSuccess();
                            } else {
                                me.nextHandler = on(me.nextAction, "click", function (e) {
                                    resetTradePwd();
                                });
                                $(me.nextAction).css("cursor", "pointer").text("下一步");
                                Tooltip.show(response.msg, me.nextAction, 'warning');
                            }
                        });
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