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
    'app/ux/GenericButton',
    'dojo/text!./templates/TPwdChangePanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, Global, TextBox, Button, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        mobile: '',

        _setMobileAttr: function(value) {
            this.mobile = value;
            this.phoneFld.displayNode.innerHTML = Global.encodeInfo(value, 3, 3);
        },

        render: function () {
            var me = this;
            me.oldPwdFld = new TextBox({
                label: '旧交易密码',
                validates: [{
                    pattern: /.+/,
                    message: '请输入旧交易密码'
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
            me.pwdFld = new TextBox({
                label: '新交易密码',
                promptMessage: '6-12位，英文(区分大小写),数字或常用符号',
                validates: [{
                    pattern: /.+/,
                    message: '请输入新交易密码'
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
            me.oldPwdFld.placeAt(me.i1);
            me.pwdFld.placeAt(me.i2);
            me.confirmPwdFld.placeAt(me.i3);
            me.confirmBtn.placeAt(me.i4);
        },

        addListeners: function() {
            var me = this;
        },

        isValid: function() {
            return this.oldPwdFld.checkValidity() && this.pwdFld.checkValidity() &&
                this.confirmPwdFld.checkValidity() &&
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