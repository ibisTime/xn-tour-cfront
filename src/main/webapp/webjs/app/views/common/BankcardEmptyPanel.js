define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'app/views/ViewMixin',
    'dojo/on',
    'dojo/text!./templates/BankcardEmptyPanel.html'
], function(declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, template){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {
        templateString: template,
        postCreate: function() {
            var me = this;
            if (me.company) {
                on(me.domNode, 'click', function() {
                    location.href = me.baseUrl + '/company/bankcard.htm?c=' + me.company;
                });
            } else {
                on(me.domNode, 'click', function() {
                    location.href = me.baseUrl + '/user/bankcard.htm';
                });
            }

            me.inherited(arguments);
        }
    });
});