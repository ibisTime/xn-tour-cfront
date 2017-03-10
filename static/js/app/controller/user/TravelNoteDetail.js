define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/showImg/showImg',
    'app/module/comment/comment',
    'app/module/scroll/scroll',
    'app/util/dialog'
], function(base, Ajax, loading, showImg, comment, scroll, dialog) {
    var myScroll,
        noteCode = base.getUrlParam("code");
    var width = ( +$(window).width() - 20 ) / 3 - 12;
    var width1 = Math.ceil(width);
    var suffix = '?imageMogr2/auto-orient/thumbnail/!'+width1+'x'+width1+'r',
        start = 1, limit = 10, isEnd = false, isLoading = false;

    init();

    function init() {
        if(noteCode){
            comment.addComment();
            loading.createLoading();
            initIScroll();
            getTravelNote();
            getPageComment();
            addListener();
        }else{
            base.showMsg("为传入游记编号");
        }
    }

    function initIScroll(){
        myScroll = scroll.getInstance().getOnlyDownScroll({
            loadMore: getPageComment
        });
    }

    function getTravelNote(){
        Ajax.get("618132", {
            code: noteCode,
            userId: base.getUserId()
        }).then(function(res){
            if(res.success){
                var data = res.data;
                var pic = data.pic.split(/\|\|/), html = "";
                $.each(pic, function(i, p){
                    html += '<div class="wp33 pt10 plr6 p-r fl">'+
                                '<div class="write-travel-img-wrap" style="height: '+width+'px">'+
                                    '<img src="'+base.getPic(p, suffix)+'" class="center-img">'+
                                '</div>'+
                            '</div>';
                });
                $("#showImgContainer").html(html);
                $("#name").html(data.name);
                $("#description").html(data.description);
                $("#publishDatetime").html(base.formatDate(data.publishDatetime, "yyyy-MM-dd"))
                data.isCollect == "1" ? $("#scIcon").addClass("active") : "";
                data.isLike == "1" ? $("#dzIcon").addClass("active") : "";
                if(data.publisher == base.getUserId())
                    $("#delIcon").show();
                // data.isReport == "1" ? $("#jbIcon").addClass("active") : "";
                myScroll.refresh();
            }else{
                base.showMsg(res.msg);
            }
            loading.hideLoading();
        }, function(){
            base.showMsg("加载失败");
            loading.hideLoading();
        })
    }

    function getPageComment(){
        if( !isEnd && !isLoading ){
            isLoading = true;
            Ajax.get("618315", {
                start: start,
                limit: limit,
                topCode: noteCode,
                status: '1'
            }).then(function(res){
                if(res.success && res.data.list.length){
                    if(res.data.list.length < limit){
                        isEnd = true;
                        base.hidePullUp();
                    }else{
                        base.showPullUp();
                    }
                    var html = "";
                    $.each(res.data.list, function(i, l){
                        html += '<div class="plun-cont-item flex">'+
                            '<div class="plun-left">'+
                                '<div class="plun-left-wrap">'+
                                    '<img class="center-img wp100" src="'+base.getWXAvatar(l.res.userExt.photo)+'" />'+
                                '</div>'+
                            '</div>'+
                            '<div class="plun-right">'+
                                '<div class="plun-right-title">'+l.res.nickname+'</div>'+
                                '<div class="plun-right-cont">'+l.content+'</div>'+
                                '<div class="plun-right-datetime">'+base.formatDate(l.commDatetime, 'yyyy-MM-dd hh:mm')+'</div>'+
                            '</div>'+
                        '</div>';
                    });
                    $("#content").append(html);
                    start++;
                    myScroll.refresh();
                }else{
                    if(start == 1){
                        $("#content").html( '<div class="item-error">暂无相关评论</div>' );
                        myScroll.refresh();
                        isEnd = true;
                    }
                    base.hidePullUp();
                }
                isLoading = false;
            }, function(){
                if(start == 1){
                    $("#content").html( '<div class="item-error">暂无相关评论</div>' );
                    myScroll.refresh();
                    isEnd = true;
                }
                base.hidePullUp();
            });
        }
    }

    function getAddr(data){
        return data.province + (data.city || "") + (data.area || "") + (data.detail || "");
    }

    function addListener() {
        $("#scIcon").on("click", function(){
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            loading.createLoading();
            collectNote();
        });
        $("#dzIcon").on("click", function(){
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            loading.createLoading();
            collectNote(true);
        });
        $("#delIcon").on("click", function () {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            base.confirm("确认删除吗？")
                .then(deleteTravel, base.emptyFun);
        });

        $("#showImgContainer").on("click", ".center-img", function(){
            showImg.createImg($(this).attr("src")).showImg();
        });

        $("#writePlIcon").on("click", function (e) {
            if(!base.isLogin()){
                base.goLogin();
                return;
            }
            comment.showComment({
                type: "4",
                parentCode: noteCode,
                commer: base.getUserId(),
                topCode: noteCode,
                success: function(res){
                    var userInfo = base.getSessionUserInfo();
                    html = '<div class="plun-cont-item flex">'+
                        '<div class="plun-left">'+
                            '<div class="plun-left-wrap">'+
                                '<img class="center-img wp100" src="'+base.getWXAvatar(userInfo.userExt && userInfo.userExt.photo)+'" />'+
                            '</div>'+
                        '</div>'+
                        '<div class="plun-right">'+
                            '<div class="plun-right-title">'+userInfo.nickname+'</div>'+
                            '<div class="plun-right-cont">'+res.content+'</div>'+
                            '<div class="plun-right-datetime">'+(base.formatDate(new Date(), 'yyyy-MM-dd hh:mm'))+'</div>'+
                        '</div>'+
                    '</div>';
                    if( $("#content").find(".item-error").length ){
                        $("#content").html(html);
                    }else{
                        $("#content").prepend(html);
                    }
                    myScroll.refresh();
                },
                error: function(msg){
                    base.showMsg(msg || "评论发布失败");
                }
            });
        });
    }
    function deleteTravel() {
        loading.createLoading();
        Ajax.post("618121", {
            json: {
                code: noteCode,
                userId: base.getUserId()
            }
        }).then(function (res) {
            loading.hideLoading();
            if(res.success){
                base.showMsg("删除成功");
                setTimeout(function () {
                    history.back();
                }, 500);
            }else{
                base.showMsg(res.msg);
            }
        }, function () {
            loading.hideLoading();
            base.showMsg("删除失败");
        });
    }
    //点赞、收藏
    function collectNote(isDz){
        Ajax.post("618320", {
            json: {
                toEntity: noteCode,
                toType: 5,
                type: isDz && 3 || 2,
                interacter: base.getUserId()
            }
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                isDz ? $("#dzIcon").toggleClass("active") :
                       $("#scIcon").toggleClass("active");
            }else{
                base.showMsg(res.msg || "操作失败");
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("操作失败");
        });
    }
    //举报
    function JBNote(remark){
        Ajax.post("618321", {
            json: {
                toEntity: noteCode,
                toType: 5,
                interacter: base.getUserId(),
                remark: remark
            }
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                $("#jbIcon").toggleClass("active");
            }else{
                base.showMsg(res.msg || "举报失败");
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("举报失败");
        });
    }
});
