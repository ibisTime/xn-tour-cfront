define([
    'app/controller/base'
], function(base) {
    init();

    function init() {
        if (base.isLogin()) {
            base.getUser()
                .then(function(res) {
                    $("#loaddingIcon").remove();
                    if (res.success) {
                        $("#amount").text((+res.data.amount / 1000).toFixed(2));
                    } else {
                        base.showMsg("会员卡信息获取失败");
                    }
                }, function() {
                    base.showMsg("会员卡信息获取失败");
                });
        } else {
            location.href = "../user/login.html?return=" + base.makeReturnUrl();
        }
    }
});