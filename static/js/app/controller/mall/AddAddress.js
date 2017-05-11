define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/validate/validate',
    'app/module/loading/loading'
], function (base, Ajax, Validate, loading) {
    var code = base.getUrlParam("c"),
        type = base.getUrlParam("t") || 0;
    init();

    function init() {
        if (!base.isLogin()) {
            base.goLogin();
            return;
        } else {
            if (code) {
                getAddress();
                $("#sbtn").val("保存修改");
                base.setTitle("修改地址");
            } else {
                addListeners();
            }
        }
    }

    function getAddress() {
        loading.createLoading();
        Ajax.get("805166", {code: code})
            .then(function (res) {
                loading.hideLoading();
                if (res.success) {
                    var data = res.data;
                    $("#addressee").val(data.addressee);
                    $("#mobile").val(data.mobile);
                    $("#province").val(data.province + " " + data.city + " " + data.district);
                    // $("#cityCode").val(data.city);
                    // $("#districtCode").val(data.district);
                    $("#detailAddress").val(data.detailAddress);
                    addListeners();
                } else {
                    base.showMsg(res.msg);
                }
            }, function () {
                loading.hideLoading();
                base.showMsg("暂时无法获取地址信息");
            });
    }

    function addListeners() {
        $("#province").cityPicker({
            title: "选择省市县"
        });
        $("#addrWrap").on("click", function(){
            $("#mobile").blur();
        })
        $("#addForm").validate({
            'rules': {
                addressee: {
                    required: true,
                    maxlength: 20,
                    isNotFace: true
                },
                mobile: {
                    required: true,
                    mobile: true,
                    maxlength: 11
                },
                province: {
                    required: true,
                    maxlength: 30,
                    isNotFace: true
                },
                detailAddress: {
                    required: true,
                    maxlength: 128,
                    isNotFace: true
                }
            },
            onkeyup: false
        });
        var form = $("#addForm");
        $("#sbtn").on("click", function () {
            if (form.valid()) {
                config = form.serializeObject();
                config.isDefault = "1";
                config.userId = base.getUserId();
                var addr = config.province.split(/\s/);
                config.province = addr[0];
                config.city = addr[1];
                config.district = addr[2];
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
        loading.createLoading("设置中...");
        Ajax.post("805160", {json: config})
            .then(function (response) {
                loading.hideLoading();
                if (response.success) {
                    if(type == 0){
                        base.goBackUrl("./address-list.html?t=1");
                    }else{
                        history.back();
                    }
                } else {
                    base.showMsg(response.msg);
                }
            }, function () {
                loading.hideLoading();
                base.showMsg("收货地址添加失败！");
            });
    }

    function editNewAddr(config) {
        loading.createLoading("设置中...");
        Ajax.post("805162", {json: config})
            .then(function (response) {
                loading.hideLoading();
                if (response.success) {
                    if(type == 0){
                        base.goBackUrl("./address-list.html?t=1");
                    }else{
                        history.back();
                    }
                } else {
                    base.showMsg(response.msg);
                }
            }, function () {
                loading.hideLoading();
                base.showMsg("收货地址修改失败！");
            });
    }
});
