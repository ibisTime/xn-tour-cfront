define("app/views/operator/SubmitConfirm", [
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
    'dojo/text!./templates/SubmitConfirm.html',
    'app/jquery/$',
	'app/views/operator/ShowMsg'
], function(declare, _WidgetBase, _TemplatedMixin, domStyle, on, mouse, 
		DialogUnderlay, Global, query, focusUtil, dom, domConstruct, string,
        domClass, Position, Moveable, TextBox, Button, ViewMixin, Ajax, RSA,
        Tooltip, lang, cookie, MiniMsgBox, LoginTopbar, when, Data, template, J, ShowMsg){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {
    	
    	templateString: template,
        closeAction: 'hide',

    	contentClass: '',
		infos: "",

    	show: function(infos) {
    		var me = this;
			var $li = $("#orderAddressUl").find("li.on");
			var name = $li.find(".so-name").text(),
				mobile = $li.find(".so-mobile").text(),
				address = $li.find(".so-address").text();
			me.infos = infos;
    		domStyle.set(me.domNode, {
    			display: 'block'
    		});
            $(".submitConfirm").length > 0 ? domStyle.set(me.domNode, {
                "display": "block"
            }) : query("body")[0].appendChild(me.domNode);
			$("#sc-address").html("收货信息<br>" + name + ", " + mobile + "<br>" + address);
			$("#sc-receipt").html("发票信息<br>" + "发票类型："+$("#receipt")[0].selectedOptions[0].text+"<br>"
				+ "发票抬头：" + $("#receiptTitle").val());
    		me.domNode.focus();
    	},
    	
    	close: function() {
    		var me = this;
    		domConstruct.destroy(me.domNode);
    		DialogUnderlay.hide();
    	},
    	
    	hide: function() {
    		var me = this;
    		domStyle.set(me.domNode, {
    			display: 'none'
    		});
    		DialogUnderlay.hide();
    	},
    	
    	addListeners: function() {
    		var me = this;
			on(me.cancelBtn, "click", function () {
				me[me.get('closeAction')]();
			});
			on(me.okBtn, "click", function () {
				var url = Global.baseUrl + '/operators/submitOrder',
					config;
				if(me.infos.type == 2){
					url = Global.baseUrl + '/operators/submitCart';
				}
				delete me.infos.type;
				config = me.infos;
				Ajax.post(url, config)
					.then(function (response) {
						if(response.success){
							var code = response.data || response.data.code;
							//提交成功
							location.href = Global.baseUrl + '/operator/pay_order.htm?code='+code;
						}else{
							new ShowMsg({
								msg: response.msg,
								"btn": function () {
									this.close();
								}
							}).show();
						}
					});
				me[me.get('closeAction')]();
			});
    	},

        render: function() {
            var me = this;
			me.addListeners();
        },
    	
    	postCreate: function(){
    		var me = this;
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