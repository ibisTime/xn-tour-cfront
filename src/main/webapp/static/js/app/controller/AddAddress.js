define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function(base, Ajax, Handlebars) {
    $(function() {
        var code = base.getUrlParam("c");
        init();

        function init() {
            if (!base.isLogin()) {
                location.href = "../user/login.html?return=" + base.makeReturnUrl();
            } else {
                if (code) {
                    getAddress();
                    $("#sbtn").text("保存修改");
                    document.title = "修改地址";
                } else {
                    $("#loaddingIcon").addClass("hidden");
                    addListeners();
                }
            }
        }

        function getAddress() {
            Ajax.get(APIURL + "/user/queryAddress", { code: code })
                .then(function(res) {
                    $("#loaddingIcon").addClass("hidden");
                    if (res.success) {
                        var data = res.data;
                        $("#accept_name").val(data.addressee);
                        $("#mobile").val(data.mobile);
                        $("#provinceCode").val(data.province);
                        $("#cityCode").val(data.city);
                        $("#districtCode").val(data.district);
                        $("#street").val(data.detailAddress);
                        addListeners();
                    } else {
                        base.showMsg("暂时无法获取地址信息");
                    }
                }, function() {
                    $("#loaddingIcon").addClass("hidden");
                    base.showMsg("暂时无法获取地址信息");
                });
        }

        function addListeners() {
            $("#accept_name").on("change", checkAName);
            $("#mobile").on("change", checkMobile);
            $("#provinceCode").on("change", checkPCode);
            $("#cityCode").on("change", checkCCode);
            $("#districtCode").on("change", checkDCode);
            $("#street").on("change", checkStreet);
            $("#sbtn").on("click", function() {
                if (valide()) {
                    var config = {
                        "addressee": $("#accept_name").val(),
                        "mobile": $("#mobile").val(),
                        "province": $("#provinceCode").val(),
                        "city": $("#cityCode").val(),
                        "district": $("#districtCode").val(),
                        "detailAddress": $("#street").val(),
                        "isDefault": "1"
                    };
                    if (code) {
                        config.code = code;
                        editNewAddr(config)
                    } else {
                        addNewAddr(config);
                    }
                }
            });
        }

        function addNewAddr(config) {
            $("#loaddingIcon").removeClass("hidden");
            Ajax.post(APIURL + "/user/add/address", config)
                .then(function(response) {
                    $("#loaddingIcon").addClass("hidden");
                    if (response.success) {
                        base.goBackUrl("./address_list.html?t=1");
                    } else {
                        base.showMsg(response.msg);
                    }
                }, function() {
                    $("#loaddingIcon").addClass("hidden");
                    base.showMsg("收货地址添加失败！");
                });
        }

        function editNewAddr(config) {
            $("#loaddingIcon").removeClass("hidden");
            Ajax.post(APIURL + "/user/edit/address", config)
                .then(function(response) {
                    $("#loaddingIcon").addClass("hidden");
                    if (response.success) {
                        base.goBackUrl("./address_list.html?t=1");
                    } else {
                        base.showMsg(response.msg);
                    }
                }, function() {
                    $("#loaddingIcon").addClass("hidden");
                    base.showMsg("收货地址修改失败！");
                });
        }

        function checkAName() {
            var value = $("#accept_name").val();
            if (!value || value.trim() == "") {
                base.showMsg("姓名不能为空");
                return false;
            } else if (value.length > 20) {
                base.showMsg("姓名长度不能超过20位");
                return false;
            }
            return true;
        }

        function checkMobile() {
            var value = $("#mobile").val();
            if (!value || value.trim() == "") {
                base.showMsg("手机号不能为空");
                return false;
            } else if (!/^1[3,4,5,7,8]\d{9}$/.test(value)) {
                base.showMsg("手机号格式错误");
                return false;
            }
            return true;
        }

        function checkPCode() {
            var value = $("#provinceCode").val();
            if (!value || value.trim() == "") {
                base.showMsg("省份不能为空");
                return false;
            } else if (value.length > 20) {
                base.showMsg("省份长度不能超过20位");
                return false;
            }
            return true;
        }

        function checkCCode() {
            var value = $("#cityCode").val();
            if (!value || value.trim() == "") {
                base.showMsg("城市不能为空");
                return false;
            } else if ($("#cityCode").val().length > 20) {
                base.showMsg("城市长度不能超过20位");
                return false;
            }
            return true;
        }

        function checkDCode() {
            var value = $("#districtCode").val();
            if (!value || value.trim() == "") {
                base.showMsg("区/县不能为空");
                return false;
            } else if ($("#districtCode").val().length > 20) {
                base.showMsg("区/县长度不能超过20位");
                return false;
            }
            return true;
        }

        function checkStreet() {
            var value = $("#street").val();
            if (!value || value.trim() == "") {
                base.showMsg("街道地址不能为空");
                return false;
            } else if ($("#street").val().length > 128) {
                base.showMsg("街道地址长度不能超过128位");
                return false;
            }
            return true;
        }

        function valide() {
            if (checkAName() && checkMobile() && checkPCode() &&
                checkCCode() && checkDCode() && checkStreet()) {
                return true;
            }
            return false;
        }
    });
});