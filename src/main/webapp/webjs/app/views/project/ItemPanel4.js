define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'app/views/ViewMixin',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'app/common/Global',
    'app/ux/GenericTextBox',
    'app/ux/GenericButton',
    'dojo/text!./templates/ItemPanel4.html'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin, on, query,
             domClass, domStyle, Global, TextBox, Button, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin], {

        templateString: template,

        item: '',

        _setItemAttr: function(value) {
            var me = this;
            if (value.quote == 'A') {
                me.feeNode.innerHTML = '年化(自然日): '+Global.formatNumber((value.quoteValue1)*100, 2)+'%';
            } else if (value.quote == 'B') {
                me.feeNode.innerHTML = '年化(工作日): '+Global.formatNumber((value.quoteValue1)*100, 2)+'%';
            } else if (value.quote == 'C') {
                me.feeNode.innerHTML = '分成: '+Global.formatNumber((value.quoteValue1)*10, 1)+'成';
            } else {
                me.feeNode.innerHTML = '保本年化: '+Global.formatNumber((value.quoteValue1)*100, 2)+'%;  分成: '+Global.formatNumber((value.quoteValue2)*10, 1)+'成';
            }
            if (value.t == 'C') {
                this.f1Fld = new TextBox({
                    validates: [{
                        pattern: /.+/,
                        message: '请输入负债率'
                    }],
                    limitRegex: /[\d\.]/,
                    //isAmount: true,
                    isNumber: true,
                    inputWidth: 250,
                    leftOffset: 170,
                    unit: '%',
                    style: {
                        'marginBottom': '20px'
                    }

                });
                this.f1Fld.placeAt(this.f1);
                this.fc1.style.display = 'block';
                this.f2Fld = new TextBox({
                    validates: [{
                        pattern: /.+/,
                        message: '请输入销售收入'
                    }],
                    limitRegex: /[\d\.]/,
                    isAmount: true,
                    isNumber: true,
                    inputWidth: 250,
                    leftOffset: 170,
                    style: {
                        'marginBottom': '20px'
                    }

                });
                this.f2Fld.placeAt(this.f2);
                this.fc2.style.display = 'block';
            } else if (value.t == 'B') {
                this.f3Fld = new TextBox({
                    validates: [{
                        pattern: /.+/,
                        message: '请输入认购金额'
                    }, {
                        pattern: function() {
                            return this.getAmount() > 0;
                        },
                        message: '最小金额必须大于0'
                    }, {
                        pattern: function() {
                            return (this.getAmount() >= me.item.minInvestAmount && this.getAmount() <= Math.min(me.item.maxInvestAmount, me.item.amount - me.item.loanedAmount)) ||
                                ((me.item.amount - me.item.loanedAmount) <= me.item.minInvestAmount);
                        },
                        message: '最小金额为' + Global.formatAmount(me.item.minInvestAmount, 0) + ', 最大金额为' + Global.formatAmount(Math.min(me.item.maxInvestAmount, me.item.amount - me.item.loanedAmount), 0)
                    }],
                    limitRegex: /[\d\.]/,
                    isAmount: true,
                    isNumber: true,
                    inputWidth: 250,
                    leftOffset: 170,
                    style: {
                        'marginBottom': '20px'
                    }

                });
                this.f3Fld.placeAt(this.f3);
                this.fc3.style.display = 'block';
            } else if (value.t == 'D') {
                this.f4Fld = new TextBox({
                    validates: [{
                        pattern: /.+/,
                        message: '请输入股票代码'
                    }],
                    limitRegex: /[\d\.]/,
                    isNumber: true,
                    inputWidth: 250,
                    leftOffset: 170,
                    style: {
                        'marginBottom': '20px'
                    }

                });
                this.f4Fld.placeAt(this.f4);
                this.fc4.style.display = 'block';
            }

            this.confirmBtn = new Button({
                label: '意向认购',
                height: 50,
                width: 240,
                textStyle: {'fontSize': '20px'}
            });
            this.confirmBtn.placeAt(this.f0);
        },

        render: function () {
            var me = this;
        },

        addListeners: function() {
            var me = this;

        },

        isValid: function() {
            return (this.f1Fld && this.f1Fld.checkValidity() || !this.f1Fld) &&
                (this.f2Fld && this.f2Fld.checkValidity() || !this.f2Fld) &&
                (this.f3Fld && this.f3Fld.checkValidity() || !this.f3Fld) &&
                (this.f4Fld && this.f4Fld.checkValidity() || !this.f4Fld);
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});