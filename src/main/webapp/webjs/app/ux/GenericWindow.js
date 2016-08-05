define("app/ux/GenericWindow", [
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
    'app/common/Fx',
	'app/ux/GenericButton',
    'dojo/text!./templates/GenericWindow.html'
], function(declare, _WidgetBase, _TemplatedMixin, domStyle, on, mouse, 
		DialogUnderlay, Global, query, focusUtil, dom, domConstruct, string,domClass, Position, Moveable, Fx, Button, template){
    return declare([_WidgetBase, _TemplatedMixin], {
    	
    	templateString: template,
    	
    	alertClass:'',
    	contentClass: '',
    	msg: '',
        width: '',
    	title: '',
    	closeAction: 'hide',
    	confirmText: '',
    	confirmAndCancel: false,
    	onConfirm: function() {},
    	onCancel:function() {},
    	
    	_setAlertClassAttr:function(value){
    		this._set('alertClass', value);
    		domClass.add(this.alertNode, value);	
    	},

        _setWidthAttr: function(value) {
            domStyle.set(this.domNode, {
                width: value + 'px'
            });
        },

        _setHeightAttr: function(value) {
            domStyle.set(this.contentNode, {
                height: value + 'px',
                'overflowY': 'auto'
            });
        },
    		
    	_setContentClassAttr: function(value){
    		this._set('contentClass', value);
    		domClass.add(this.contentNode, value);		
    	},
    	
    	_setMsgAttr: function(value) {
    		this._set('msg', value);
    		this.msgNode.innerHTML = value;
    	},
    	
    	_setTitleAttr: function(value) {
    		this._set('title', value);
            domStyle.set(this.titleCtnNode, {
                display: 'block'
            });
    		this.titleNode.innerHTML = value;
    	},
    	
    	show: function() {
    		var me = this;
    		me.enterBtns = query('.dijitButton.enterbutton').filter(function(i) {
    			return i != me.confirmBtnNode;
    		});
    		me.enterBtns.removeClass('enterbutton');
    		domStyle.set(me.domNode, {
    			display: 'block'
    		});
    		Position.screenCenter(me.domNode);
    		DialogUnderlay.show({}, 9999);
    		if (document.activeElement) {
    			document.activeElement.blur();
    		}
    		me.domNode.focus();
            Fx.shakeX(me.domNode);
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
    		on(me.closeNode, 'click', function() {
    			me[me.get('closeAction')]();
    		});
    		
    		if (me.confirmBtn) {
    			on(me.confirmBtn, 'click', function() {
        			me.onConfirm.call();
        		});
    		}
    		
    		if (me.cancelBtn) {
    			on(me.cancelBtn, 'click', function() {
        			me.onCancel.call();
        		});
    		}
    	},
    	
    	postCreate: function(){
    		var me = this;
    		
    		domStyle.set(me.domNode, {
    			position: 'absolute',
    			'zIndex': '10000',
    			'padding': '4px'
    		});
    		
    		new Moveable(me.domNode, {
    			handle: me.titleCtnNode
    		});
    		domStyle.set(me.titleCtnNode, {
				cursor: 'move'
			});
    		
    		me.inherited(arguments);

			if (this.get('confirmAndCancel')) {
				me.confirmBtn = new Button({
					label: '确定',
					width: 80,
					height: 30
				});
				me.confirmBtn.placeAt(this.confirmBtnNode);
				me.cancelBtn = new Button({
					label: '取消',
					width: 80,
					height: 30,
					color: '#E2E2E2',
					hoverColor: '#EDEDED',
					textStyle: {
						color: '#666666'
					},
					innerStyle: {
						borderColor: '#C9C9C9'
					}
				});
				me.cancelBtn.placeAt(this.cancelBtnNode);
			}

			me.addListeners();
    	}
    });
});