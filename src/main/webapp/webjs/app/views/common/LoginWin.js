define("app/views/common/LoginWin", [
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
    'app/views/common/RegisterWin',
    'dojo/text!./templates/LoginWin.html',
    'app/jquery/$'
], function(declare, _WidgetBase, _TemplatedMixin, domStyle, on, mouse, 
		DialogUnderlay, Global, query, focusUtil, dom, domConstruct, string,
        domClass, Position, Moveable, TextBox, Button, ViewMixin, Ajax, RSA,
        Tooltip, lang, cookie, MiniMsgBox, LoginTopbar, when, Data, RegisterWin, template, J){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {
    	
    	templateString: template,
        closeAction: 'hide',
        hideClose: "",
        registerWin: new RegisterWin(),

    	contentClass: '',
        loginHandler: "",

        _setHideCloseAttr: function (value) {
            this._set('hideClose', value);
            this.loginClose.style.display = "none";
        },

    	show: function() {
    		var me = this;
    		me.enterBtns = query('.dijitButton.enterbutton').filter(function(i) {
    			return i != me.loginBtn.domNode;
    		});
    		me.enterBtns.removeClass('enterbutton');
    		domStyle.set(me.domNode, {
    			display: 'block'
    		});
            $(".login_dialog").length > 0 ? domStyle.set(me.domNode, {
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
            on(me.loginClose, 'click', function() {
                me[me.get('closeAction')]();
            });
    	},

        render: function() {
            var me = this;
            me.loginHandler = on(me.login, 'click', function () {
                me.loginAction();
            });
            $(me.username).on("keyup", function (e) {
                var keyCode = e.charCode || e.keyCode,
                    placeholder = this.parentNode.getElementsByTagName("span")[1];
                this.value != "" ? ( placeholder.style.display = "none" )
                    : placeholder.style.display = "block";
                if(keyCode == 13){
                    me.loginAction();
                }
            });
            on(me.username, "change", function (e) {
                me.validate_username();
            });
            var username = cookie('loginName');
            if (username) {
                me.username.value = username;
                me.saveUsername.checked = true;
                $(me.username).keyup();
            }
            on(me.password, "keyup", function (e) {
                var keyCode = e.charCode || e.keyCode,
                    placeholder = this.parentNode.getElementsByTagName("span")[1];
                this.value != "" ? ( placeholder.style.display = "none" )
                    : placeholder.style.display = "block";
                if(keyCode == 13){
                    me.loginAction();
                }
            });
            on(me.password, "change", function () {
                me.validate_password();
            });
            on(me.registerUser, "click", function (e) {
                me.registerWin.show();
                me.hide();
            });
            me.registerWin.set("loginWin", me);
        },
        validate_username: function () {
            var me = this;
            var username = me.username,
                parent = username.parentNode,
                span;
            if (username.value == "") {
                span = $(parent).find("span.warning")[0];
                span.style.display = "block";
                me.fadeOut(span);
                return false;
            } else if (!/^1[3,4,5,7,8]\d{9}$/.test(username.value)) {
                span =  $(parent).find("span.warning")[1];
                span.style.display = "block";
                me.fadeOut(span);
                return false;
            }
            return true;
        },
        validate_password: function () {
            var me = this;
            var password = me.password,
                parent = password.parentNode,
                span;
            if (password.value == "") {
                span =  $(parent).find("span.warning")[0];
                span.style.display = "block";
                me.fadeOut(span);
                return false;
            }
            return true;
        },
        validate: function () {
            var me = this;
            if (me.validate_username() && me.validate_password()) {
                return true;
            }
            return false;
        },
        loginAction: function () {
            var me = this;
            if (me.validate()) {
                me.loginHandler && me.loginHandler.remove && me.loginHandler.remove();
                me.login.innerHTML = "登录中...";
                $(me.login).css("cursor", "default");
                var param = {
                    "loginName": me.username.value,
                    "loginPwd": me.password.value,
                    "terminalType": "1"
                }, url = Global.baseUrl + "/user/login";

                Ajax.post(url, param)
                    .then(function (response) {
                        if (response.success) {
                            if(me.saveUsername.checked){
                                cookie('loginName', me.username.value, {path: '/'});
                            }
                            var returnUrl = Global.getUrlParam("return");
                            if(returnUrl){
                                location.href = decodeURIComponent(returnUrl);
                            }else{
                                location.reload(true);
                            }
                        } else {
                            me.loginHandler = on(me.login, 'click', function () {
                                me.loginAction();
                            });
                            me.login.innerHTML = "登录";
                            $(me.login).css("cursor", "pointer");
                            Tooltip.show(response.msg, me.login, "warning");
                            var password = me.password,
                                parent = password.parentNode,
                                span =  $(parent).find("span.warning")[1];
                                span.style.display = "block";
                                me.fadeOut(span);
                            focusUtil.focus(password);
                        }
                    });
            }
        },
        setOpacity: function (elem, level) {
            if (elem.filters) {
                elem.style.filters = 'alpha(opacity=' + level + ')';
            } else {
                elem.style.opacity = level / 100;
            }
        },
        fadeOut: function (elem) {
            var me = this;
            me.setOpacity(elem, 1);
            for (var i = 0; i <= 100; i += 5) {
                (function (i) {
                    var pos = i;
                    setTimeout(function () {
                        me.setOpacity(elem, 100 - pos);
                    }, (pos + 1) * 30)
                })(i);
            }
        },
        isValid: function() {
            return this.usernameFld.checkValidity() &&
                this.pwdFld.checkValidity();
        },
    	
    	postCreate: function(){
    		var me = this;
    		
    		domStyle.set(me.domNode, {
    			position: 'absolute',
    			'zIndex': '10000'
    		});

            me.render();
            me.addListeners();
    		
    		me.inherited(arguments);
    	}
    });
});