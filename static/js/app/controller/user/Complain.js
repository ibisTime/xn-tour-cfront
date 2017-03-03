define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/validate/validate',
    'app/module/loading/loading'
], function(base, Ajax, Validate, loading) {

	init();
	function init(){
        addListener();
	}
    function addListener() {
        $.validator.setDefaults({
            errorPlacement: function(error, element) {
                if(element[0].id == "contact"){
                    error.insertAfter(element);
                }else{
                    error.css({
                        top: "8px"
                    }).insertAfter(element.parent());
                }
            }
        });
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
            }
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
                        base.showMsg("提交成功！");
                        setTimeout(function () {
                            history.back();
                        }, 500);
                    }else{
                       base.showMsg(res.msg);
                    }
                }, function () {
                    base.showMsg("信息提交失败");
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