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
    'app/common/Date',
    'app/ux/GenericButton',
    'app/ux/GenericTextBox',
    'dojo/text!./templates/ItemPanel2.html'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin, on, query,
             domClass, domStyle, Global, DateUtil, Button, TextBox, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin], {

        templateString: template,

        item: '',

        _setItemAttr: function(value) {
            var me = this;
            if (value.t == 'A' || value.t == 'E') {
                domClass.add(this.iconNode, 'detailTitlefirst');
                if (value.quote == 'A' || value.quote == 'B' || value.quote == 'C') {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-2.png';
                } else {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-1.png';
                }
            } else if (value.t == '1') {
                domClass.add(this.iconNode, 'detailTitlefour');
                if (value.serve == '1') {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-4.png';
                } else if (value.serve == '2') {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-3.png';
                }
            } else if (value.type == '2') {
                domClass.add(this.iconNode, 'detailTitlefour');
                if (value.serve == '1') {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-4.png';
                } else if (value.serve == '2') {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-3.png';
                }
            }
            if (value.quote == 'A' || value.quote == 'B') {
                this.quote2Ctn.style.display = 'none';
                this.quote1Node.innerHTML = Global.formatNumber(value.quoteValue1 * 100, 2);
            } else if (value.quote == 'C') {
                this.quote1Ctn.style.display = 'none';
                this.splitNode.style.display = 'none';
                this.quote2Node.innerHTML = Global.formatNumber(value.quoteValue1 * 10, 1);
            } else {
                this.quote1Node.innerHTML = Global.formatNumber(value.quoteValue1 * 100, 2);
                this.quote2Node.innerHTML = Global.formatNumber(value.quoteValue2 * 10, 1);
            }
            this.periodNode.innerHTML = value.period + '<span class="ui-unit">小时</span>';
            this.minInvestAmountNode.innerHTML = Global.formatAmount(value.minInvestAmount, undefined, 'w');
            this.amountNode.innerHTML = Global.formatAmount(value.amount, undefined, 'w');
            this.amountLeftNode.innerHTML = Global.formatAmount(value.amount - value.loanedAmount, undefined, 'w');
            this.percentLineNode.style.width = (value.loanedAmount / value.amount *100) + '%';
            this.percentNode.innerHTML = Global.formatNumber(value.loanedAmount / value.amount *100, 2) + '%';
            this.mjendDatetimeNode.innerHTML = DateUtil.format(new Date(value.mjendDatetime), 'yyyy-MM-dd HH:mm');
            this.amountFld = new TextBox({
                validates: [{
                    pattern: /.+/,
                    message: '请输入金额'
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
                unit: '元',
                limitRegex: /[\d\.]/,
                isAmount: true,
                isNumber: true,
                inputWidth: 250,
                style: {
                    'marginBottom': '20px'
                }

            });
            this.amountFld.placeAt(this.inputNode);
        },

        render: function () {
            var me = this;
        },

        addListeners: function() {
            var me = this;

        },

        isValid: function() {
            return this.amountFld.checkValidity();
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});