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
        $("#type").on("change", function () {
            var _self = $(this),
                val = _self.val();

            _self.siblings(".hotel-over-select-text").html( _self.find("option:selected").text() );
            if (val == 1) {
                $("#cont1").show();
                $("#cont2").hide();
            } else {
                $("#cont2").show();
                $("#cont1").hide();
            }
        });
        $("#submit").on("click", function(){
            if($("#compForm").valid()){
                var data = {
                    contact: $("#contact").val()
                };
                var tsContent = $("#tsContent").val();
                var fkContent = $("#fkContent").val();
                var type = $("#type").val();
                if(type == 1 && isEmpty(tsContent)){
                    base.showMsg("投诉信息不能为空");
                    return;
                }
                if(type == 2 && isEmpty(fkContent)){
                    base.showMsg("反馈建议不能为空");
                    return;
                }
                if(type == 1)
                    data.tsContent = tsContent;
                else
                    data.fkContent = fkContent;
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
