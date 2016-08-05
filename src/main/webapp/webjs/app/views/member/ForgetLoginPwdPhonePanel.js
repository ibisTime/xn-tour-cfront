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
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/on',
    'app/common/Date',
    'app/ux/GenericTooltip',
	'app/ux/GenericValidationBox',
    'dojo/text!./templates/ForgetLoginPwdPhonePanel.html'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Global, query, DisplayBox, 
		TextBox, Button, dom, domConstruct, on, DateUtil, Tooltip, ValidationBox, template){
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    	
    	templateString: template,
    	
    	baseUrl: Global.baseUrl,
    	
    	next: function() {},
    	
    	showError: function(err) {
    		Tooltip.show(err, this.confirmBtn.domNode);
    	},
    	
    	render: function() {
    		var me = this;
    		me.mobileFld = new TextBox({
    			'label': '手机号',
    			validates: [{
					//not empty
					pattern: /.+/,
					message: '请输入手机号'
				}]
    		});
			me.valiBox = new ValidationBox();
    		//me.codeFld = new TextBox({
    		//	'label':'验证码',
    		//	leftOffset: 360,
    		//	style: {
    		//		'margin-bottom': '0px'
    		//	},
    		//validates: [{
				////not empty
				//pattern: /.+/,
				//message: '请输入验证码'
            //}]
    		//});
    		me.confirmBtn = new Button({
    			'label': '下一步',
    			enter: true,
				style: {
					marginLeft: '250px'
				},
    			handler: me.next
    		});
    		//me.codeFld.placeAt(me.formNode, 'first');
    		me.mobileFld.placeAt(me.phoneNode);
			me.valiBox.placeAt(me.validationNode);
    		me.confirmBtn.placeAt(me.nextBtnNode);
    	},
    	isValid: function() {
    		return this.mobileFld.checkValidity()&&
    		this.valiBox.checkValidity();
    	},
    	getValues: function() {
    		return {
    			mobile: this.mobileFld.get('value')
    		};
    	},
        reset: function() {},
    	getData: function() {
    		return {
				mobile: this.mobileFld.get('value')
    		};
    	},
    	postCreate: function() {
    		var me = this;
    		me.render();
    		me.inherited(arguments);
    	}
    	
    });
});