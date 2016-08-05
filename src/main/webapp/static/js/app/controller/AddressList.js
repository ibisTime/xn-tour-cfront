define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function (base, Ajax, Handlebars) {
    $(function () {
    	var url = APIURL + '/user/queryAddresses',
                config = {
                    "isDefault": ""
                },
            code = base.getUrlParam("c"),
            returnUrl = base.getUrlParam("return"),
            contentTmpl = __inline("../ui/address-items.handlebars");
            Ajax.get(url, config)
                .then(function(response){
                    if(response.success){
                        var data = response.data,
                            html = "";
                        if(data.length){
                        	var html = contentTmpl({items: data});
	                    	$("#addressDiv").append(html);
	                    	$("#cont").remove();
	                    	$("#addressDiv").children("a[code="+code+"]").addClass("active");
	                    	$("footer").removeClass("hidden");
                        }else{
                            doError("#addressDiv");
                        }
                    }else{
                    	doError("#addressDiv");
                    }
                });
        $("#addressDiv").on("click", "a", function(){
            var me = $(this);
            $("#loaddingIcon").removeClass("hidden");
			var config = {
                "addressee": me.find(".a-addressee").text(),
                "mobile": me.find(".a-mobile").text(),
                "province": me.find(".a-province").text(),
                "city": me.find(".a-city").text(),
                "district": me.find(".a-district").text(),
                "detailAddress": me.find(".a-detailAddress").text(),
                "isDefault": "1",
                "code": me.attr("code")
            };
            Ajax.post(APIURL + "/user/edit/address", config)
                .then(function (response) {
                    if(response.success){
                        location.href = returnUrl;
                    }else{
                        $("#loaddingIcon").addClass("hidden");
                    }
                });
        });

        $("#sbtn").on("click", function(){
        	location.href = "./add_address.html?return=" + encodeURIComponent(returnUrl);
        });

        function doError(cc) {
            $(cc).replaceWith('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂时无法获取数据</div>');
        }
    });
});