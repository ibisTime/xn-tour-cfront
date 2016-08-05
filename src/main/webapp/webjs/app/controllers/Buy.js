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
    'app/common/Data',
    'dojo/when',
    'app/views/operator/ShowMsg',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax,
            Global, Helper, Data, when, ShowMsg) {
    var prodCode = Global.getUrlParam("code") || "",
        config = {
            productCode : prodCode || "",
            status: "3"
        },
        url = Global.baseUrl + '/commodity/queryListModel',
        flag = true, rspData = [], showMsg = new ShowMsg(), uKind = "f1";
    function initView() {
        if(sessionStorage.getItem("uKind") == undefined) {
            when(Data.getUser(), function (user) {
                if (user) {
                    if (user.kind == "f2") {
                        sessionStorage.setItem("uKind", "f2");
                        uKind = "f2";
                    } else {
                        sessionStorage.setItem("uKind", "f1");
                    }
                } else {
                    sessionStorage.removeItem("uKind");
                }
                queryListModel();
            });
        }else if(sessionStorage.getItem("uKind") == "f2"){
            uKind = "f2";
            queryListModel();
        }else{
            queryListModel();
        }
    }

    function queryListModel() {
        Ajax.get(url, config)
            .then(function(response){
                if (response.success) {
                    var data = response.data,
                        imgs_html = "";
                    if(data.length){
                        rspData = data;
                        var $ul = $("#btr-images"), $lis;
                        data.forEach(function (d, i) {
                            imgs_html += '<li code="'+d.code+'" style="left:'+(104 * i)+'px;"'+(i == 0 ? " class=\"on\"" : "")+'><img src="'+d.pic1+'"/></li>';
                        });
                        $ul.html(imgs_html);
                        $(".b-top-r").find(".absolute-loading").remove();
                        $lis = $ul.find("li");
                        choseImg( $($lis[0]), $($lis[0]) );
                        $("#buyBtn").click(function () {
                            if(!$(this).hasClass("no-buy-btn")){
                                var choseCode = $("#btr-images").find("li.on").attr("code");
                                location.href = Global.baseUrl + "/operator/submit_order.htm?code=" + choseCode + "&q=" + $("#buyCount").val();
                            }
                        });
                        if(uKind != "f2"){
                            $("#addCartBtn").click(function(){
                                if(!$(this).hasClass("no-buy-btn")){
                                    add2Cart();
                                }
                            });
                        }else{
                            $("#addCartBtn").remove();
                        }
                        if( data.length > 5 ){
                            //如果大于5张
                            $("#btr-l").on("click", function () {
                                goLeftImg();
                            });
                            $("#btr-r").on("click", function () {
                                goRightImg();
                            });
                            $("#btr-l").show();
                        }
                    }else{
                        dom.byId("container").innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                    }
                }else{
                    dom.byId("container").innerHTML = "<span style='margin: 80px 0;display: inline-block;font-size: 24px;width: 100%;text-align: center;'><img style='width: 120px;margin-bottom: 20px;' src='"+Global.staticUrl+"/images/noData.png'/><br>暂无数据</span>";
                }
            });
    }

    function addListeners() {
        $("#btr-images").on("click", "li", function () {
            choseImg($("#btr-images").find("li.on"), $(this));
        });
        on(dom.byId("subCount"), "click", function () {
            var orig = dom.byId("buyCount").value;
            if(orig == undefined || orig == "" || orig == "0" || orig == "1"){
                orig = 2;
            }
            orig = +orig - 1;
            dom.byId("buyCount").value = orig;
        });
        on(dom.byId("addCount"), "click", function () {
            var orig = dom.byId("buyCount").value;
            if(orig == undefined || orig == ""){
                orig = 0;
            }
            orig = +orig + 1;
            dom.byId("buyCount").value = orig;
        });
        on(dom.byId("buyCount"), "keyup", function (e) {
            var keyCode = e.charCode || e.keyCode;
            if(!isSpecialCode(keyCode) && !isNumber(keyCode)){
                this.value = this.value.replace(/[^\d]/g, "");
            }
        });
        $("#btlImgs").on("click", "li>img", function(){
            $("#btl-img").attr("src", $(this).attr("src"));
            $(this).parent().addClass("on")
                .siblings("li").removeClass("on");
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

    function add2Cart(){
        if(!Data.getUser(true)){
            $("#icon_login").click();
            return;
        }
        var choseCode = $("#btr-images").find("li.on").attr("code"),
            config = {
                modelCode : choseCode || "",
                quantity: dom.byId("buyCount").value,
                salePrice: (+$("#btr-price").text().substr(1))*1000
            },
            url = Global.baseUrl + '/operators/add2Cart';
        Ajax.post(url, config)
            .then(function(response) {
                if (response.success) {
                    Helper.getCartTotal();
                    var cloneLi = $("#btl-img").clone();
                    cloneLi.css({
                        "animation": "cartAnimate 0.3s",
                        "-moz-animation": "cartAnimate 0.3s",
                        "-webkit-animation": "cartAnimate 0.3s",
                        "-o-animation": "cartAnimate 0.3s",
                        "z-index": "9999",
                        "min-width": "0px",
                        "min-height": "0px",
                        "position": "absolute"
                    });
                    cloneLi.insertBefore($("#btl-img"));
                    setTimeout(function () {
                        cloneLi.remove();
                    }, 310);
                }else{
                    showMsg.set("msg", response.msg);
                    showMsg.show();
                }
            });
    }
    function choseImg(li_on, li_next){
        li_on.removeClass("on");
        li_next.addClass("on");
        var index = li_next.index();
        $("#btl-img").attr("src", li_next.find("img").attr("src"));
        var msl = rspData[index],
            table_html = "<tbody>";
        msl.modelSpecsList.forEach(function (data) {
            table_html += "<tr><th>" + data.dkey + "</th><td>" + data.dvalue + "</td></tr>";
        });
        table_html += "</tbody>";
        var $imgs = $("#btlImgs").children("li").find("img").each(function (i, item) {
            $(item).attr("src", msl["pic" + (i+1)]);
        });
        $("#bb-table").html(table_html);
        $("#btr-name").text(msl.name);
        $("#btr-description").text(msl.description);
        var origPrice, discPrice;
        if(msl.buyGuideList.length){
            origPrice = "￥" + Global.roundAmount(+msl.buyGuideList[0].originalPrice / 1000, 2);
            discPrice = "￥" + Global.roundAmount(+msl.buyGuideList[0].discountPrice / 1000, 2);
            $("#addCartBtn, #buyBtn").removeClass("no-buy-btn");
        }else{
            origPrice = "";
            discPrice = "暂无价格";
            $("#addCartBtn, #buyBtn").addClass("no-buy-btn");
        }
        $("#origin-price").text(origPrice);
        $("#btr-price").text(discPrice);
    }
    function goLeftImg() {
        var $ul = $("#btr-images"),
            $lis = $ul.find("li"),
            lastLeft = parseInt($lis[$lis.length - 1].style.left);
        if(lastLeft <= 416 || !flag){
            return;
        }
        $("#btr-r").show();
        flag = false;
        for(var i = 0; i < 4; i++){
            (function (i) {
                setTimeout(function () {
                    for(var j = 0, len = $lis.length; j < len; j++){
                        $lis[j].style.left = (parseInt($lis[j].style.left) - 26) + "px";
                    }
                    if( i == 3 ){
                        flag = true;
                        var $li_on = $ul.find("li.on");
                        if( parseInt($lis[$lis.length - 1].style.left) <= 416 ) {
                            $("#btr-l").hide();
                        }
                        if( parseInt($li_on.css("left")) < 0 ){
                            choseImg($li_on, $li_on.next());
                        }
                    }
                }, (i + 1) * 100)
            })(i);
        }
    }
    function goRightImg(){
        var $ul = $("#btr-images"),
            $lis = $ul.find("li"),
            firstLeft = parseInt($lis[0].style.left);
        if(firstLeft >= 0 || !flag){
            return;
        }
        $("#btr-l").show();
        flag = false;
        for(var i = 0; i < 4; i++){
            (function (i) {
                setTimeout(function () {
                    for(var j = 0, len = $lis.length; j < len; j++){
                        $lis[j].style.left = (parseInt($lis[j].style.left) + 26) + "px";
                    }
                    if( i == 3 ){
                        flag = true;
                        var $li_on = $ul.find("li.on");
                        if( parseInt($lis[0].style.left) >= 0 ) {
                            $("#btr-r").hide();
                        }
                        if( parseInt($li_on.css("left")) > 416 ){
                            choseImg($li_on, $li_on.prev());
                        }
                    }
                }, (i + 1) * 100)
            })(i);
        }
    }

    return {
        init: function() {
            initView();
            addListeners();
            Helper.init();
        }
    }
});