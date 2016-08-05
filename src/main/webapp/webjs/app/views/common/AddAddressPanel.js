define("app/views/common/AddAddressPanel", [
    '../../../dojo/_base/declare',
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
    'app/views/operator/ShowMsg',
    'dojo/text!./templates/AddAddressPanel.html',
    'app/jquery/$'
], function(declare, _WidgetBase, _TemplatedMixin, domStyle, on, mouse, 
		DialogUnderlay, Global, query, focusUtil, dom, domConstruct, string,
        domClass, Position, Moveable, TextBox, Button, ViewMixin, Ajax, RSA,
        Tooltip, lang, cookie, MiniMsgBox, LoginTopbar, when, Data, ShowMsg, template, J){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {
    	
    	templateString: template,
        closeAction: 'hide',

    	contentClass: '',

        saveHandler: '',

    	show: function() {
    		var me = this;
    		me.enterBtns = query('.dijitButton.enterbutton').filter(function(i) {
    			return i != me.loginBtn.domNode;
    		});
    		me.enterBtns.removeClass('enterbutton');
    		domStyle.set(me.domNode, {
    			display: 'block'
    		});
            $(".add_address_dialog").length > 0 ? domStyle.set(me.domNode, {
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
            on(me.closeBtn, "click", function () {
                me.hide();
            });
            on(me.defaultSpan, "click", function () {
                me.defaultAddress.checked = !me.defaultAddress.checked;
            });
            on(me.acceptName, "keyup", keyUpHandler);
            on(me.mobile, "keyup", keyUpHandler);
            on(me.provinceCode, "keyup", keyUpHandler);
            on(me.cityCode, "keyup", keyUpHandler);
            on(me.districtCode, "keyup", keyUpHandler);
            on(me.street, "keyup", keyUpHandler);
            on(me.acceptName, "change", changeHandler);
            on(me.mobile, "change", changeHandler);
            on(me.provinceCode, "change", changeHandler);
            on(me.cityCode, "change", changeHandler);
            on(me.districtCode, "change", changeHandler);
            on(me.street, "change", changeHandler);

            me.saveHandler = on(me.saveBtn, "click", function () {
                me.addAdd.call(me);
            });
            function keyUpHandler() {
                var $i = $(this).prev();
                this.value == "" ? $i.show() : $i.hide();
            }
            function changeHandler() {
                if(this.value != ""){
                    $(this).next().fadeOut(300);
                    var $next = $(this).next().next();
                    $next.length && $next.fadeOut(300);
                }else{
                    $(this).next().fadeIn(300);
                }
            }
    	},
        addAdd: function () {
            var me = this;
            if (me.valide()) {
                me.saveHandler.remove();
                me.saveBtn.innerHTML = "保存中...";
                $(me.saveBtn).css("cursor", "default");
                var config = {
                    "addressee": me.acceptName.value,
                    "mobile": me.mobile.value,
                    "province": me.provinceCode.value,
                    "city": me.cityCode.value,
                    "district": me.districtCode.value,
                    "detailAddress": me.street.value,
                    "isDefault": (me.defaultAddress.checked ? "1" : "0")
                };
                Ajax.post(Global.baseUrl + "/user/add/address", config)
                    .then(function (response) {
                        if (response.success) {
                            var html = '<li style="padding: 0;" code="'+response.data.code+'" class="pad24 so-address-li'+(config.isDefault == "1" ? " on" : "")+'">'+
                                '<i></i>' +
                                '<ul class="li-block">' +
                                '<li class="pd-btm10"><span class="so-name">'+config.addressee+'</span>'+(config.isDefault == "1" ? "<span class=\"pd-l5\">(默认地址)</span>" : "")+'</li>' +
                                '<li class="pd-btm10 so-mobile">'+config.mobile+'</li>' +
                                '<li class="so-address">'+config.province+'&nbsp;'+config.city+'&nbsp;'+config.district
                                +'<br>'+config.detailAddress+'</li>' +
                                '</ul>' +
                                '</li>';
                            if (config.isDefault) {
                                $("#orderAddressUl").children("li.on")
                                    .removeClass("on")
                                    .find("ul>li>span.pd-l5").remove();
                            }
                            var length = $("#orderAddressUl").children("li").length;
                            if(length == 2) {
                                html += '<span style="position: absolute;right: 19px;bottom: 15px;color: #83A7FF;cursor: pointer;" class="so_up" id="up_down">展开</span>';
                            }
                            $(html).insertBefore($("#newAddress"));
                            new ShowMsg({
                                msg: '收货地址添加成功！',
                                "btn": function () {
                                    this.close();
                                }
                            }).show();
                            me.hide();
                        } else {
                            new ShowMsg({
                                msg: '收货地址添加失败！',
                                "btn": function () {
                                    this.close();
                                }
                            }).show();
                        }
                        me.saveBtn.innerHTML = "保存";
                        $(me.saveBtn).css("cursor", "pointer");
                        me.saveHandler = on(me.saveBtn, "click", function () {
                            me.addAdd.call(me);
                        });
                    });
            }
        },
        valide: function () {
            var flag = true,
                me = this;
            if (me.acceptName.value == "") {
                $(me.acceptName).next().fadeIn(300);
                flag = false;
            }else if (me.acceptName.value.length > 64){
                $(me.acceptName).next().next().fadeIn(300).fadeOut(2000);
                flag = false;
            }
            if (me.mobile.value == "") {
                $(me.mobile).next().fadeIn(300);
                flag = false;
            }else if(!/^1[3,4,5,7,8]\d{9}$/.test(me.mobile.value)){
                $(me.mobile).next().next().fadeIn(300);
                flag = false;
            }
            if (me.provinceCode.value == "") {
                $(me.provinceCode).next().fadeIn(300);
                flag = false;
            }else if (me.provinceCode.value.length > 20){
                $(me.provinceCode).next().next().fadeIn(300).fadeOut(2000);
                flag = false;
            }
            if (me.cityCode.value == "") {
                $(me.cityCode).next().fadeIn(300);
                flag = false;
            }else if (me.cityCode.value.length > 20){
                $(me.cityCode).next().next().fadeIn(300).fadeOut(2000);
                flag = false;
            }
            if (me.districtCode.value == "") {
                $(me.districtCode).next().fadeIn(300);
                flag = false;
            }else if (me.districtCode.value.length > 20){
                $(me.districtCode).next().next().fadeIn(300).fadeOut(2000);
                flag = false;
            }
            if (me.street.value == "") {
                $(me.street).next().fadeIn(300);
                flag = false;
            }else if (me.street.value.length > 128){
                $(me.street).next().next().fadeIn(300).fadeOut(2000);
                flag = false;
            }
            return flag;
        },

        render: function() {
            var me = this;
            on(me.cancelBtn, "click", function () {
                me[me.get('closeAction')]();
            });
            on(me.closeBtn, "click", function () {
                me[me.get('closeAction')]();
            });
            me.addListeners();
        },
    	
    	postCreate: function(){
    		var me = this;
            (function () {
                Ajax.get(Global.baseUrl + '/sec/rsa', {
                }).then(function (response) {
                    if (response.success) {
                        me.modulus = response.data.modulus;
                        me.exponent = response.data.exponent;
                    } else {
                        //TODO
                    }

                });
            })();
    		
    		domStyle.set(me.domNode, {
    			position: 'absolute',
    			'zIndex': '10000',
    			'padding': '4px'
    		});

            me.render();
    		
    		me.inherited(arguments);
    	}
    });
});