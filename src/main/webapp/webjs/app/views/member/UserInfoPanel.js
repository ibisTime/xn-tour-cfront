define([
    'dojo/_base/declare',
    'dijit/_WidgetBase', 
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
	'app/views/ViewMixin',
    'dojo/dom-construct',
    'dojo/query',
    'app/common/Global',
    'dojo/on',
    'dojo/dom',
    'dojo/string',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-attr',
    'app/ux/GenericTextBox',
    'app/ux/GenericDisplayBox',
    'app/common/Ajax',
    'app/ux/GenericTooltip',
    'app/common/Data',
    'dojo/when',
    'dojo/_base/config',
    'app/ux/GenericProgressBar',
    'app/jquery/Slimscroll',
    'app/common/Dict',
    'dojo/text!./templates/UserInfoPanel.html'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin,
		domConstruct, query, Global, on, dom, string, domStyle, domClass, domAttr, TextBox, DisplayBox,Ajax,Tooltip,
		Data, when, cfg, ProgressBar, Slimscroll, Dict, template){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin], {
    	
    	baseUrl: Global.baseUrl,
    	username: '',
    	usernameReal: '',
    	mobile: '',
    	email: '',
    	userNickName: '',
    	placeOfOrigin: '',
    	gender: '',
    	introducer: '',
    	address: '',
    	editing: false,
        userRealName: '',
        mobileNode0: '为您的账户安全，请尽快绑定手机。',
        mobileNode1: '',
        userRealNameNode0: '为保障您的权利，请尽快完成实名认证。<a target="_blank" href="'+Global.baseUrl+'/user/real.htm">立即认证</a>',
        userRealNameNode1: '',
        tradePwdNode0: '为您的账户安全，请尽快设置交易密码。<a target="_blank" href="'+Global.baseUrl+'/user/tpwd.htm">立即设置</a>',
        tradePwdNode1: '',
        bankcardNode0: '为您的快捷操作，请尽快绑定银行卡。<a target="_blank" href="'+Global.baseUrl+'/acc/bankcard/bind.htm?edit=0">立即绑定</a>',
        bankcardNode1: '',
    	// html
    	usernameRealTrueHTML: '<span>真实姓名：</span><b>${usernameReal}</b>',
    	usernameRealFalseHTML: '<span>真实姓名：</span><span class="am-ft-gray">未认证</span>' +
    		'<span class="ui-aseparator">|</span><a href="'+Global.baseUrl+'/user/real.htm">实名认证</a>',
    	medifyBtnHTML: '<a href="'+Global.baseUrl+'/user/mobile_c.htm">${action}</a>',
    	saveBtnHTML: '<a href="javascript:void(0)">保存</a>',
    	blankHTML: '<span class="am-ft-gray ui-text-extra">未填写</span>',
    	saveDetail: function() {},

    	
    	_setUsernameRealAttr: function(value) {
    		this._set('usernameReal', value);
    		this.usernameRealNode.innerHTML = value ? 
    				string.substitute(this.usernameRealTrueHTML, {usernameReal: value}) : this.usernameRealFalseHTML;
    	},
    	
    	_setMobileAttr: function(value) {
    		this._set('mobile', value);
    		//this.mobileTextNode.innerHTML = Global.encodeInfo(value, 3, 3);
    		//var btn = domConstruct.toDom(string.substitute(this.medifyBtnHTML, {action: '修改'}));
    		//domConstruct.place(btn, this.mobileTextNode.parentNode);
            if (value) {
                domClass.add(this.mobileNode, 'd-user-status-true');
                this.set('mobileNode1', '您已绑定手机 '+Global.encodeInfo(value, 3, 3)+'。<a target="_blank" href="'+Global.baseUrl+'/user/mobile_c.htm">更换手机</a>');
            }
    	},

        _setCompanysAttr: function(value) {
            var html = '';
            if (value.length > 0) {
                for (var i = 0, len = value.length; i <len; i++) {
                    var item = value[i];
                    if (item.status == 2) {
                        html += '<li><a target="_blank" href="'+this.baseUrl+'/company/detail.htm?c='+item.code+'">'+item.name+'</a></li>';
                    }
                }
                domConstruct.place(domConstruct.toDom(html), this.companyNode);
            }
            $(this.companyNode).slimScroll({
                height: '320px',
                alwaysVisible: true
            });
        },
    	
    	templateString: template,
    	
    	render: function() {
    		var me = this;

            on(me.userStatusNode, '.fa:mouseover', function(e) {
                var setted = domClass.contains(this, 'd-user-status-true');
                Tooltip.show(me.get(domAttr.get(this, 'data-dojo-attach-point') + (setted ? 1 : 0)), this, setted ? 'info': 'warning', ['above-centered']);
            });
            on(me.userStatusNode, '.fa:mouseout', function(e) {
                Tooltip.hide();
            });

            // shake for un done
            function shakeStatus() {
                var items = query('i:not(.d-user-status-true)', me.userStatusNode);
                Global.loop(items.length, function(count) {
                    var item = items.at(items.length - count)[0];
                    if (item) {
                        var setted = domClass.contains(item, 'd-user-status-true');
                        domClass.add(item, 'phone-calling');
                        Tooltip.show(me.get(domAttr.get(item, 'data-dojo-attach-point') + (setted ? 1 : 0)), item, setted ? 'info': 'warning', ['above-centered']);
                    } else {
                        Tooltip.hide();
                    }

                }, '', '', 3);

            }

            setTimeout(shakeStatus, 1000);
    	},
    	
    	setValues: function(values) {
            var me = this;
    		for (var key in values) {
    			this.set(key, values[key]);
    		}
            if (values.realName) {
                domClass.add(this.userRealNameNode, 'd-user-status-true');
                this.set('userRealNameNode1', '您已完成实名认证 '+Global.encodeInfo(values.realName, 1, 0));
            }
			if (values.tradePwdStrength) {
				domClass.add(me.tradePwdNode, 'd-user-status-true');
				me.set('tradePwdNode1', '您已设置交易密码，强度为'+Dict.get('pwdStrength')[parseInt(values.tradePwdStrength)]+'。' +
					'<a target="_blank" href="'+Global.baseUrl+'/user/tpwd_c.htm">修改交易密码</a>');
			}
			me.usernameNode.innerHTML = Global.sirOrLady(values);
    	},
    	
    	afterSave: function(saved) {
    		var me = this;
    	},
    	
    	addLinsteners: function() {
    		var me = this;
    	},
    	
    	postCreate: function(){
    		var me = this;
    		me.render();
    		me.addLinsteners();
    	    this.inherited(arguments);
    	}
    });
});