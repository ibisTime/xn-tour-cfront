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
    'dijit/registry',
    'dojo/text!./templates/ItemPanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin, on, query,
             domClass, domStyle, Global, DateUtil, Button, registry, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin], {

        templateString: template,

        item: '',

        _setItemAttr: function(value) {
            if (value.t == 'A' || value.t == 'B') {
                domClass.add(this.iconNode, 'modeTitleMmg');
                if (value.quote == 'A' || value.quote == 'B' || value.quote == 'C') {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-2.png';
                } else {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-1.png';
                }
                this.linkNode.href = this.baseUrl + "/project/cash_manage_d.htm?c=" + value.code;
            } else if (value.t == '1') {
                domClass.add(this.iconNode, 'modeTitleEqd');
                if (value.serve == '1') {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-4.png';
                } else if (value.serve == '2') {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-3.png';
                }
                this.linkNode.href = this.baseUrl + "/project/uniform_service_d.htm?c=" + value.code;
            } else if (value.t == '2') {
                domClass.add(this.iconNode, 'modeTitleEqd');
                if (value.serve == '1') {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-4.png';
                } else if (value.serve == '2') {
                    this.quoteImgNode.src = this.staticUrl + '/images/services/state-3.png';
                }
                this.linkNode.href = this.baseUrl + "/project/priority_bad_d.htm?c=" + value.code;
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
            this.periodNode.innerHTML = value.period + '小时';
            this.minInvestAmountNode.innerHTML = Global.formatAmount(value.minInvestAmount, undefined, 'w');
            this.amountNode.innerHTML = Global.formatAmount(value.amount, undefined, 'w');
            this.amountLeftNode.innerHTML = Global.formatAmount(value.amount - value.loanedAmount, undefined, 'w');
            this.percentLineNode.style.width = (value.loanedAmount / value.amount *100) + '%';
            this.percentNode.innerHTML = Global.formatNumber(value.loanedAmount / value.amount *100, 2) + '%';
            this.mjendDatetimeNode.innerHTML = DateUtil.format(new Date(value.mjendDatetime), 'yyyy-MM-dd HH:mm');

            if (+Global.formatAmount(value.amount - value.loanedAmount, undefined, 'w') == 0) {
                this.linkNode.setDisabled(true);
                this.linkNode.setLabel('已满');
            }
        },

        render: function () {
            var me = this;
        },

        addListeners: function() {
            var me = this;

        },

        isValid: function() {
            return true;
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});