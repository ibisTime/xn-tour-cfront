define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {


    init();

    function init() {
        addListener();
    }

    function addListener() {
	    var userId = base.getUserId();
		var mydate = new Date();
		var nowDate = base.formatDate(mydate,"yyyy-MM-dd");
	    
	    $.when(
            Ajax.get("805102",{
            	"userId":userId}),
            Ajax.get("805103",{
            	"userId":userId,
            	"dateStart": nowDate})
        ).then(function(res1,res2){
        	if(res1.success){
	            for (i = 0; i< res1.data.length;i++) {
	            	var tempDate = base.formatDate(res1.data[i].signDatetime,"yyyy-MM-dd")
	            	
	            	if(nowDate == tempDate){
	            		console.log(1);
		            	$("#btn-signIn").val("明天再来").addClass("a-qiandao");
	            	}
	            }
            }else{
                base.showMsg(res1.msg);
            }
            
	        if(res2.success){
            	$(".signInNum").html(res2.data);
            }else{
                base.showMsg(res2.msg);
            }
        });
	    
    	$("#btn-signIn").click(function(){
		    
    		Ajax.get("805100",{"userId":userId})
				.then(function(res){
		            if(res.success){
		            	console.log(res.data);
		            	$("#btn-signIn").val("明天再来").addClass("a-qiandao");
		            }else{
		                base.showMsg(res.msg);
		            }
		        })
				
			Ajax.get("805103",{"userId":userId})
				.then(function(res){
		            if(res.success){
		            	$(".signInNum").html(res.data);
		            }else{
		            	
		                base.showMsg(res.msg);
		            }
		        })
    	})
		
		
    }
    
});