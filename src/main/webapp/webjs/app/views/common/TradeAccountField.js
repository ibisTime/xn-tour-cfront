define("app/views/common/TradeAccountField", [
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'app/views/ViewMixin',
    'dojo/on',
    'dojo/query',
    'app/common/Fx',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/when',
    'app/common/Data',
    'app/ux/GenericTooltip',
    'dojo/mouse',
    'app/common/Array',
    'app/common/Global',
    'dojo/topic',
    'dojo/text!./templates/TradeAccountField.html'
], function(declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query, Fx, dom,
            domConstruct, domClass, domStyle, when, Data, Tooltip, mouse, ArrayUtil, Global,Topic, template){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {
        templateString: template,

        items: '',
        activeItem: '',

        _setItemsAttr: function(items) {
            items = items || [];
            this._set('items', items);
            var html = '', i = 0, len = items.length;
            for (; i<len; i++) {
                var item = items[i];
                html += '<li><span class="li-inner"><em class="mt-num-xl">'+item.operatorNo+'</em>  '+item.prodName+'</span></li>';
            }
            domConstruct.place(domConstruct.toDom(html), this.itemCtn);
        },

        select: function(index) {
            var items = query('li', this.itemCtn);
            items.removeClass('active');
            items.at(index).addClass('active');
            this.activeItem = this.items[index];
            Topic.publish("/topic/accountSelectChange",{ item: this.activeItem} );
        },

        render: function() {
            var me = this;
            when(Data.getTradeAccounts()).then(function(items) {
                items = ArrayUtil.filter(items, function(i) {
                    return i.contractNo && i.prodTypeId!=0 && i.prodTypeId!=3;//过滤掉实盘大赛和免费体验产品
                });
                me.set('items', items);
                me.select(0);
            });
            on(me.itemCtn, 'li:click', function(e) {
                var items = query('li', me.itemCtn),
                    index = items.indexOf(this);
                me.select(index);
            });

            on(me.itemCtn, on.selector('li', mouse.enter), function(e) {
                var items = query('li', me.itemCtn),
                    index = items.indexOf(this),
                    item = me.items[index],
                    that = this;
                when(Data.getTradeAccountAsset({
                    homs_fund_account: item.homsFundAccount,
                    homs_combine_id: item.homsCombineId
                })).then(function(asset) {
                    if (asset) {
                        var html = '<div>总资产：'+Global.formatAmount(asset.totalAsset, 2)+'元</div>' +
                            '<div>股票市值：'+Global.formatAmount(asset.totalMarketValue, 2)+'元</div>' +
                            '<div>参考盈亏：'+Global.formatAmount(asset.totalProfit, 2)+'元</div>' +
                            '<div>可用余额：'+Global.formatAmount(asset.curAmount, 2)+'元</div>' +
                            '<div>期初资产：'+Global.formatAmount(asset.beginAmount, 2)+'元</div>';
                        if(item.prodTypeId=='0'){//如果是免费体验,没有预警比例和止损比例
                    		html+='<div>借款金额：'+Global.formatAmount(asset.loanAmount, 2)+'元</div>' +
                            '<div>资金余额：'+Global.formatAmount(asset.currentCash, 2)+'元</div>';
                    	}else{
                            html+='<div>警告线：'+Global.formatAmount(asset.loanAmount * asset.enableRatio, 2)+'元</div>' +
                            '<div>平仓线：'+Global.formatAmount(asset.loanAmount * asset.exposureRatio, 2)+'元</div>' +
                            '<div>借款金额：'+Global.formatAmount(asset.loanAmount, 2)+'元</div>' +
                            '<div>资金余额：'+Global.formatAmount(asset.currentCash, 2)+'元</div>';
                    	}
                        Tooltip.show(html, that);
                    }
                });

            });
            on(me.itemCtn, on.selector('li', mouse.leave), function(e) {
                Tooltip.hide();
            });
        },

        buildRendering: function() {
            var me = this;
            me.inherited(arguments);
            me.render();
        }
    });
});