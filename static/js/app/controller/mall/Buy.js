define([
    'app/controller/base',
    'app/util/ajax',
    'swiper',
    'app/module/showImg/showImg',
    'app/module/loading/loading',
    'app/module/addSub/addSub'
], function(base, Ajax, Swiper, showImg, loading, addSub) {
	var code = base.getUrlParam("code"), price;
	var pic_suffix = '?imageMogr2/auto-orient/thumbnail/!375x180r';
	init();

    function init() {
    	if(!code){
    		base.showMsg("未传入商品编号");
    		return;
    	}
    	loading.createLoading();
        addListener();
        initSwiper();
        getDetail();
    }
    function initSwiper(){
        new Swiper('#swiper', {
            'direction': 'horizontal',
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination'
        });
    }
    function addListener() {
    	$("#swiper").on("click", ".swiper-slide .center-img", function(){
            showImg.createImg($(this).attr("src")).showImg();
        });
        $("#kefuIcon").on("click", function (e) {
            location.href = "http://kefu.easemob.com/webim/im.html?tenantId=" + TENANTID;
        });
        $("#cartIcon").on("click", function () {
        	location.href = "./cart.html";
        });
        $("#buyBtn").on("click", function(){
            var quantity = +$("#quantity").val();
            location.href = "./submit-order.html?code=" + code + "&q=" + quantity;
        });

        $("#addCartBtn").on("click", function () {
        	if(!base.isLogin()){
        		base.goLogin();
        		return;
        	}
        	addCart();
        })

        addSub.createByEle({
            sub: $("#subBtn"),
            add: $("#addBtn"),
            input: $("#quantity"),
            changeFn: function () {
                // $("#totalAmount").text(base.fZMoney(price * +$(this).val()));
            }
        });
    }
    function addCart() {
    	Ajax.post("618430", {
    		json: {
    			userId: base.getUserId(),
    			productCode: code,
    			quantity: $("#quantity").val() || 1
    		}
    	}).then(function (res) {
    		if(res.success){
    			base.showMsg("添加购物车成功", 1000);
    		}else{
    			base.showMsg(res.msg);
    		}
    	}, function () {
    		base.showMsg("商品添加失败");
    	})
    }
    function getDetail() {
    	Ajax.get("618422", {
            code: code
        }).then(function(res){
            if(res.success){
                var data = res.data;
                var pic = data.pic1.split(/\|\|/), html = "";
                $.each(pic, function(i, p){
                    html += '<div class="swiper-slide"><img class="wp100 center-img" src="' + base.getPic(p, pic_suffix) +'"></div>'
                });
                price = res.data.price1;
                $("#swiper").find(".swiper-wrapper").html(html);

                initSwiper();

                $("#description").html(data.description);
                $("#price").text(price);
                $("#name").text(data.name);
            }else{
                base.showMsg(res.msg);
            }
            loading.hideLoading();
        }, function () {
        	base.showMsg("加载失败");
        	loading.hideLoading();
        })
    }
});