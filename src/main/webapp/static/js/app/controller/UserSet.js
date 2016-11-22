define([
    'app/controller/base'
], function(base) {
    init();

    function init() {
        if (!base.isLogin()) {
            location.href = "./login.html?return=" + base.makeReturnUrl();
        } else {
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