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
    'app/ux/GenericDisplayBox',
    'app/ux/GenericTextBox',
    'app/ux/GenericPhoneCodeBox',
    'app/ux/GenericButton',
    'dojo/text!./templates/TPwdPanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, Global, DisplayBox, TextBox, PhoneCodeBox, Button, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        mode: 0,

        mobile: '',

        _setModeAttr: function(value) {
            this.titleNode.innerHTML = (value ? '修复' : '设置') + '交易密码';
        },

        _setMobileAttr: function(value) {
            this.mobile = value;
            this.phoneFld.displayNode.innerHTML = Global.encodeInfo(value, 3, 3);
        },

        render: function () {
            var me = this;
            me.phoneFld = new DisplayBox({
                label: '您的手机号'
            });
            me.phoneCodeFld = new PhoneCodeBox({
                label: '短信验证码',
                inputWidth: 100,
                buttonWidth: 130,
                height: 40
            });
            me.pwdFld = new TextBox({
                label: '交易密码',
                promptMessage: '6-12位，英文(区分大小写),数字或常用符号',
                validates: [{
                    pattern: /.+/,
                    message: '请输入交易密码'
                }, {
                    pattern: /^.{6,12}$/,
                    message: '密码长度在6-12个字符'
                }, {
                    pattern: /^[A-Za-z0-9\s!"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~]+$/,
                    message: '密码格式错误'
                }],
                type: 'password',
                showStrength: true
            });
            me.confirmPwdFld = new TextBox({
                label: '再次输入',
                validates: [{
                    pattern: /.+/,
                    message: '请再次输入确认密码'
                }, {
                    pattern: function() {
                        return me.confirmPwdFld.get('Value') == me.pwdFld.get('Value');
                    },
                    message: '两次密码输入不一致'
                }],
                type: 'password'
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

            me.phoneFld.placeAt(me.i1);
            me.phoneCodeFld.placeAt(me.i2);
            me.pwdFld.placeAt(me.i3);
            me.confirmPwdFld.placeAt(me.i4);
            me.confirmBtn.placeAt(me.i5);
        },

        addListeners: function() {
            var me = this;
        },

        isValid: function() {
            return this.phoneCodeFld.checkValidity() &&
                this.pwdFld.checkValidity() &&
                this.confirmPwdFld.checkValidity();
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});