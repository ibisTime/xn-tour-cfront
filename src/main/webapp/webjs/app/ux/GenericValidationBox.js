define("app/ux/GenericValidationBox", [
    'dojo/_base/declare',
    'dijit/_WidgetBase', 
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'app/common/Global',
    'dojo/query',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/on',
    'app/common/Ajax',
    'app/common/Position',
    'app/ux/GenericTooltip',
    'dojo/text!./templates/GenericValidationBox.html'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Global, 
		query, dom, domConstruct, domClass, on, Ajax, Position, Tooltip, template){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    	
    	templateString: template,

        _setNoLabelAttr: function(value) {
            if (value) {
                this.labelNode.style.display = 'none';
            }
        },

        checkValidity: function() {
            var geetest_challenge = query('input[name=geetest_challenge]')[0].value;
            var geetest_validate = query('input[name=geetest_validate]')[0].value;
            var geetest_seccode = query('input[name=geetest_seccode]')[0].value;
            if(geetest_challenge == '' || geetest_validate == '' || geetest_seccode ==''){
                Tooltip.show('请滑动完成验证', this.domNode, 'warning', ['above-centered']);
                return false;
            }
            return true;
        },
    	
    	postCreate: function() {
    		var me = this;
            var sct = domConstruct.create('script', {'src': 'http://static.geetest.com/static/tools/gt.js'}, me.domNode);
            sct.onload = function() {
                Ajax.get(Global.baseUrl + '/user/gt/pre', {}).then(function(data) {
                    initGeetest({
                        gt: data.gt,
                        challenge: data.challenge,
                        product: me.type || "embed", // 产品形式
                        offline: !data.success
                    }, function(captchaObj) {
                        captchaObj.appendTo("#captchaconfirm");
                    });
                });
            };
            on(me.domNode, 'click', function() {
                Tooltip.hide();
            });

    		me.inherited(arguments);

    	}
    	
    });
});