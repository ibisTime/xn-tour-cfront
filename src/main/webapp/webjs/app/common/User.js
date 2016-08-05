define("app/common/User", [
    'app/common/Global',
    'app/common/Array',
    'app/common/Data',
    'dojo/_base/config',
    'dojo/when'
], function(Global, arrayUtil, Data, cfg, when) {
	return {

        isTrust: function(successCallback, errorCallback) { // 实名认证
            when(Data.getUser(), function(user) {
                if (user && user.isTrust == '1') {
                    successCallback && successCallback(user);
                } else {
                    var msg = '';
                    if (user && user.isTrust == '0') {
                        var directUrl = location.pathname + location.search;

                        msg = '请您先完成<a target="_blank" href="'+Global.baseUrl+'/user/'+(cfg.authentication ? 'uploadID.htm?directUrl=' + directUrl : 'certification.htm')+'">实名认证</a>';
                    } else if (user && user.isTrust == '2') {
                        msg = '认证失败，请重新<a target="_blank" href="'+Global.baseUrl+'/user/'+(cfg.authentication ? 'uploadID.htm' : 'certification.htm')+'">实名认证</a>';
                    } else if (user && user.isTrust == '3') {
                        msg = '实名认证正在审核中，请耐心等待';
                    }
                    errorCallback && errorCallback(msg, user);
                }
            });
        },

        getBindBankcard: function(successCallback) { // 获得一张绑定银行卡
            var bankcard;
            when(Data.getBankcards(), function(bankcards) {
                var i = 0, len = bankcards.length;
                for (; i < len; i++) {
                    if (bankcards[i].bankCardStatus == '1') {
                        bankcard = bankcards[i];
                        break;
                    }
                }
                successCallback(bankcard);
            });
        },

        isTradePwd: function(successCallback, errorCallback) {
            when(Data.getTradePwd(), function(data) {
                if (data && data.userTradePwdStrength) {
                    successCallback && successCallback();
                } else {
                    var directUrl = location.pathname + location.search;

                	var msg='您还未设置交易密码，请先<a href="'+Global.baseUrl+'/account/tradepwd/set.htm?directUrl='+directUrl+'">设置</a>';
                    errorCallback && errorCallback(msg);
                }
            });
        }

	}
});