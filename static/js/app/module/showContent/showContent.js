define([
    'jquery',
    'app/module/loading/loading',
    'app/util/ajax'
], function ($, loading, Ajax) {
    var tmpl = __inline("showContent.html");
    var css = __inline("showContent.css");
    var defaultOpt = {};
    var first = true;
    init();
    function init(){
        $("head").append('<style>'+css+'</style>');
    }
    function getContent(){
        loading.createLoading("绑定中...");
        Ajax.post(defaultOpt.bizType, {
            json: defaultOpt.param
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                $("#showContent-cont").html(res.data[defaultOpt.key]);
            }else{
                defaultOpt.error && defaultOpt.error(res.msg);
            }
        }, function(){
            loading.hideLoading();
            defaultOpt.error && defaultOpt.error("内容获取失败");
        });
    }
    var ShowContent = {
        addCont: function (option) {
            option = option || {};
            defaultOpt = $.extend(defaultOpt, option);
            if(!this.hasCont()){
                var temp = $(tmpl);
                $("body").append(tmpl);
            }
            var wrap = $("#showContentWrap");
            defaultOpt.title && wrap.find(".right-left-cont-title-name").html(defaultOpt.title);
            var that = this;
            if(first){
                wrap.find(".right-left-cont-title")
                    .on("touchmove", function(e){
                        e.preventDefault();
                    });
            }
            first = false;
            return this;
        },
        hasCont: function(){
            if(!$("#showContentWrap").length)
                return false
            return true;
        },
        showCont: function (){
            if(this.hasCont()){
                var wrap = $("#showContentWrap");
                wrap.css("top", $(window).scrollTop()+"px");
                wrap.show().animate({
                    left: 0
                }, 200);                
            }
            return this;
        },
        hideCont: function (func){
            if(this.hasCont()){
                var wrap = $("#showContentWrap");
                wrap.animate({
                    left: "100%"
                }, 200, function () {
                    wrap.hide();
                });
            }
            return this;
        }
    }
    return ShowContent;
});