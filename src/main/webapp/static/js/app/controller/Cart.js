define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'Handlebars'
], function (base, Ajax, dialog, Handlebars) {
    $(function () {
    	var url = APIURL + '/operators/queryCart', infos = [],
        	contentTmpl = __inline("../ui/cart-imgs.handlebars"),
        	$this;

        initView();

	    function initView() {
	        getMyCart();
	        addListeners();
	    }
	    function getMyCart() {
	        infos = [];
	        Ajax.get(url, true)
	            .then(function (response) {
	                if(response.success){
	                    var data = response.data, html = "";
	                    if(data.length){
	                        var totalAmount = 0;
	                        data.forEach(function (cl) {
	                            var amount = (+cl.salePrice) * (+cl.quantity);
	                            cl.totalAmount = (amount / 1000).toFixed(2);
	                            infos.push(amount);
	                        });

	                        $("#od-ul").html( contentTmpl({items: data}) );
	                        $("#totalAmount").html("0.00");
	                    }else{
	                    	$("#cart-bottom").hide();
	                    	$("#cont").replaceWith('<div class="bg_fff" style="text-align: center;line-height: 150px;">购物车内暂无商品</div>');
	                    }
	                }else{
	                	$("#cart-bottom").hide();
						doError("#cont");
	                }
	            });
	    }
	    function addListeners() {
	        $("#sbtn").on("click", function () {
	            var checkItem = [];
	            $("#od-ul>ul>li>div.c-img-l>div.radio-tip1")
	            	.each(function(i, item){
	            		if($(item).hasClass("active")){
	            			checkItem.push(i);
	            		}
	            	});
	            if(checkItem.length) {
	                location.href = '../operator/submit_order.html?code='+checkItem.join("_")+'&type=2';
	            }else{
	                showMsg("未选择购买的商品");
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
	            if(!$(this).val()){
                    this.value = "1";
                }
	            if(this.value == "0"){
	                this.value = "1";
	            }
	            var gp = $(this).parents("li[code]"), salePrice = +gp.attr("saleP");
	            var config = {
	                "code": gp.attr("code"),
	                "quantity": this.value
	            };
	            var me = this;
	            $("#loaddingIcon").removeClass("hidden");
	            Ajax.post(APIURL + '/operators/editCart', config)
	                .then(function(response){
	                	$("#loaddingIcon").addClass("hidden");
	                    if(response.success){
	                        var flag = gp.find(".c-img-l > .radio-tip1.active").length,
	                        	$parent = $(me).parent(),
	                        	count = me.value,
	                            unit = salePrice,
	                            new_amount = unit * (+count),
	                            ori_amount = infos[gp.index()],
	                            ori_total = +$("#totalAmount").text() * 1000,
	                            new_total = new_amount - ori_amount + ori_total;
	                        infos[gp.index()] = new_amount;
	                        $parent.prev().text("￥" + ((+new_amount)/1000).toFixed(2));
	                        if(flag){
	                            $("#totalAmount").text((new_total/1000).toFixed(2) );
	                        }
	                    }else{
	                    	var $parent = $(me).parent();
	                    	me.value = (+$parent.prev().text().substr(1) * 1000) / salePrice;
	                        showMsg("数量修改失败，请重试！");
	                    }
	                });
	        });
	        $("#allChecked").on("click", function () {
	            var flag = false, me = $(this), doAction = "removeClass";
	            if(me.hasClass("active")){
	            	me.removeClass("active");
	            }else{
	            	me.addClass("active");
	            	flag = true;
	            	doAction = "addClass";
	            }
	            $("#od-ul>ul>li>div.c-img-l>div")
	            	.each(function(i, item){
	            		$(item)[doAction]("active");
	            	});
	            if(flag){
	                var t = 0;
	                for(var i = 0; i< infos.length; i++){
	                    t += infos[i];
	                }
	                $("#totalAmount").text((t/1000).toFixed(2));
	                $("#deleteCheck").addClass("color_333");
	            }else{
	                $("#totalAmount").text("0.00");
	                $("#deleteCheck").removeClass("color_333");
	            }
	        });
	        $("#od-ul").on("click", ".del-icon", function(e){
	            e.stopPropagation();
	            $this = this;
	            $("#od-mask, #od-tipbox").removeClass("hidden");
	        });
	        $("#od-ul").on("click", "li[code] .radio-tip1", function(e){
	            e.stopPropagation();
	            var $li = $(this).closest("li[code]"),
	            	isChecked = false, me = $(this);
	            if(me.hasClass("active")){
	            	me.removeClass("active");
	            }else{
	            	me.addClass("active");
	            	isChecked = true;
	            }
	            
	            if(isChecked){
	                if($("#od-ul>ul>li").length == $("#od-ul>ul>li>.c-img-l>div.active").length){
	                	$("#allChecked").addClass("active");
	                }
	                var ori_total = (+$("#totalAmount").text()) * 1000;
	                $("#totalAmount").text( ((ori_total + infos[$li.index()])/1000).toFixed(2) );
	            }else{
	                var items = $("#od-ul").children("li").find("input[type=checkbox]"),
	                    flag = false;
	                $("#allChecked").removeClass("active");
	                var ori_total = (+$("#totalAmount").text()) * 1000;
	                $("#totalAmount").text( ((ori_total - infos[$li.index()])/1000).toFixed(2) );
	            }
	        });
	        $("#odOk").on("click", function(){
				deleteFromCart($this);
	        	$("#od-mask, #od-tipbox").addClass("hidden");
	        })
	        $("#odCel").on("click", function(){
	        	$("#od-mask, #od-tipbox").addClass("hidden");
	        })
	    }

	    function showMsg(cont){
    		var d = dialog({
						content: cont,
						quickClose: true
					});
			d.show();
			setTimeout(function () {
				d.close().remove();
			}, 2000);
    	}
    	function doError(cc) {
            $(cc).replaceWith('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂时无法获取数据</div>');
        }
	    function isNumber(code){
	        if(code >= 48 && code <= 57 || code >= 96 && code <= 105){
	            return true;
	        }
	        return false;
	    }

	    function deleteFromCart(me) {
	        var $li = $(me).closest("li[code]"),
	            code = $li.attr('code');
	        $("#loaddingIcon").removeClass("hidden");
	        Ajax.post(APIURL + "/operators/deleteFromCart",
	            {"code": code})
	            .then(function (response) {
	            	$("#loaddingIcon").addClass("hidden");
	                if(response.success){
	                    infos.splice($li.index(), 1);
	                    $li.remove();
	                }else{
	                    showMsg("删除失败，请重试！");
	                }
	            });
	    }

	    function isSpecialCode(code) {
	        if(code == 37 || code == 39 || code == 8 || code == 46){
	            return true;
	        }
	        return false;
	    }
    });
});