define([
    'app/controller/base',
    'app/util/ajax'
], function(base, ajax) {
    var dict = {
        receiptType: {
            "1": "个人",
            "2": "公司"
        },
        fundType: {
            '10': '虚拟币兑换',
            '11': '充值',
            '-11': '取现',
            '12': '线下打款',
            '-12': '认购',
            '13': '解冻',
            '-13': '冻结',
            '14': '线上收款',
            '-14': '线下结算',
            '19': '蓝补',
            '-19': '红冲'
        },
        fastMail: {
            "EMS": "邮政EMS",
            "STO": "申通快递",
            "ZTO": "中通快递",
            "YTO": "圆通快递",
            "HTKY": "汇通快递",
            "ZJS": "宅急送",
            "SF": "顺丰快递",
            "TTKD": "天天快递"
        },
        fundType: {
            "11": "充值",
            "-11": "取现",
            "12": "转入",
            "-12": "转出",
            "19": "蓝补",
            "-19": "红冲",
            "-110": "取现冻结",
            "-111": "取现解冻"
        },
        orderStatus: {
            "1": "待支付",
            "2": "待发货",
            "3": "待收货",
            "4": "已收货",
            "91": "用户取消",
            "92": "商户取消",
            "93": "快递异常"
        },
        currencyUnit: {
            '': '',
            'USB': '$',
            'CNY': '￥',
            'XB': 'S$',
            'SGD': 'S$'
        }
    };

    var changeToObj = function(data) {
        var data = data || [],
            obj = {};
        data.forEach(function(item) {
            obj[item.dkey] = item.dvalue;
        });
        return obj;
    };

    return {
        get: function(code) {
            return dict[code];
        }
    }
});