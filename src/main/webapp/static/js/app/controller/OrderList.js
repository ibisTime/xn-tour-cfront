define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dict',
    'Handlebars'
], function (base, Ajax, Dict, Handlebars) {
    $(function () {
    	var config = {
	        status: "",
	        limit: 15,
	        start: 1,
	        orderDir: "desc",
	        orderColumn: "apply_datetime"
	    }, orderStatus = Dict.get("orderStatus"),
	    first, isEnd, index = base.getUrlParam("i") || 0, canScrolling;

	    initView();

	    function initView() {
            addListener();
            $("#status_ul>li:eq("+index+")").click();
	    }
	    
	    function addListener() {
	        $("#status_ul").on("click", "li", function (e) {
	            config.start = 1;
	            $("#status_ul").find("li.active").removeClass("active");
	            var status = $(this).addClass("active").attr("status");
	            status = status == "0" ? "" : status;
	            config.status = status;
	            first = true;
	            isEnd = false;
	            canScrolling = true;
	            $("#ol-ul").empty();
	            addLoading();
	            getOrderList();
	            e.stopPropagation();
	        });
	        $(window).on("scroll", function(){
	        	var me = $(this);
	        	if( canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop()) ){
	        		canScrolling = false;
	        		addLoading();
	        		getOrderList();
	        	}
	        });
	        $("#ol-ul").on("click", "li span.ol-tobuy", function (e) {
	            e.stopPropagation();
	            e.preventDefault();
	            var me = $(this);
	            location.href = "../operator/pay_order.html?code="+me.closest("li[code]").attr("code");
	        });
	    }

	    function getOrderList() {
	        Ajax.post(APIURL + "/operators/queryPageOrders", config)
	            .then(function (response) {
	                if (response.success) {
	                    var data = response.data, html = "",
	                    	totalCount = data.totalCount,
	                    	curList = data.list;
	                    if(totalCount < config.limit || curList.length < config.limit){
	                    	isEnd = true;
	                    }
	                    if(curList.length){
	                        curList.forEach(function (cl) {
	                            var invoices = cl.invoiceModelList,
	                                totalAmount = cl.totalAmount,
	                                code = cl.code;
				                html += '<li class="clearfix b_bd_b b_bd_t bg_fff mt10" code="'+code+'">'+
						                    '<a class="show" href="./order_detail.html?code='+code+'" class="show">'+
						                        '<div class="wp100 s_09 b_bd_b clearfix  ptb10 plr10">'+
						                            '<div class="fl">订单号：<span>'+code+'</span></div>'+
						                        '</div>';
						        if(invoices.length == 1){
		                            invoice = invoices[0];
	                            	var amount = ((+invoice.salePrice * + invoice.quantity) / 1000).toFixed(2);
	                            	html += '<div class="wp100 clearfix plr10 ptb4 p_r">'+
					                            '<div class="fl wp30 tc"><img src="'+invoice.pic1+'"></div>'+
					                            '<div class="fl wp40 pl12 pt12">'+
					                                '<p class="tl">'+invoice.productName+'</p>'+
					                                '<p class="tl pt4">'+invoice.modelName+'</p>'+
					                            '</div>'+
					                            '<div class="fl wp30 tr s_10 pt12">'+
					                                '<p class="item_totalP">￥'+amount+'</p>'+
					                                '<p class="t_80">×<span>'+invoice.quantity+'</span></p>'+
					                                '<p class="ab wp100 r_10 b_18">金额:￥'+(+cl.totalAmount / 1000).toFixed(2)+'</p>'+
					                            '</div>';
		                        }else{
		                        	html += '<div class="wp100 clearfix plr10 ptb4 p_r">';
		                        	var arr = invoices.splice(0, 3);
		                        	arr.forEach(function(invoice){
		                        		html += '<div class="fl wp33 tc"><img src="'+invoice.pic1+'"></div>';
		                        	});
		                        }
		                        html += '</div>'+
					                        '<div class="wp100 clearfix plr10 ptb6">'+
					                            '<span class="fr inline_block bg_f64444 t_white s_10 plr8 ptb4 b_radius4 '+(cl.status == "1" ? "ol-tobuy" : "")+'">'+getStatus(cl.status)+'</span>'+
					                        '</div>'+
					                    '</a></li>';
	                        });
	                        removeLoading();
	                        $("#ol-ul").append(html);
	                        config.start += 1;
	                    }else{
	                    	if(first){
	                    		doError();
	                    	}else{
	                    		removeLoading();
	                    	}
	                    }
	                }else{
	                	if(first){
                    		doError();
                    	}else{
                    		removeLoading();
                    	}
	                }
	                first = false;
	                canScrolling = true;
	            });
	    }

	    function addLoading() {
	        $("#ol-ul").append('<li class="scroll-loadding"></li>');
	    }

	    function removeLoading(){
	    	$("#ol-ul").find(".scroll-loadding").remove();
	    }

	    function doError() {
            $("#ol-ul").html('<li class="bg_fff" style="text-align: center;line-height: 93px;">暂无数据</li>');
        }

	    function getStatus(status) {
	        return orderStatus[status] || "未知状态";
	    }
    });
});