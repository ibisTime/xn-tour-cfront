define('app/controllers/Cart', [
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/views/operator/ShowMsg',
    'app/views/operator/Confirm',
    'app/jquery/Pagination',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query,
            Ajax, Global, Helper, ShowMsg, Confirm, Pagination) {

    var showMsg = new ShowMsg(),
        config = {
            "start": 1,
            "limit": 6
        }, url = Global.baseUrl + '/operators/queryPageCart',
        totalCount = 0, totalPage = 0, curList = [], pageNO = 1, infos = [];
    function initView() {
        getMyCart();
        addListeners();
    }
    function getMyCart() {
        infos = [];
        Ajax.post(url, config)
            .then(function (response) {
                if(response.success){
                    var data = response.data, html = "";
                    totalCount = data.totalCount;
                    totalPage = data.totalPage;
                    curList = data.list;
                    if(curList.length){
                        var totalAmount = 0;
                        curList.forEach(function (cl) {
                            var amount = (+cl.salePrice) * (+cl.quantity);
                            infos.push(amount);
                            totalAmount += amount;
                            html +=
                                '<li class="pad24" code="'+cl.code+'">' +
                                    '<div style="margin-right: 10px;"><input type="checkbox" checked/></div>' +
                                    '<div class="d-order-img" style="margin-right: 5px;"><a target="_blank" href="'+Global.baseUrl+'/detail/mall_detail.htm?code='+cl.productCode+'"><img src="'+cl.pic1+'"/></a></div>' +
                                    '<div class="d-order-item-info" style="width: 815px;">' +
                                        '<ul style="height: 100px;line-height: 100px;">' +
                                            '<li class="cart-name-li" style="width: 354px;"><div style="line-height: 1.2em;margin-bottom: 10px;">'+cl.productName+'</div><div style="line-height: 1.2em;">'+cl.modelName+'</div></li>' +
                                            '<li class="d-order-unit">￥'+Global.roundAmount(+cl.salePrice/1000, 2)+'</li>' +
                                            '<li class="d-order-count cart-count">' +
                                                '<span class="subCount">-</span>' +
                                                '<input type="text" value="'+cl.quantity+'"/>' +
                                                '<span class="addCount">+</span>' +
                                            '</li>' +
                                            '<li class="d-order-amount">￥'+Global.roundAmount(amount/1000, 2)+'</li>' +
                                            '<li class="cart-delete"><i></i></li>' +
                                        '</ul>' +
                                    '</div>' +
                                '</li>';
                        });
                        totalAmount /= 1000;
                        $("#od-ul").html(html);
                        $("#totalAmount").html(totalAmount);
                        $("#pagination_div").pagination({
                            items: totalCount,
                            itemsOnPage: config.limit,
                            pages: totalPage,
                            prevText: '<',
                            nextText: '>',
                            displayedPages: '2',
                            currentPage: pageNO,
                            onPageClick: function(pageNumber){
                                config.start = pageNumber;
                                pageNO = pageNumber;
                                var ii = $("#od-ul").html("<i class='loading-icon'></i>");
                                getMyCart();
                            }
                        });
                    }else{
                        pageNO = config.start = "1";
                        $(".cb-list-item").html("<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>");
                    }
                }else{
                    pageNO = config.start = "1";
                    $(".cb-list-item").html("<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>");
                }
            });
    }
    function addListeners() {
        on(dom.byId("sbtn"), "click", function () {
            var checkItem = [];
            $("#od-ul").children("li").find("input[type=checkbox]")
                .each(function (i, item) {
                    if(item.checked){
                        checkItem.push(i);
                    }
                });
            if(checkItem.length) {
                location.href = Global.baseUrl + '/operator/submit_order.htm?code='+checkItem.join("_")+'&type=2&s='+config.start+"&l="+config.limit;
            }else{
                showMsg.set("msg", "未选择购买的商品");
                showMsg.show();
            }
        });
        $("#od-ul").on("click", ".subCount", function (e) {
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
        $("#od-ul").on("click", ".addCount", function (e) {
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
        $("#od-ul").on("keyup", "input", function (e) {
            e.stopPropagation();
            var keyCode = e.charCode || e.keyCode;
            if(!isSpecialCode(keyCode) && !isNumber(keyCode)){
                this.value = this.value.replace(/[^\d]/g, "");
            }
            if(this.value == "0"){
                this.value = "1";
            }
        });
        $("#od-ul").on("change", "input[type=text]", function (e) {
            e.stopPropagation();
            var keyCode = e.charCode || e.keyCode;
            if(!isSpecialCode(keyCode)){
                this.value = this.value.replace(/[^\d]/g, "");
            }
            if(this.value == "0"){
                this.value = "1";
            }
            var gp = $(this).parents("li[code]");
            var config = {
                "code": gp.attr("code"),
                "quantity": this.value
            };
            var me = this;
            Ajax.post(Global.baseUrl + '/operators/editCart', config)
                .then(function(response){
                    if(response.success){
                        var $li = $(me).closest("li[code]");
                        var flag = $li.children("div:first").find("input")[0].checked;
                        var $parent = $(me).parent();
                        var count = me.value,
                            unit = (+$parent.prev().text().substr(1)) * 1000,
                            new_amount = unit * (+count),
                            ori_amount = (+$parent.next().text().substr(1)) * 1000,
                            ori_total = (+$("#totalAmount").text()) * 1000,
                            new_total = new_amount - ori_amount + ori_total;
                        $parent.next().text("￥" + Global.roundAmount(new_amount / 1000, 2));
                        infos[$li.index()] = new_amount;
                        if(flag){
                            $("#totalAmount").text(Global.roundAmount(new_total / 1000, 2));
                        }
                    }else{
                        showMsg.set("msg", "数量修改失败，请重试！");
                        showMsg.show();
                    }
                });
        });
        $("#allChecked").on("click", function () {
            var flag = this.checked;
            $("#od-ul").children("li").find("input[type=checkbox]")
                .each(function (i, item) {
                    item.checked = flag;
                });
            if(flag){
                var t = 0;
                for(var i = 0; i< infos.length; i++){
                    t += infos[i];
                }
                $("#totalAmount").text(t/1000);
                $("#deleteCheck").addClass("color_333");
            }else{
                $("#totalAmount").text(0);
                $("#deleteCheck").removeClass("color_333");
            }
        });
        $("#deleteCheck").on("click", function () {
            if($(this).hasClass("color_333")){
                new Confirm({
                    ok: function () {
                        deleteCheckCart(this);
                    },
                    cancel: function () {
                        this.close();
                    },
                    msg: "确定删除吗？"
                }).show();
            }
        });
        $("#od-ul").on("click", ".cart-delete i", function(e){
            e.stopPropagation();
            var me = this;
            new Confirm({
                ok: function () {
                    deleteFromCart(me, this);
                },
                cancel: function () {
                    this.close();
                },
                msg: "确定删除吗？"
            }).show();
        });
        $("#od-ul").on("click", "li[code] input[type=checkbox]", function(e){
            e.stopPropagation();
            var $li = $(this).closest("li[code]");
            if(this.checked){
                var flag = true;
                $("#deleteCheck").addClass("color_333");
                $("#od-ul").children("li").find("input[type=checkbox]")
                    .each(function (i, item) {
                        if(!item.checked){
                            flag = false;
                        }
                    });
                var ori_total = (+$("#totalAmount").text()) * 1000;
                $("#totalAmount").text( (ori_total + infos[$li.index()])/1000 );
                if(flag){
                    dom.byId("allChecked").checked = true;
                }
            }else{
                var items = $("#od-ul").children("li").find("input[type=checkbox]"),
                    flag = false;
                for( var i = items.length; i; ){
                    if(items[--i].checked){
                        flag = true;
                        break;
                    }
                }
                var ori_total = (+$("#totalAmount").text()) * 1000;
                $("#totalAmount").text( (ori_total - infos[$li.index()])/1000 );
                if(!flag){
                    $("#deleteCheck").removeClass("color_333");
                }
                if(dom.byId("allChecked").checked){
                    dom.byId("allChecked").checked = false;
                }
            }
        });
    }

    function isNumber(code){
        if(code >= 48 && code <= 57 || code >= 96 && code <= 105){
            return true;
        }
        return false;
    }

    function deleteFromCart(me, confirm) {
        var $li = $(me).closest("li[code]"),
            code = $li.attr('code'),
            length = $("#od-ul").children("li").length;
        Ajax.post(Global.baseUrl + "/operators/deleteFromCart",
            {"code": code})
            .then(function (response) {
                if(response.success){
                    Helper.getCartTotal();
                    showMsg.set("msg", "删除成功！");
                    infos.splice($li.index(), 1);
                    dom.byId("od-ul").innerHTML = '<i class="loading-icon"></i>';
                    if(totalPage ==  pageNO && length == 1 && (pageNO) > 1){
                        config.start = pageNO = pageNO - 1;
                    }
                    getMyCart();
                    showMsg.show();
                }else{
                    showMsg.set("msg", "删除失败，请重试！");
                    showMsg.show();
                }
                confirm.close();
            });
    }

    function deleteCheckCart(me) {
        var checkItem = [];
        $("#od-ul").children("li").find("input[type=checkbox]")
            .each(function (i, item) {
                if(item.checked){
                    checkItem.push($(item).closest("li[code]").attr("code"));
                }
            });
        if(checkItem.length){
            Ajax.post(Global.baseUrl + "/operators/deleteCartItems",
                {"cartCodeList": checkItem})
                .then(function (response) {
                    if(response.success){
                        Helper.getCartTotal();
                        showMsg.set("msg", "删除成功！");
                        showMsg.show();
                        if(totalPage ==  pageNO && checkItem.length == config.limit && pageNO > 1 ){
                            config.start = pageNO = pageNO - 1;
                        }
                        getMyCart();
                    }else{
                        showMsg.set("msg", "删除失败，请重试！");
                        showMsg.show();
                    }
                    me.close();
                });
        }else{
            showMsg.set("msg", "未选中删除项！");
            showMsg.show();
            me.close();
        }
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