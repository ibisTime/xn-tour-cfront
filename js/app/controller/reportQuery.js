define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	
	if(!base.getUserId()){
		location.href="user/login.html"
	}
	
	var userId = base.getUserId();
	
	$("#rQ-balance").on('click', function(){
		location.href = "bill.html"
	});
	
	$.when(
		Ajax.get("802503",{"userId":userId}),
		Ajax.get("618053",{"ownerId":userId})
	).then(function(res1,res2){
		if (res1.success && res2.success) {
        	
	        amount1 = res1.data[0].amount;//
	        amount2 = res2.data[0].amount;//
	        amount3 = amount2 - amount1;//
	           
	        $(".rQ-incomeNum").html(amount2);
	        $(".rQ-balanceNum").html(amount1);
	        $(".rQ-setNum").html(amount3);
	        
        } else {
            base.showMsg(res1.msg);
        }
		
	})
	
});
