define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'app/views/ViewMixin',
    'app/common/Global',
    'dojo/on',
    'dojo/text!./templates/BankcardValidPanel.html'
], function(declare, _WidgetBase, _TemplatedMixin, ViewMixin, Global, on, template){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {
        templateString: template,

        bankcard: '',

        _setBankcardAttr: function(value) {
            value.cardNo ? true : (value.cardNo = value.bankcardNo);
            this.bodyNode.innerHTML = value.cardNo.slice(0, 4) + '***' + value.cardNo.slice(value.cardNo.length - 4, value.cardNo.length);
            if (this.params.canClick) {
                this.domNode.style.cursor = 'pointer';
                on(this.domNode, 'click', function() {
                    location.href = Global.baseUrl + '/company/bankcard.htm?id=' + value.id;
                });
            }
        },

        postCreate: function() {
            var me = this;
            me.inherited(arguments);
        }
    });
});