define("app/ux/GenericPhoneCodeBox", [ 
    'dojo/_base/declare',
    'app/ux/GenericTextBox',
    'app/ux/GenericButton',
    'app/common/Global',
    'dojo/on',
    'dojo/mouse',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/dom-attr',
    'app/ux/GenericTooltip',
	'dojo/dom-geometry',
	'dojo/window',
    'dijit/focus'
], function (declare, TextBox, Button, Global, on, mouse, domConstruct, domClass, domStyle, domAttr, Tooltip, domGeometry, win, focusUtil) {
	return declare([TextBox], {
		
		validates: [{
			pattern: /.+/,
			message: '请输入短信验证码'
		}],
		
		limitRegex: /[\d\w]/,
		disabled: false,
		maxLength: 8,
		counting: false,

		_setDisabledAttr: function(disabled) {
			this.sendBtn.set('disabled', disabled);
			this.inherited(arguments);
		},

		displayMessage: function(/*String*/ message, type){
			// summary:
			//		Overridable method to display validation errors/hints.
			//		By default uses a tooltip.
			// tags:
			//		extension
			var me = this;
			type = type || '';
			if (type == 'error') {
				me.state = 'Error';
				me.set("message", message);
			}

			var TooltipTypeMap = {'': 'info', 'Warning': 'warning', 'Error': 'warning'};
			if(message){
				var bb = domGeometry.position(me.domNode);
				if (bb.w && bb.h) {

					setTimeout(function() {
						win.scrollIntoView(me.domNode);
						Tooltip.show(message, me.domNode, TooltipTypeMap[me.state], ['above-centered']);
					}, 100);
					//Tooltip.show(message, me.domNode, TooltipTypeMap[me.state]);
					if (me.state === 'Error') {
						domClass.add(me.domNode, 'dijitTextBoxError');
					}
				}
			}else{
				Tooltip.hide(me.domNode);
				domClass.remove(me.domNode, 'dijitTextBoxError');
			}
		},
		
		render: function() {
			var me = this;
			me.sendBtn = new Button({
				label: '获取验证码',
				width: 160,
				height: 45,
				disabled: me.disabled,
				//disabledMsg: '请先输入有效的手机号码',
				style: {
					position: 'absolute',
					marginLeft: 2,
					left: '115px',
					marginTop: '-32px'
				},
				textStyle: {
    				color: '#666',
    				fontWeight: 'normal',
					fontSize: '12px',
					padding: '0 15px'
    			},
    			innerStyle: {
    				backgroundColor: '#F8F8F8',
    				border: '1px solid #C4C4C4',
    				padding: '1px'
    			}
			});
			me.sendBtn.placeAt(me.domNode);
            on(me.sendBtn, 'click', function() {
                me.countdown(60);
            });
			on(me.domNode, 'click', function(e) {
				if (me.disabled) {
					domClass.add(me.sendBtn.domNode, 'bounce');
				}
				e.preventDefault();
			});

			on(me.sendBtn.domNode, ['webkitAnimationEnd', 'mozAnimationEnd', 'animationend'], function() {
				domClass.remove(this, 'bounce');
			});
        },
		
		countdown: function(time) {
			var me = this,
				target = me.sendBtn.containerNode,
				label = '重发验证码';
			me.set('isFirst', false);
			me.sendBtn.set('disabled', true);
			focusUtil.focus(me.textbox);
			me.counting = true;
			Global.loop(time, function(t) {
				target.innerHTML = '（' + t +'）' + label;
			}, function() {	
				target.innerHTML = label;
				me.sendBtn.set('disabled', false);
				me.counting = false;
			});
		},
		
		showError: function(message) {
			Tooltip.show(message, this.sendBtn.domNode);
		},
		
		buildRendering: function() {
    		var me = this;
    	    this.inherited(arguments);
			me.render();
    	}
	});
});