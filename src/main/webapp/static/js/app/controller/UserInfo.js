define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    init();

    function init() {
        if (!base.isLogin()) {
            location.href = "./login.html?return=" + base.makeReturnUrl();
        } else {
            getUserInfo();
            getTimeAndMobile();
        }
    }

    function getUserInfo() {
        Ajax.get(APIURL + '/user', {})
            .then(function(response) {
                $("#loadI").hide();
                if (response.success) {
                    var data = response.data;
                    $("#mobile").text(data.mobile);
                    sessionStorage.setItem("m", data.mobile);
                } else {
                    base.showMsg("暂时无法获取用户信息！");
                }
            });
    }

    function getTimeAndMobile() {
        Ajax.get(APIURL + "/gene/sys/config", { start: 1, limit: 10 })
            .then(function(res) {
                if (res.success && res.data.list) {
                    $.each(res.data.list, function(i, l) {
                        if (l.ckey == "sysMobile") {
                            $("#fwMobile").text(l.cvalue);
                        } else if (l.ckey == "serviceTime") {
                            $("#fwTime").text(l.cvalue);
                        }
                    });
                }
            })
    }
});