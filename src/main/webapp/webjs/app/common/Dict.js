define('app/common/Dict', [
    'app/common/Ajax',
    'app/common/Global'
], function(Ajax, Global) {
    var dict = {
        receiptType: {
            "1": "个人",
            "2": "企业"
        },
        orderStatus: {
            "1": "待支付",
            "2": "已支付",
            "3": "已发货",
            "4": "已收货",
            "5": "已完成"
        },
        wxdStatus: {
            "1": "待处理",
            "2": "已受理",
            "3": "已关闭"
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
        companyCode: {
            "1": "宁波品味时光食品贸易有限公司"
        },
        /*companyStatus: {
            0: '信息提供不全',
            1: '等待KYC审核',
            2: '已通过',
            3: '未通过'
        },
        pwdStrength: {
            1: '弱',
            2: '中',
            3: '强'
        },
        busKey: {
            '1': '进项交易金额',
            '2': '存款利率',
            '3': '存款利息',
            '4': '掉期点差',
            '5': '掉期收益',
            '6': '贴息收入',
            '7': '即期收益',
            '8': '远期收益',
            '9': '总收益',
            '10': '出项交易金额',
            '11': '贴现利率',
            '12': '贴现利息',
            '13': 'LC开证手续费',
            '14': 'LC承兑费',
            '15': 'DP交单费',
            '16': '手续费',
            '17': '货损',
            '18': '总成本',
            '19': '毛利',
            '20': '水利基金',
            '21': '印花税',
            '22': '增值税',
            '23': '其他税负',
            '24': '即期利润',
            '25': '远期利润',
            '26': '净利'
        },*/
        currencyUnit: {
            '': '',
            'USB': '$',
            'CNY': '￥',
            'XB': 'S$',
            'SGD': 'S$'
        }
    };
	return {
        get: function(code) {
            return dict[code];
        },

        getKindID: function(code, callback) {
            Ajax.get(Global.baseUrl + '/gene/dict', {
                type: 'id_kind'
            }).then(function(res) {
                callback(Global.findObj(res.data, 'dkey', code)['dvalue']);
            });
        }
	}
});