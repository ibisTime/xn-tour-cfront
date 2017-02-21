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
                    base.showMsg("xxx");
                    return;
                }
                data.commiter = base.getUserId();
                Ajax.post("618200", {
                    json: data
                }).then(function(res){
                    if(res.success){
                        // history.back();
                    }else{
                        // 
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