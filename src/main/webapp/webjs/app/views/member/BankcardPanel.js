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
    'app/views/common/BankcardSelectionField',
    'app/ux/GenericTextBox',
    'app/ux/GenericButton',
    'dojo/text!./templates/BankcardPanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, Global, BankcardSelectionField, TextBox, Button, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        render: function () {
            var me = this;
            me.bankListFld = new BankcardSelectionField({
                id: 'tofocus',
                label: '选择银行'
            });
            me.bankcardNo = me.bankcardNoFld = new TextBox({
                    label: '银行卡卡号',
                    promptMessage: '绑定的卡的开户信息与身份证必须一致的，否则绑定失败',
                    style:'right: -199px;',
                    validates: [{
                        pattern: /.+/,
                        message: '请输入银行卡卡号'
                    }, {
                        pattern: function() {
                            return /^\d+$/.test(this.get('value').replace(/\s/g, ''));
                        },
                        message: '银行卡卡号必须是数字'
                    }, {
                        pattern: function() {
                            return /^\d{6,}$/.test(this.get('value').replace(/\s/g, ''));
                        },
                        message: '银行卡卡号至少6位数字'
                    }, {
                        pattern: function() {
                            return this.get('value').replace(/\s/g, '').length <= 25;
                        },
                        message: '银行卡卡号最长不超过25位'
                    }],
                    onKeyUp: function(e) {
                        var value = this.get('value').replace(/\s/g,''),
                            len = value.length;
                        if (len == 5 || len == 9 || len == 13 || len == 17) {
                            value = value.split('');
                            while(len > 1) {
                                value.splice(len - 1, 0, ' ');
                                len = len - 4;
                            }
                            value = value.join('');
                            this.set('value', value);
                        }
                    }
            });
            me.subbankFld = new TextBox({
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
            me.bankListFld.placeAt(me.i1);
            me.subbankFld.placeAt(me.i4);
            me.bankcardNo.placeAt(me.i2);
            me.confirmBtn.placeAt(me.i3);
        },

        addListeners: function() {
            var me = this;
        },

        isValid: function() {
            return this.bankListFld.checkValidity() &&
                this.subbankFld.checkValidity() &&
                this.bankcardNo.checkValidity();
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});