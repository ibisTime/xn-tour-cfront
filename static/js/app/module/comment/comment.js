define([
    'jquery',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/util/dialog',
], function ($, Ajax, loading, dialog) {
    var tmpl = __inline("comment.html");
    var css = __inline("comment.css");
    var first = true;
    var defaultOpt = {};
    init();
    function init(){
        $("head").append('<style>'+css+'</style>');
    }

    function _publishPl(){
        Ajax.post("618310", {
            json: {
                type: defaultOpt.type,
                content: defaultOpt.content,
                parentCode: defaultOpt.parentCode,
                commer: defaultOpt.commer,
                topCode: defaultOpt.topCode
            }
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                defaultOpt.success && defaultOpt.success({
                    "content": defaultOpt.content
                });
            }else{
                defaultOpt.error && defaultOpt.error(res.msg);
            }
            obj.hideComment();
        }, function(err){
            loading.hideLoading();
            obj.hideComment();
            defaultOpt.error && defaultOpt.error('评论发布失败');
        });
    }
    function _addListener(){
        $("#cancelPl").on("click", function (e) {
            obj.hideComment();
        });
        var $err1 = $(".fbplun-cont-area-error-tip1");
        var $err2 = $(".fbplun-cont-area-error-tip2");
        $("#publishPl").on("click", function (e) {
            var cont = $("#plunCont").val();
            if(!cont || cont.trim() == ""){
                // $err1.hide();
                // $err2.show();
                _showMsg("评论不能为空");
                return;
            }
            if(!_isNotFace(cont)){
                // $err1.show();
                // $err2.hide();
                _showMsg("评论不能包含特殊字符");
                return;
            }
            defaultOpt.content = cont;
            loading.createLoading("发布中...");
            _publishPl();
        });
        var $tip = $(".fbplun-cont-area-tip");
        $("#plunCont").on("keyup", function(){
            var _self = $(this), val = _self.val();
            if(val) 
                $tip.hide();
            else 
                $tip.show();
        });
    }
    function _showMsg(msg, time) {
        var d = dialog({
            content: msg,
            quickClose: true
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, time || 1500);
    }
    function _isNotFace(value) {
        var pattern = /^[\s0-9a-zA-Z\u4e00-\u9fa5\u00d7\u300a\u2014\u2018\u2019\u201c\u201d\u2026\u3001\u3002\u300b\u300e\u300f\u3010\u3011\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff0d\uff03\uffe5\x21-\x7e]*$/;
        return pattern.test(value);
    }
    var obj = {
        addComment: function () {
            if(!this.hasComment()){
                var temp = $(tmpl);
                $("body").append(tmpl);
                _addListener();
            }
            return this;
        },
        hasComment: function(){
            var cont = $("#fbplunWrap");
            if(!cont.length)
                return false
            return true;
        },
        showComment: function (option){
            if(!this.hasComment())
                this.addComment();
            option = option || {};
            defaultOpt = $.extend(defaultOpt, option);
            var plunCont = $("#fbplunWrap");
            plunCont.show().animate({
                top: 0
            }, 200);
            return this;
        },
        hideComment: function (option){
            if(this.hasComment()){
                var plunCont = $("#fbplunWrap");
                plunCont.animate({
                    top: '100%'
                }, 200, function(){
                    $("#plunCont").val("");
                    plunCont.hide();
                });
            }
            return this;
        }
    };
    return obj;
});