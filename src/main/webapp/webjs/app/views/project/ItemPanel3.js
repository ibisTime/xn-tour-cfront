define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'app/views/ViewMixin',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'app/common/Global',
    'app/ux/GenericButton',
    'dojo/text!./templates/ItemPanel3.html'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin, on, query,
             domClass, domStyle, Global, Button, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin], {

        templateString: template,

        item: '',

        _setItemAttr: function(value) {
            var me = this;
            if (value.quote == 'A') {
                me.feeNode.innerHTML = '年化(自然日): '+Global.formatNumber((value.quoteValue1)*100, 2)+'%';
            } else if (value.quote == 'B') {
                me.feeNode.innerHTML = '年化(工作日): '+Global.formatNumber((value.quoteValue1)*100, 2)+'%';
            } else if (value.quote == 'C') {
                me.feeNode.innerHTML = '分成: '+Global.formatNumber((value.quoteValue1)*10, 1)+'成';
            } else {
                me.feeNode.innerHTML = '保本年化: '+Global.formatNumber((value.quoteValue1)*100, 2)+'%;  分成: '+Global.formatNumber((value.quoteValue2)*10, 1)+'成';
            }
            if (value.t == 'C') {
                me.linkNode.href = Global.baseUrl + '/project/customized_d.htm?c=' + value.code;
            } else if (value.t == 'B') {
                me.linkNode.href = Global.baseUrl + '/project/agency_trade_d.htm?c=' + value.code;
            } else if (value.t == 'D') {
                me.linkNode.href = Global.baseUrl + '/project/management_d.htm?c=' + value.code;
            }

        },

        render: function () {
            var me = this;
        },

        addListeners: function() {
            var me = this;

        },

        isValid: function() {
            return true;
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});