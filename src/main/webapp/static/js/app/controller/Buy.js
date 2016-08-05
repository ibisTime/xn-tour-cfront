define('js/app/controller/Buy', ['js/app/controller/base', 'js/app/util/ajax', 'js/app/util/dialog', 'js/lib/handlebars.runtime-v3.0.3', 'js/lib/swiper-3.3.1.jquery.min'], function (base, Ajax, dialog, Handlebars) {
    $(function () {
        var mySwiper, rspData = [], user;
        Ajax.get(APIURL + '/commodity/queryListModel', {
            productCode : base.getUrlParam("code") || ""
        }, true)
            .then(function (res) {
                if(res.success){
                    var data = res.data, imgs_html = "";
                    if(data.length){
                        rspData = data;
                        var $swiper = $("#container").find(".swiper-wrapper");
                        data.forEach(function (d, i) {
                            imgs_html += '<div code="'+d.code+'" class="swiper-slide"><img src="'+d.pic1+'"/></div>'
                        });
                        $swiper.html(imgs_html);
                        $("#buyBtn").click(function () {
                            if(!$(this).hasClass("no-buy-btn")){
                                var choseCode = $swiper.find(".swiper-slide.swiper-slide-active").attr("code");
                                location.href = "./submit_order.html?code=" + choseCode + "&q=" + $("#buyCount").val();
                            }
                        });
                        $("#addCartBtn").click(function(){
                            if(!$(this).hasClass("no-buy-btn")){
                                add2Cart();
                            }
                        });
                        addListeners();
                        var mySwiper1 = new Swiper('.swiper-container1',{
                            'loop': (data.length > 1 ? true : false),
                            'slidesPerView' : data.length,
                            'pagination': '.swiper-pagination',
                            'slideToClickedSlide': true,
                            'onSlideChangeEnd': function(swiper){
                                var index = $("#container")
                                                .find(".swiper-wrapper>.swiper-slide:eq("+swiper.activeIndex+")")
                                                .attr("data-swiper-slide-index");
                                choseImg(index);
                            }
                        });
                        $("#cont").remove();
                    }else{
                        doError();
                    }
                }else{
                    doError();
                }
            });

         base.getUser()
            .then(function(response){
                if(response.success){
                    user = response.data;
                }
            });

        function addListeners() {
            $("#subCount").on("click", function () {
                var orig = $("#buyCount").val();
                if(orig == undefined || orig == "" || orig == "0" || orig == "1"){
                    orig = 2;
                }
                orig = +orig - 1;
                $("#buyCount").val(orig);
                $("#buyCount").change();
            });
            $("#addCount").on("click", function () {
                var orig = $("#buyCount").val();
                if(orig == undefined || orig == ""){
                    orig = 0;
                }
                orig = +orig + 1;
                $("#buyCount").val(orig);
                $("#buyCount").change();
            });
            $("#buyCount").on("keyup", function (e) {
                var keyCode = e.charCode || e.keyCode;
                if(!isSpecialCode(keyCode) && !isNumber(keyCode)){
                    this.value = this.value.replace(/[^\d]/g, "");
                }
            }).on("change", function(e){
            	var keyCode = e.charCode || e.keyCode;
            	if(!isSpecialCode(keyCode) && !isNumber(keyCode)){
                    this.value = this.value.replace(/[^\d]/g, "");
                }
                if(!$(this).val()){
                    this.value = "1";
                }
                if($(this).val() == "0"){
                	this.value = "1";
                }
                var unitPrice = +$("#unit-price").val();
                $("#btr-price").text("￥" + (unitPrice * +$(this).val() / 1000).toFixed(2));
            });
        }
         function choseImg(index){
            var msl = rspData[index],
                table_html = "<tbody>";
			
            if(!mySwiper){
				$("#btlImgs").children("div.swiper-slide:not(.swiper-slide-duplicate)")
            	.find("img")
            	.each(function (i, item) {
	                $(item).attr("src", msl["pic" + (i+1)]);
	            });
                mySwiper = new Swiper ('.swiper-container', {
                            'direction': 'horizontal',
                            'loop': true,
                            'autoplay': 2000,
                            'pagination': '.swiper-pagination'
                        });
            }else{
				mySwiper.prependSlide([ '<div class="swiper-slide tc"><img src="'+msl.pic1+'"></div>',
				'<div class="swiper-slide tc"><img src="'+msl.pic2+'"></div>',
				'<div class="swiper-slide tc"><img src="'+msl.pic3+'"></div>']);
				mySwiper.removeSlide([3,4,5]);
            }
            msl.modelSpecsList.forEach(function (data) {
                table_html += "<tr><th>" + data.dkey + "</th><td>" + data.dvalue + "</td></tr>";
            });
            table_html += "</tbody>";
            $("#bb-table").html(table_html);
            $("#btr-name").text(msl.name);
            $("#btr-description").text(msl.description);
            var totalPrice;
            if(msl.buyGuideList.length){
                var discPrice = +msl.buyGuideList[0].discountPrice;
                $("#unit-price").val(discPrice);
                totalPrice = "￥" + (discPrice * +$("#buyCount").val() / 1000).toFixed(2);
                $("#addCartBtn, #buyBtn").removeClass("no-buy-btn");
            }else{
                totalPrice = "暂无价格";
                $("#unit-price").val("9999999999999");
                $("#addCartBtn, #buyBtn").addClass("no-buy-btn");
            }
            $("#btr-price").text(totalPrice);
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
            if(user){
                a2cart();
            }else{
                location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
            }
        }
        function a2cart(){
            var choseCode = $("#container").find(".swiper-wrapper>.swiper-slide-active").attr("code"),
                config = {
                    modelCode : choseCode || "",
                    quantity: $("#buyCount").val(),
                    salePrice: (+$("#btr-price").text().substr(1))*1000
                },
                url = APIURL + '/operators/add2Cart';
            Ajax.post(url, config)
                .then(function(response) {
                    var msg;
                    if (response.success) {
                        msg = "添加购物车成功!";
                    }else{
                        msg = "添加购物车失败!";
                    }
                    var d = dialog({
                        content: msg,
                        quickClose: true
                    });
                    d.show();
                    setTimeout(function () {
                        d.close().remove();
                    }, 2000);
                });
        }
    });
});