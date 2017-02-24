define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/validate/validate',
    'app/module/loading/loading'
], function(base, Ajax, Validate, loading) {

	init();
	function init(){
		// loading.createLoading();
        addListener();
		
	}
    function addListener() {
        $("#compForm").validate({
            'rules': {
                contact: {
                    required: true,
                    mm: true
                },
                tsContent: {
                    maxlength: 255,
                    isNotFace: true
                },
                fkContent: {
                    maxlength: 255,
                    isNotFace: true
                }
            },
            onkeyup: false
        });
        //
        $("#tsContent, #fkContent").on('keyup', function(){
            var _self = $(this);
            var val = _self.val();
            _self.siblings(".complain-tip")[val ? "hide": "show"]();
        });
        $("#submit").on("click", function(){
            if($("#compForm").valid()){
                var data = $("#compForm").serializeObject();
                if(isEmpty(data.tsContent) && isEmpty(data.fkContent)){
                    base.showMsg("投诉或反馈意见不能为空");
                    return;
                }
                data.commiter = base.getUserId();
                Ajax.post("618200", {
                    json: data
                }).then(function(res){
                    if(res.success){
                        console.log("提交成功！")
                        base.showMsg("提交成功！");
                        //history.back();
                    }else{
                       base.showMsg("网络原因提交失败!");
                          
                    }
                });
            }
        });
    }

    function isEmpty(val){
        if(!val || val.trim() == "")
            return true;
        return false;
    }
	 
});