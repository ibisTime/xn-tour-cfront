define([
    'app/controller/base'
], function(base) {
    init();

    function init() {
        if (!base.isLogin()) {
            location.href = "./login.html?return=" + base.makeReturnUrl();
        } else {
            if (base.isWxLogin()) {
                var mobile = "";
                if (mobile = localStorage.getItem("m")) {
                    $("#xgsjh").removeClass("hidden");
                } else {
                    $("#bdsjh").removeClass("hidden");
                }
            } else {
                $("#dlmm, #xgsjh").removeClass("hidden");
            }
            addListeners();
        }
    }

    function addListeners() {
        $("#loginOut").on("click", function() {
            $("#loaddingIcon").removeClass("hidden");
            base.logout()
                .then(function(res) {
                    $("#loaddingIcon").addClass("hidden");
                    location.href = '../home/index.html';
                }, function(res) {
                    $("#loaddingIcon").addClass("hidden");
                    location.href = '../home/index.html';
                });
        });
    }
});