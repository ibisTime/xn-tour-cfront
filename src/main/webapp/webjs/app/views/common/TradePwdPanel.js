define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dojo/on',
    'dojo/query',
    'app/common/Fx',
    'dojo/dom-class',
    'app/ux/GenericWindow',
    'app/ux/GenericTextBox',
    'app/ux/GenericButton',
    'dojo/dom-style'
], function (declare, _WidgetBase, on, query, Fx,
             domClass, Win, TextBox, Button, domStyle) {
    return declare([_WidgetBase], {

        onConfirm: function() {},

        render: function () {
            var me = this;
            me.win = new Win({
                title: '请输入交易密码',
                width: 400
            });
            me.pwdFld = new TextBox({
                label: '交易密码',
                //promptMessage: '6-12位，英文(区分大小写),数字或常用符号',
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
                leftOffset: 80

            });
            me.confirmBtn = new Button({
                'label': '确定',
                enter: true,
                width: 200,
                height: 40,
                style: {
                    marginLeft: '80px',
                    marginTop: '20px'
                }
            });
            me.pwdFld.placeAt(me.win.msgNode);
            me.confirmBtn.placeAt(me.win.msgNode);
            me.win.placeAt(document.body);
        },

        show: function() {
            this.win.show();
        },

        addLinsteners: function() {
            var me = this;
            on(this.confirmBtn, 'click', function() {
                if (me.pwdFld.checkValidity()) {
                    me.onConfirm();
                }
            });
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addLinsteners();
        }
    });
});