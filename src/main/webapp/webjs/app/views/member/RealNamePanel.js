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
    'app/common/Date',
    'dojo/text!./templates/RealNamePanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, Global, TextBox, Button, DateUtil, template) {
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
                }, {
                    //not empty
                    pattern: /^[\u4e00-\u9fa5]+$/,
                    message: '真实姓名只能是汉字'
                }],
                limitRegex: /\S/
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

            me.usernameFld.placeAt(me.i1);
            me.IDNoFld.placeAt(me.i2);
            me.confirmBtn.placeAt(me.i3);
        },

        addListeners: function() {
            var me = this;
        },

        isValid: function() {
            return this.usernameFld.checkValidity() && this.IDNoFld.checkValidity();
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});