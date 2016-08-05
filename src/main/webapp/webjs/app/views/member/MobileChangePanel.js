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
    'dojo/text!./templates/MobileChangePanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, Global, DisplayBox, TextBox, PhoneCodeBox, Button, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,
        mobile: '',

        _setMobileAttr: function(value) {
            this.mobile = value;
            this.oldPhoneFld.displayNode.innerHTML = Global.encodeInfo(value, 3, 3);
        },
        render: function () {
            var me = this;
            me.oldPhoneFld = new DisplayBox({
                label: '旧手机号'
            });
            me.phoneFld = new TextBox({
                label: '新手机号',
                //promptMessage: '绑定的卡的开户信息与身份证必须一致的，否则绑定失败',
                validates: [{
                    //not empty
                    pattern: /.+/,
                    message: '请输入新手机号'
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
                label: '交易密码',
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
            me.oldPhoneFld.placeAt(me.i1);
            me.phoneFld.placeAt(me.i2);
            me.phoneCodeFld.placeAt(me.i3);
            me.pwdFld.placeAt(me.i4);
            me.confirmBtn.placeAt(me.i5);
        },

        addListeners: function() {
            var me = this;
        },

        isValid: function() {
            return this.phoneFld.checkValidity() && this.phoneCodeFld.checkValidity() &&
                this.pwdFld.checkValidity();
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});