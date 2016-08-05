define([
    'dojo/_base/declare',
    'dijit/_WidgetBase', 
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'app/common/Global',
    'dojo/query',
    'app/ux/GenericDisplayBox',
    'app/ux/GenericTextBox',
    'app/ux/GenericButton',
    'app/ux/GenericPhoneCodeBox',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/on',
    'app/common/Date',
    'dojo/dom-class',
    'app/ux/GenericTooltip',
    'dojo/text!./templates/ForgetLoginPwdConfirmPanel.html'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Global, 
		query, DisplayBox, TextBox, GenericButton,GenericPhoneCodeBox, dom, domConstruct, on, DateUtil, domClass, Tooltip, template){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    	
    	templateString: template,
    	
    	baseUrl: Global.baseUrl,
    	
    	mobile:'',
    	
    	checkCode:'',
    	
    	next: function() {},

        reset: function() {},
    	
    	_setMobileAttr: function(value) {
    		this._set('mobile', value);
            this.mobileFld.displayNode.innerHTML = Global.encodeInfo(value, 3, 3);
    	},
		
    	_setCheckCodeAttr: function(value) {
    		this._set('checkCode', value);
    	},
    	
		setValues: function(values) {
    		for (var key in values) {
    			this.set(key, values[key]);
    		}
    	},
    	render: function() {
    		var me = this;

            me.mobileFld = new DisplayBox({
                'label': '手机号'
            });
            me.codeFld = new GenericPhoneCodeBox({
				label: '短信验证码',
				inputWidth: 100,
				buttonWidth: 130,
				height: 40,
                validates: [{
                    //not empty
                    pattern: /.+/,
                    message: '请输入验证码'
                }]
            });

    		me.newPwdFld = new TextBox({
     			label: '输入新密码',
				promptMessage: '6-12位字符，可包含英文字符、数字、符号',
				validates: [{
					pattern: /.+/,
					message: '请输入登录密码'
				}, {
					pattern: /^.{6,12}$/,
					message: '密码长度在6-12个字符'
				}, {
					pattern: /^[A-Za-z0-9\s!"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~]+$/,
					message: '密码格式错误'
				}],
				type: 'password',
				showStrength: true
			});
			me.confirmPwdFld = new TextBox({
				label: '再次输入',
				validates: [{
					pattern: /.+/,
					message: '请再次输入登录密码'
				}, {
					pattern: function() {
						return me.confirmPwdFld.get('Value') == me.newPwdFld.get('Value');
					},
					message: '两次密码输入不一致'
				}],
				type: 'password'
			});

            me.mobileFld.placeAt(me.phoneNode);
            me.codeFld.placeAt(me.codeNode);

     		me.newPwdFld.placeAt(me.pwdNode);
    		me.confirmPwdFld.placeAt(me.confirmPwdNode);

            me.prevBtn = new GenericButton({
                'label': '上一步',
                color: '#E2E2E2',
                hoverColor: '#EDEDED',
				width: 100,
                textStyle: {
                    color: '#666666'
                },
                innerStyle: {
                    borderColor: '#C9C9C9'
                },
                style: {
                    marginLeft: '250px'
                },
                handler: me.prev
            });

    		me.confirmBtn = new GenericButton({
    			'label': '下一步',
    			style: {
    				marginLeft: '5px'
    			},
    			enter: true,
    			handler: me.next
    		});

            me.prevBtn.placeAt(me.prevBtnNode);
    		me.confirmBtn.placeAt(me.nextBtnNode);

    	},

    	showError: function(err) {
    		Tooltip.show(err, this.confirmBtn.domNode);
    	},
    	isValid: function() {
    		return this.newPwdFld.checkValidity()&&
    		this.confirmPwdFld.checkValidity() && this.codeFld.checkValidity();
    	},
    	getData: function() {
    		return {
				smsCaptcha:this.codeFld.get('value'),
				newPwd: this.newPwdFld.get('value')
    		};
    	},
    	postCreate: function() {
    		var me = this;
    		me.render();
    		me.inherited(arguments);
    	}
    	
    });
});