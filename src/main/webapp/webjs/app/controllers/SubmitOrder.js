define('app/controllers/SubmitOrder', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/views/operator/SubmitConfirm',
    'app/views/common/AddAddressPanel',
    'app/ux/GenericTooltip',
    'app/common/Dict',
    'app/views/operator/ShowMsg',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, Global,
            Helper, SubmitConfirm, AddAddressPanel, Tooltip, Dict, ShowMsg) {
    var submitConfirm = new SubmitConfirm(),
        addAddressPanel = new AddAddressPanel(),
        showMsg = new ShowMsg(),
        receiptType = Dict.get("receiptType"),
        code = Global.getUrlParam("code") || "",
        type = Global.getUrlParam("type") || "1",
        q = Global.getUrlParam("q") || "1",
        start = Global.getUrlParam("s") || "0",
        limit = Global.getUrlParam("l") || "6";

    function initView() {
        (function () {
            var url = Global.baseUrl + '/user/queryAddresses',
                config = {
                    "isDefault": ""
                };
            Ajax.get(url, config)
                .then(function (response) {
                    if(response.success){
                        var data = response.data,
                            html1 = "", len = data.length;;
                        if(len){
                            data.forEach(function (d) {
                                var st = len == 1 ? " on" : (d.isDefault == "1" ? " on" : "");
                                html1 += '<li style="padding: 0" code="'+d.code+'" class="pad24 so-address-li'+st+'">'+
                                            '<i></i>' +
                                            '<ul class="li-block">' +
                                                '<li class="pd-btm10"><span class="so-name">'+d.addressee+'</span>'+(d.isDefault == "1" ? "<span class=\"pd-l5\">(默认地址)</span>" : "")+'</li>' +
                                                '<li class="pd-btm10 so-mobile">'+d.mobile+'</li>' +
                                                '<li style="word-wrap: break-word;" class="so-address">'+d.province+'&nbsp;'+d.city+'&nbsp;'+d.district
                                                    +'<br>'+d.detailAddress+'</li>' +
                                            '</ul>' +
                                        '</li>';
                            });
                        }
                        var html2 = '<li style="padding: 0" class="pad24 new-address" id="newAddress">' +
                                        '<span class="block-sp"></span>' +
                                        '<p>使用新地址</p>' +
                                    '</li>';
                        if(data.length > 2){
                            html2 += "<span style='position: absolute;right: 19px;bottom: 15px;color: #83A7FF;cursor: pointer;'" +
                                " class='so_up' id='up_down'>展开</span>"
                        }
                        $("#orderAddressUl").html(html1 + html2);
                    }else{
                        $(".user-info-body .user-content:eq(0) .cont-body")[0].innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                    }
                });
        })();
        if(type == 1){
            getModel();
        }else if(type == 2){
            code = code.split(/_/);
            getModel1();
        }
        (function () {
            var html = '<option value="0">无</option>';
            for(var rec in receiptType){
                html += '<option value="'+rec+'">'+receiptType[rec]+'</option>';
            }
            dom.byId("receipt").innerHTML = html;
        })();
        addListeners();
    }

    function getModel1() {
        var url = Global.baseUrl + '/operators/queryPageCart',
            config = {
                "start": start,
                "limit": limit
            };
        Ajax.post(url, config)
            .then(function(response) {
                if (response.success) {
                    var data = response.data.list,
                        html = "",
                        totalCount = 0;
                    if(data.length){
                        for(var i = 0, len = code.length; i < len; i++){
                            var d = data[code[i]];
                            var eachCount = (+d.salePrice) * (+d.quantity) / 1000;
                            totalCount += (eachCount * 1000);
                            html += '<li class="pad24" modelCode="'+d.code+'">' +
                                '<div class="d-order-img"><a target="_blank" href="'+Global.baseUrl+'/detail/mall_detail.htm?code='+d.productCode+'"><img src="'+d.pic1+'"/></a></div>' +
                                '<div class="d-order-item-info"><ul style="height: 100px;line-height: 100px;">' +
                                '<li class="d-order-name-li" style="width: 400px;text-align: left;"><div style="line-height: 1.2em;margin-bottom: 10px;padding-left: 5px;">'+d.productName+'</div><div style="line-height: 1.2em;padding-left: 5px;">'+d.modelName+'</div></li>' +
                                '<li class="d-order-unit" style="width:100px">￥'+Global.roundAmount(+d.salePrice / 1000, 2)+'</li>' +
                                '<li class="d-order-count"><div class="cart-count" style="margin-left: -9px;line-height: 50px;font-size:14px;"><span style="margin-left:10px;" class="so-subCount">-</span><input type="text" value="'+d.quantity+'"/><span class="so-addCount">+</span></div></li>' +
                                '<li class="d-order-amount" style="padding-left: 53px;">￥'+Global.roundAmount(eachCount, 2)+'</li>' +
                                '</ul></div></li>';
                        }
                        $("#orderUl").html(html);
                        $("#totalAmount").html(Global.roundAmount(totalCount / 1000, 2));
                    }else{
                        $(".user-info-body .user-content:eq(2) .cont-body")[0].innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                    }
                }else{
                    $(".user-info-body .user-content:eq(2) .cont-body")[0].innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                }
            });
    }

    function getModel() {
        var url = Global.baseUrl + '/commodity/queryModel',
            config = {
                "code": code
            };
        Ajax.get(url, config)
            .then(function(response){
                if(response.success){
                    var data = response.data,
                        html = "";
                    html += '<li class="pad24" modelCode="'+data.code+'">' +
                        '<div class="d-order-img"><a target="_blank" href="'+Global.baseUrl+'/detail/mall_detail.htm?code='+data.productCode+'"><img src="'+data.pic1+'"/></a></div>' +
                        '<div class="d-order-item-info"><ul style="height: 100px;line-height: 100px;">' +
                        '<li class="d-order-name-li" style="width: 400px;text-align: left;"><div style="line-height: 1.2em;margin-bottom: 10px;padding-left: 5px;">'+data.productName+'</div><div style="line-height: 1.2em;padding-left: 5px;">'+data.name+'</div></li>' +
                        '<li class="d-order-unit" style="width:100px">￥'+Global.roundAmount(+data.buyGuideList[0].discountPrice / 1000, 2)+'</li>' +
                        '<li class="d-order-count" style="width: 136px;"><div class="cart-count" style="margin-left: -9px;line-height: 50px;font-size:14px;"><span style="margin-left:10px;" class="so-subCount">-</span><input type="text" value="'+q+'"/><span class="so-addCount">+</span></div></li>' +
                        '<li class="d-order-amount" style="padding-left: 53px;">￥'+Global.roundAmount((+data.buyGuideList[0].discountPrice) * q / 1000, 2)+'</li>' +
                        '</ul></div></li>';
                    $("#orderUl").html(html);
                    $("#totalAmount").html(Global.roundAmount((+data.buyGuideList[0].discountPrice) * q / 1000, 2));
                }else{
                    $(".user-info-body .user-content:eq(2) .cont-body")[0].innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>"
                }
            });
    }

    function addListeners(){
        on(dom.byId("sbtn"), "click", function () {
            if($("#orderAddressUl>li.on").length){
                if(dom.byId("receiptTitle").value.length > 32){
                    Tooltip.show("字数必须少于32位", dom.byId("receiptTitle"), "warning");
                    return;
                }
                if(type == 1){
                    var config = {
                        "modelCode": $("#orderUl>li[modelCode]").attr("modelCode"),
                        "quantity":	$("#orderUl>li[modelCode]>.d-order-item-info>ul .d-order-count input").val(),
                        "salePrice": (+$("#orderUl>li[modelCode] .d-order-unit").text().substr(1))*1000,
                        "addressCode": $("#orderAddressUl>li.on").attr("code"),
                        "receiptType": ($("#receipt").val() == "0" ? "": $("#receipt").val()),
                        "receiptTitle": $("#receiptTitle").val(),
                        "applyNote": $("#so-bz").val() || "",
                        "type": "1"
                    };
                    submitConfirm.show(config);
                }else if(type == 2){
                    var cartList = [],
                        $lis = $("#orderUl > li");
                    for(var i = 0, len = $lis.length; i < len; i++){
                        cartList.push($($lis[i]).attr("modelCode"));
                    }
                    var config = {
                        "addressCode": $("#orderAddressUl>li.on").attr("code"),
                        "receiptType": ($("#receipt").val() == "0" ? "": $("#receipt").val()),
                        "receiptTitle": $("#receiptTitle").val(),
                        "applyNote": $("#so-bz").val() || "",
                        "cartCodeList": cartList,
                        "type": "2"
                    };
                    submitConfirm.show(config);
                }else{
                    showMsg.set("msg", "类型错误，无法提交订单");
                    showMsg.show();
                }
            }else{
                showMsg.set("msg", "未选择地址");
                showMsg.show();
            }
        });
        $("#orderAddressUl").on("click", "#newAddress", function (e) {
            e.stopPropagation();
            addAddressPanel.show();
        });
        $("#orderAddressUl").on("click", ".so-address-li", function (e) {
            e.stopPropagation();
            $("#orderAddressUl").find("li.on").removeClass("on");
            $(this).addClass("on");
        });
        $("#orderUl").on("click", ".so-subCount", function (e) {
            e.stopPropagation();
            var $input = $(this).next();
            var orig = $input.val();
            if(orig == undefined || orig == "" || orig == "0" || orig == "1"){
                orig = 2;
            }
            orig = +orig - 1;
            $input.val(orig);
            $input.change();
        });
        $("#orderUl").on("click", ".so-addCount", function (e) {
            e.stopPropagation();
            var $input = $(this).prev();
            var orig = $input.val();
            if(orig == undefined || orig == ""){
                orig = 0;
            }
            orig = +orig + 1;
            $input.val(orig);
            $input.change();
        });
        $("#orderUl").on("keyup", "input", function (e) {
            e.stopPropagation();
            var keyCode = e.charCode || e.keyCode;
            if(!isSpecialCode(keyCode) && !isNumber(keyCode)){
                this.value = this.value.replace(/[^\d]/g, "");
            }
            if(this.value == "0"){
                this.value = "1";
            }
        });
        $("#orderUl").on("change", "input", function (e) {
            e.stopPropagation();
            var keyCode = e.charCode || e.keyCode;
            if(!isSpecialCode(keyCode)){
                this.value = this.value.replace(/[^\d]/g, "");
            }
            if(this.value == "0"){
                this.value = "1";
            }
            if(type == 1){
                var $parent = $(this).parent().parent();
                var count = this.value,
                    unit = (+$parent.prev().text().substr(1)) * 1000,
                    new_amount = unit * (+count),
                    ori_amount = (+$parent.next().text().substr(1)) * 1000,
                    ori_total = (+$("#totalAmount").text()) * 1000,
                    new_total = new_amount - ori_amount + ori_total;
                $parent.next().text("￥" + Global.roundAmount(new_amount / 1000, 2));
                $("#totalAmount").text(Global.roundAmount(new_total / 1000, 2));
            }else if(type == 2){
                var gp = $(this).parents("li[modelCode]");
                var config = {
                    "code": gp.attr("modelCode"),
                    "quantity": this.value
                };
                var me = this;
                Ajax.post(Global.baseUrl + '/operators/editCart', config)
                    .then(function(response){
                        if(response.success){
                            var $parent = $(me).parent().parent();
                            var count = me.value,
                                unit = (+$parent.prev().text().substr(1)) * 1000,
                                new_amount = unit * (+count),
                                ori_amount = (+$parent.next().text().substr(1)) * 1000,
                                ori_total = (+$("#totalAmount").text()) * 1000,
                                new_total = new_amount - ori_amount + ori_total;
                            $parent.next().text("￥" + Global.roundAmount(new_amount / 1000, 2));
                            $("#totalAmount").text(Global.roundAmount(new_total / 1000, 2));
                        }else{
                            showMsg.set("msg", "数量修改失败，请重试！");
                            showMsg.show();
                        }
                    });
            }
        });
        on(dom.byId("receiptTitle"), "keyup", function (e) {
            var $i = $(this).prev();
            this.value == "" ? $i.show() : $i.hide();
        });
        on(dom.byId("so-bz"), "keyup", function (e) {
            var $i = $(this).prev();
            this.value == "" ? $i.show() : $i.hide();
        });
        on(dom.byId("receiptTitle"), "change", function (e) {
            if(this.value.length > 32){
                Tooltip.show("字数必须少于32位", this, "warning");
            }
        });
        $("#orderAddressUl").on("click", "#up_down", function (e) {
            e.stopPropagation();
            if($(this).hasClass("so_up")){
                $(this).removeClass("so_up").addClass("so_down").text("回收");
                $(this).parent().css("height", "auto");
            }else{
                $(this).removeClass("so_down").addClass("so_up").text("展开");
                $(this).parent().css("height", "162px");
            }
        });
    }

    function isNumber(code){
        if(code >= 48 && code <= 57 || code >= 96 && code <= 105){
            return true;
        }
        return false;
    }

    function isSpecialCode(code) {
        if(code == 37 || code == 39 || code == 8 || code == 46){
            return true;
        }
        return false;
    }
    
    return {
        init: function() {
            initView();
            Helper.init();
        }
    }
});