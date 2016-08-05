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
    'app/ux/GenericComboBox',
    'app/stores/ComboStore',
    'dojo/text!./templates/BankcardPanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, Global, TextBox, DisplayBox, Button, ComboBox, ComboStore, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        _setEditAttr: function(value) {
            this._set('edit', value);
            this.titleNode.innerHTML = '修改银行账户';
        },

        setData: function(data) {
            this._set('data', data);
            this.bankNameFld.set('value', data.companyName);
            this.bankFld.set('item', {code: data.bankCode, name: data.bankName});
            this.bankBranchFld.set('value', data.subbranch);
            this.bankAccountFld.set('value', data.cardNo);
        },

        render: function () {
            var me = this;
            me.bankNameFld = new DisplayBox({
                label: '银行户名'
            });
            me.bankFld = new ComboBox({
                //placeholder: '开户银行',
                //inputWidth: 100,
                label: '开户银行',
                store: new ComboStore({
                    url: Global.baseUrl + '/gene/banks',
                    requestMethod: 'get'
                }),
                validates: [{
                    pattern: /.+/,
                    message: '请选择开户银行'
                }],
                query: {
                    'status': 1,
                    'orderColumn': 'name'
                },
                searchAttr: 'code',
                labelAttr: 'name',
                editable: false
            });
            me.bankAccountFld = new TextBox({
                label: '银行账号',
                validates: [{
                    pattern: /.+/,
                    message: '请输入银行账号'
                }, {
                    pattern: function() {
                        return this.get('value').replace(/\s/g, '').length <= 32;
                    },
                    message: '银行账号最长不超过32位'
                }]
            });
            me.bankBranchFld = new TextBox({
                label: '开户支行',
                validates: [{
                    pattern: /.+/,
                    message: '请输入开户支行'
                }, {
                    pattern: function() {
                        return this.get('value').replace(/\s/g, '').length <= 20;
                    },
                    message: '开户支行最长不超过20位'
                }]
            });
            me.confirmBtn = new Button({
                'label': '提交',
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

        isValid: function() {
            return this.bankFld.checkValidity() &&
                this.bankBranchFld.checkValidity() &&
                this.bankAccountFld.checkValidity();
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});