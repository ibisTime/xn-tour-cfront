define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {

	var dcode ;
	
	$("#MyIframe").height($(window).height()-$("#top-nav").height());
	init();
	
    function init() {
    	
        addListener($(".J_Content").eq(0).attr("data-code"));
		
		$(".J_Content").click(function(){
			
			dcode = $(this).attr("data-code");
			$(this).addClass("active").siblings().removeClass("active");
			addListener(dcode);
		})
    }

    function addListener(c) {
    	
        loading.createLoading();
        var code = c;
        
        Ajax.get("806052", {type: 3})
            .then(function(res){
                if(res.success){
                    var data = res.data;
                    var src = "";
                    $.each(data, function(i, d){
                        //出行-查询
                        if(d.location == "go_query"){
                            var url = d.url;
                            if(/^page:/.test(url)){
                                url = url.replace(/^page:/, "../")
                                         .replace(/\?/, ".html?");
                                if(!/\?/.test(url)){
                                    url = url + ".html";
                                }
                            }
                            //飞机
                            if(d.code == code){
                                src = url;
                                $("#MyIframe").attr("src",src)
                            }
                        }
                    });
                    
                    loading.hideLoading();
                }else{
                    base.showMsg(res.msg || "加载失败");
                    loading.hideLoading();
                }
            }, function(){
                loading.hideLoading();
                base.showMsg("加载失败");
            });
    
    }
});