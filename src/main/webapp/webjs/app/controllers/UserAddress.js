define([
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/views/operator/Confirm',
    'app/views/operator/ShowMsg',
    'dojo/when',
    'app/common/Data',
    'app/jquery/$',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax,
            Global, Helper, Confirm, ShowMsg, when, Data, J) {
    var saveHandler = {},
        confirm = new Confirm(), showMsg = new ShowMsg();
    function initView() {
        (function () {
            var url = Global.baseUrl + '/user/queryAddresses',
                config = {
                    "isDefault": ""
                };
            Ajax.get(url, config)
                .then(function(response){
                    if(response.success){
                        var data = response.data,
                            html = "";
                        if(data.length){
                            $(".cb-nav").show();
                            data.forEach(function(d){
                                html += '<div class="cb-list-item margin24 none-ua-address">' +
                                    '<ul code="'+d.code+'">' +
                                        '<li class="name">'+d.addressee+'</li>' +
                                        '<li class="address">'+d.province+'&nbsp;'+d.city+'&nbsp;'
                                            +d.district+'&nbsp;'+d.detailAddress+'</li>' +
                                        '<li class="telephone">'+d.mobile+'</li>' +
                                        '<li class="default">' + (+d.isDefault ? '<span color="rgb(30%,30%,30%)">(默认地址)</span>' : '<a>设为默认</a>')+'</li>' +
                                        '<li class="edit"><span class="edit-icon"></span>' +
                                            '<span class="delete-icon"><a></a></span>' +
                                        '</li>' +
                                    '</ul></div>';
                            });
                            $(".cont-body").find(".loading-icon").remove();
                            $(html).insertBefore($("#addressBox"));
                        }else{
                            $(".cont-body").find(".loading-icon").remove();
                            $("#addressBox").show();
                        }
                    }else{
                        query(".cont-body")[0].innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                    }
                });
        })();
        addListener();
    }

    function addListener() {
        var default_config = {
            "accept_name": "",
            "mobile": "",
            "isDefault": "0",
            "provinceCode": "",
            "cityCode": "",
            "districtCode": "",
            "street": ""
        };
        on(dom.byId("add_user_address"), "click", function(){
            saveHandler.remove && saveHandler.remove();
            saveHandler = on(dom.byId("uadSave"), "click", addAdd);
            showAddressBox(default_config);
        });
        on(dom.byId("uadCancel"), "click", hideAddressBox);
        on(dom.byId("default_sp"), "click", function () {
            dom.byId("defaultAddress").checked = !dom.byId("defaultAddress").checked;
        });
        saveHandler = on(dom.byId("uadSave"), "click", addAdd);
        on(dom.byId("accept_name"), "keyup", keyUpHandler);
        on(dom.byId("mobile"), "keyup", keyUpHandler);
        on(dom.byId("provinceCode"), "keyup", keyUpHandler);
        on(dom.byId("cityCode"), "keyup", keyUpHandler);
        on(dom.byId("districtCode"), "keyup", keyUpHandler);
        on(dom.byId("street"), "keyup", keyUpHandler);
        on(dom.byId("accept_name"), "change", changeHandler);
        on(dom.byId("mobile"), "change", changeHandler);
        on(dom.byId("provinceCode"), "change", changeHandler);
        on(dom.byId("cityCode"), "change", changeHandler);
        on(dom.byId("districtCode"), "change", changeHandler);
        on(dom.byId("street"), "change", changeHandler);
        $(".cont-body").on("click", "span.edit-icon", function (e) {
            e.stopPropagation();
            var $ul = $(this).parent().parent(),
                $lis = $ul.find("li"),
                address = $lis[1].innerText.split(/\s/),
                config = {
                    "accept_name": $lis[0].innerText,
                    "mobile": $lis[2].innerText,
                    "isDefault": !($($lis[3]).find("a").length),
                    "provinceCode": address[0],
                    "cityCode": address[1],
                    "districtCode": address[2],
                    "street": address[3],
                    "code": $ul.attr("code")
                };
            saveHandler.remove && saveHandler.remove();
            saveHandler = on(dom.byId("uadSave"), "click", editAdd);
            showAddressBox(config);
        });
        $(".cont-body").on("click", "span.delete-icon", function (e) {
            e.stopPropagation();
            var me = this;
            confirm.set("ok", function okFun () {
                var mm = this;
                mm.okBtn.innerHTML = "删除中...";
                mm.okHandler.remove && mm.okHandler.remove();
                Ajax.post(Global.baseUrl + '/user/delete/address', {"code": $(me).parent().parent().attr("code")})
                    .then(function (response) {
                        if(response.success){
                            showMsg.set("msg", '恭喜您，收货地址删除成功！');
                            $(me).parent().parent().parent().remove();
                            $("#user-content").css("height", "auto");
                            hideAddressBox();
                        }else{
                            showMsg.set("msg", '很遗憾，收货地址删除失败！');
                        }
                        mm.okBtn.innerHTML = "确认";
                        showMsg.show();
                        confirm.hide();
                    });
            });
            confirm.set("cancel", function(){
                confirm.hide();
            });
            confirm.set("msg", "确定删除地址吗?");
            confirm.show();
        });
        $("#user-content").on("click", "li.default a", function (e) {
            e.stopPropagation();
            var me = this;
            Ajax.post(Global.baseUrl + '/user/edit/setDefaultAddress', {"code": $(this).parent().parent().attr("code")})
                .then(function (response) {
                    if(response.success){
                        showMsg.set("msg", '恭喜您，默认收货地址设置成功！');
                        var originalDefault = $(".cb-list-item>ul>li.default>span");
                        if(originalDefault.length){
                            originalDefault.replaceWith('<a>设为默认</a>');
                        }
                        $(me).replaceWith('<span color="rgb(30%,30%,30%)">(默认地址)</span>');
                    }else{
                        showMsg.set("msg", '很遗憾，默认收货地址设置失败！');
                    }
                    showMsg.show();
                });
        });
    }
    function editAdd() {
        if(valide()){
            saveHandler.remove && saveHandler.remove();
            $("#uadSave").css("cursor", "default").text("修改中...");
            var config = {
                "addressee": dom.byId("accept_name").value,
                "mobile": dom.byId("mobile").value,
                "province": dom.byId("provinceCode").value,
                "city": dom.byId("cityCode").value,
                "district": dom.byId("districtCode").value,
                "detailAddress": dom.byId("street").value,
                "isDefault": (dom.byId("defaultAddress").checked ? "1" : "0"),
                "code": dom.byId("codeI").innerText
            };
            Ajax.post(Global.baseUrl + "/user/edit/address", config)
                .then(function (response) {
                    if(response.success){
                        var html = '<div class="cb-list-item margin24 none-ua-address">' +
                            '<ul code="'+config.code+'">' +
                            '<li class="name">'+config.addressee+'</li>' +
                            '<li class="address">'+config.province+'&nbsp;'+config.city+'&nbsp;'
                            +config.district+'&nbsp;'+config.detailAddress+'</li>' +
                            '<li class="telephone">'+config.mobile+'</li>' +
                            '<li class="default">' + (+config.isDefault ? '<span color="rgb(30%,30%,30%)">(默认地址)</span>' : '<a>设为默认</a>')+'</li>' +
                            '<li class="edit"><span class="edit-icon"></span>' +
                            '<span class="delete-icon"><a></a></span>' +
                            '</li>' +
                            '</ul></div>';
                        if(+config.isDefault){
                            var originalDefault = $(".cb-list-item>ul>li.default>span");
                            if(originalDefault.length){
                                originalDefault.replaceWith('<a>设为默认</a>');
                            }
                        }
                        $(".cb-list-item>ul[code="+config.code+"]").parent().replaceWith(html);
                        hideAddressBox();
                        showMsg.set("msg", '收货地址修改成功！');
                        showMsg.show();
                    }else{
                        saveHandler = on(dom.byId("uadSave"), "click", editAdd);
                        showMsg.set("msg", "收货地址修改失败！");
                        showMsg.show();
                    }
                    $("#uadSave").css("cursor", "pointer").text("保存新地址");
                });
        }
    }
    function addAdd() {
        if(valide()){
            saveHandler.remove && saveHandler.remove();
            $("#uadSave").css("cursor", "default").text("保存中...");
            var config = {
                "addressee": dom.byId("accept_name").value,
                "mobile": dom.byId("mobile").value,
                "province": dom.byId("provinceCode").value,
                "city": dom.byId("cityCode").value,
                "district": dom.byId("districtCode").value,
                "detailAddress": dom.byId("street").value,
                "isDefault": (dom.byId("defaultAddress").checked ? "1" : "0")
            };
            Ajax.post(Global.baseUrl + "/user/add/address", config)
                .then(function (response) {
                    if(response.success){
                        var html = '<div class="cb-list-item margin24 none-ua-address">' +
                            '<ul code="'+response.data.code+'">' +
                            '<li class="name">'+config.addressee+'</li>' +
                            '<li class="address">'+config.province+'&nbsp;'+config.city+'&nbsp;'
                            +config.district+'&nbsp;'+config.detailAddress+'</li>' +
                            '<li class="telephone">'+config.mobile+'</li>' +
                            '<li class="default">' + (+config.isDefault ? '<span color="rgb(30%,30%,30%)">(默认地址)</span>' : '<a>设为默认</a>')+'</li>' +
                            '<li class="edit"><span class="edit-icon"></span>' +
                            '<span class="delete-icon"><a></a></span>' +
                            '</li>' +
                            '</ul></div>';
                        if(+config.isDefault){
                            var originalDefault = $(".cb-list-item>ul>li.default>span");
                            if(originalDefault.length){
                                originalDefault.replaceWith('<a>设为默认</a>');
                            }
                        }
                        $(html).insertBefore($("#addressBox"));
                        hideAddressBox();
                        showMsg.set("msg", '收货地址添加成功！');
                        showMsg.show();
                    }else{
                        saveHandler = on(dom.byId("uadSave"), "click", addAdd);
                        showMsg.set("msg", "收货地址添加失败！");
                        showMsg.show();
                    }
                    $("#uadSave").css("cursor", "pointer").text("保存新地址");
                });
        }
    }
    function hideAddressBox() {
        var userCont = dom.byId("user-content"),
            height = domStyle.get(userCont, "height");
        domStyle.set(dom.byId('addressBox'), {
            "display": "none"
        });
        domStyle.set(userCont, {
            "height": "auto"
        });
        var finalHeight = domStyle.get(userCont, "height");
        domStyle.set(dom.byId('addressBox'), {
            "display": "block"
        });

        var k = (finalHeight - height) / 10;
        for(var i = 1; i <= 10; i++){
            (function (i) {
                setTimeout(function(){
                    i < 10 ? domStyle.set(userCont, {
                        "height": (height + k * i) + "px"
                    }) : ( domStyle.set(userCont, {
                        "height": finalHeight + "px"
                    }) && domStyle.set(dom.byId('addressBox'), {
                        "display": "none"
                    }) );
                }, i * 20);
            })(i);
        }
    }
    function scroll2BottomAndFocus() {
        $("body").scrollTop($(document).height());
        $("#accept_name").focus();
    }
    function showAddressBox(config) {
        var userCont = dom.byId("user-content"),
            height = domStyle.get(userCont, "height");
        domStyle.set(dom.byId('addressBox'), {
            "display": "block"
        });
        domStyle.set(userCont, {
            "height": "auto"
        });
        var finalHeight = domStyle.get(userCont, "height");
        domStyle.set(userCont, {
            "height": height+"px"
        });

        var k = (finalHeight - height) / 10;
        for(var i = 1; i <= 10; i++){
            (function (i) {
                setTimeout(function(){
                    i < 10 ? domStyle.set(userCont, {
                        "height": (height + k * i) + "px"
                    }) : (domStyle.set(userCont, {
                        "height": finalHeight + "px"
                    }) && scroll2BottomAndFocus());
                }, i * 20);
            })(i);
        }
        if(config){
            for(var n in config){
                if(n == "code") {
                    var $codeI = $("#addressBox").find("#codeI");
                    $codeI.length && $codeI.remove();
                    $("#addressBox").append("<i id='codeI' style='display:none;'>"+config[n]+"</i>")
                }else if(n != "isDefault") {
                    dom.byId(n).value = config[n];
                    if(config[n] != "") {
                        $("#" + n).prev().hide();
                    }else{
                        $("#" + n).prev().show()
                    }
                }else{
                    dom.byId("defaultAddress").checked = config[n];
                }
            }
        }
    }
    function keyUpHandler() {
        var $i = $(this).prev();
        this.value == "" ? $i.show() : $i.hide();
    }
    function changeHandler() {
        if(this.value != ""){
            $(this).next().fadeOut(300);
            var $next = $(this).next().next();
            $next.length && $next.fadeOut(300);
        }else{
            $(this).next().fadeIn(300);
        }
    }
    function valide(){
        var flag = true;
        if(dom.byId("accept_name").value == ""){
            $("#accept_name").next().fadeIn(300);
            flag = false;
        }else if (dom.byId("accept_name").value.length > 64){
            $("#accept_name").next().next().fadeIn(300).fadeOut(2000);
            flag = false;
        }
        if(dom.byId("mobile").value == ""){
            $("#mobile").next().fadeIn(300);
            flag = false;
        }else if(!/^1[3,4,5,7,8]\d{9}$/.test(dom.byId("mobile").value)){
            $("#mobile").next().next().fadeIn(300);
            flag = false;
        }
        if(dom.byId("provinceCode").value == ""){
            $("#provinceCode").next().fadeIn(300);
            flag = false;
        }else if (dom.byId("provinceCode").value.length > 20){
            $("#provinceCode").next().next().fadeIn(300).fadeOut(2000);
            flag = false;
        }
        if(dom.byId("cityCode").value == ""){
            $("#cityCode").next().fadeIn(300);
            flag = false;
        }else if (dom.byId("cityCode").value.length > 20){
            $("#cityCode").next().next().fadeIn(300).fadeOut(2000);
            flag = false;
        }
        if(dom.byId("districtCode").value == ""){
            $("#districtCode").next().fadeIn(300);
            flag = false;
        }else if (dom.byId("districtCode").value.length > 20){
            $("#districtCode").next().next().fadeIn(300).fadeOut(2000);
            flag = false;
        }
        if(dom.byId("street").value == ""){
            $("#street").next().fadeIn(300);
            flag = false;
        }else if (dom.byId("street").value.length > 128){
            $("#street").next().next().fadeIn(300).fadeOut(2000);
            flag = false;
        }
        return flag;
    }
    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});