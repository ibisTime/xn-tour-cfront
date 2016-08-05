define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'app/views/ViewMixin',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'app/common/Global',
    'app/ux/GenericTextBox',
    'app/ux/GenericDisplayBox',
    'app/ux/GenericButton',
    'dojo/text!./templates/BankcardViewPanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, Global, TextBox, DisplayBox, Button, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        setData: function(data) {
            this.bankNameFld.set('value', data.companyName);
            this.bankFld.set('value', data.bankName);
            this.bankBranchFld.set('value', data.subbranch);
            this.bankAccountFld.set('value', data.cardNo);
        },

        render: function () {
            var me = this;
            me.bankNameFld = new DisplayBox({
                label: '银行户名'
            });
            me.bankFld = new DisplayBox({
                label: '开户银行'
            });
            me.bankBranchFld = new DisplayBox({
                label: '开户支行'
            });
            me.bankAccountFld = new DisplayBox({
                label: '银行账号'
            });
            me.confirmBtn = new Button({
                'label': '修改',
                enter: true,
                color: '#C94749',
                hoverColor: '#ca2e35',
                width: 270,
                height: 40,
                style: {
                    marginLeft: '250px'
                }
            });
            me.bankNameFld.placeAt(me.i1);
            me.bankFld.placeAt(me.i2);
            me.bankBranchFld.placeAt(me.i5);
            me.bankAccountFld.placeAt(me.i3);
            me.confirmBtn.placeAt(me.i4);
        },

        addListeners: function() {
            var me = this;
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});