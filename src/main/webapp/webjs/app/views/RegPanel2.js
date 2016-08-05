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
    'app/common/Date',
    'dojo/text!./templates/RegPanel2.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, TextBox, PhoneCodeBox, Button, DateUtil, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        render: function () {
            var me = this;
            me.usernameFld = new TextBox({
                label: '真实姓名',
                validates: [{
                    //not empty
                    pattern: /.+/,
                    message: '请输入真实姓名'
                }]
            });
            me.IDNoFld = new TextBox({
                label: '身份证号码',
                validates: [{
                    pattern: /.+/,
                    message: '请输入身份证号码'
                }, {
                    pattern: /^(([0-9]{17}[0-9X]{1})|([0-9]{15}))$/,
                    message: '身份证号码要求15位或18位数字，18位末位可以为X'
                }, {
                    pattern: function () {
                        var _id = me.IDNoFld.get('value');
                        var powers = new Array("7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2");
                        var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                        if (_id.length == 15) {
                            //TODO
                            return true;
                        } else if (_id.length == 18) {
                            _id = _id + '';
                            var _num = _id.substr(0, 17);
                            var _parityBit = _id.substr(17);
                            var _power = 0;
                            for (var i = 0; i < 17; i++) {
                                _power += parseInt(_num.charAt(i)) * parseInt(powers[i]);
                            }
                            var mod = parseInt(_power) % 11;
                            if (parityBit[mod] == _parityBit) {
                                return true;
                            }
                            return false;
                        }
                    },
                    message: '身份证号码有误,请检查'
                }, {
                    pattern: function () {
                        var value = this.get('value'),
                            dateStr = value.slice(6, 10) + '-' + value.slice(10, 12) + '-' + value.slice(12, 14);
                        return DateUtil.parse(dateStr) ? true : false;
                    },
                    message: '身份证号码有误,请检查'
                }, {
                    pattern: function () {
                        var value = this.get('value'),
                            dateStr = value.slice(6, 10) + '-' + value.slice(10, 12) + '-' + value.slice(12, 14);
                        var year18 = DateUtil.format(DateUtil.add(DateUtil.parse(dateStr), 'year', 18));
                        return year18 <= DateUtil.format(new Date()) ? true : false;
                    },
                    message: '未满18周岁不能实名认证'
                }]
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
                label: '确认交易密码',
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
            me.confirmBtn = new Button({
                'label': '完成注册',
                enter: true,
                color: '#C94749',
                hoverColor: '#ca2e35',
                width: 270,
                height: 40,
                style: {
                    marginLeft: '250px'
                }
            });

            me.usernameFld.placeAt(me.i1);
            me.IDNoFld.placeAt(me.i2);
            me.phoneCodeFld.placeAt(me.i6);
            me.pwdFld.placeAt(me.i3);
            me.confirmPwdFld.placeAt(me.i4);
            me.confirmBtn.placeAt(me.i5);
        },

        addListeners: function() {
            var me = this;
        },

        isValid: function() {
            return this.usernameFld.checkValidity() &&
                this.IDNoFld.checkValidity() &&
                this.phoneCodeFld.checkValidity() &&
                this.pwdFld.checkValidity() && this.confirmPwdFld.checkValidity();
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});