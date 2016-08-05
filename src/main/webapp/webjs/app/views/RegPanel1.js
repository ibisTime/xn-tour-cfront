define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'app/views/ViewMixin',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'app/ux/GenericTextBox',
    'app/ux/GenericPhoneCodeBox',
    'app/ux/GenericButton',
    'app/ux/GenericWindow',
    'app/ux/GenericValidationBox',
    'dojo/text!./templates/RegPanel1.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, TextBox, PhoneCodeBox, Button, Win, ValidationBox, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        render: function () {
            var me = this;
            me.phoneFld = new TextBox({
                label: '手机号码',
                //promptMessage: '绑定的卡的开户信息与身份证必须一致的，否则绑定失败',
                validates: [{
                    //not empty
                    pattern: /.+/,
                    message: '请输入手机号码'
                }]
            });
            me.phoneCodeFld = new PhoneCodeBox({
                label: '短信验证码',
                inputWidth: 100,
                buttonWidth: 130,
                height: 40,
                disabled: true
            });
            me.pwdFld = new TextBox({
                label: '登录密码',
                promptMessage: '6-12位，英文(区分大小写),数字或常用符号',
                validates: [{
                    pattern: /.+/,
                    message: '请输入登录密码'
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
                label: '确认密码',
                validates: [{
                    pattern: /.+/,
                    message: '请输入确认密码'
                }, {
                    pattern: function() {
                        return me.confirmPwdFld.get('Value') == me.pwdFld.get('Value');
                    },
                    message: '两次密码输入不一致'
                }],
                type: 'password'
            });
            me.valiBox = new ValidationBox({
                type: 'float'
            });
            me.nextBtn = new Button({
                'label': '立即注册',
                enter: true,
                disabledMsg: '勾选服务协议即可注册',
                color: '#C94749',
                hoverColor: '#ca2e35',
                width: 270,
                height: 40,
                style: {
                    marginLeft: '250px'
                },
                disabled: true
            });

            me.phoneFld.placeAt(me.phoneNode);
            me.phoneCodeFld.placeAt(me.phoneCodeNode);
            me.pwdFld.placeAt(me.pwdNode);
            me.valiBox.placeAt(me.validationNode);
            me.confirmPwdFld.placeAt(me.confirmPwdNode);
            me.nextBtn.placeAt(me.nextBtnNode);
        },

        addListeners: function() {
            var me = this;
            //on(me.phoneFld, 'blur', function() {
            //    var isValid = me.phoneFld.checkValidity();
            //    if(isValid) {
            //        me.phoneCodeFld.set('disabled', false);
            //    }
            //});
            on(me.agreeNode, 'click', function() {
                me.nextBtn.set('disabled', !this.checked);
            });
            on(me.agreeWordsNode, 'click', function() {
                if (!me.win) {
                    me.win = new Win({
                        width:900,
                        height:500,
                        title:"服务协议"
                    });
                    me.win.placeAt(document.body);
                }
                me.win.show();
                me.win.set('msg', '文本文本');
            });
        },

        isValid: function() {
            return this.phoneFld.checkValidity() &&
                this.phoneCodeFld.checkValidity() &&
                this.pwdFld.checkValidity() &&
                this.confirmPwdFld.checkValidity() &&
                this.valiBox.checkValidity();
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});