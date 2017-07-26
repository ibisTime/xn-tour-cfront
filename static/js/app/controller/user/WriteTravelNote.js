define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/validate/validate',
    'app/module/showImg/showImg',
    'app/module/qiniu/qiniu'
], function(base, Ajax, loading, Validate, showImg, qiniu) {

    var width = ( +$(window).width() - 20 ) / 3 - 12;
    var width1 = Math.ceil(width);
    var suffix = '?imageMogr2/auto-orient/thumbnail/!'+width1+'x'+width1+'r';

    init();

    function init() {
        loading.createLoading();
        if(!base.isLogin()){
            base.goLogin();
            return;
        }
        $("#publisher").val(base.getUserId());
        addListener();
        getListTravelOrder();
        initUpload();
    }
    function getListTravelOrder(){
        Ajax.get("618151", {
            userId: base.getUserId(),
            status: 4
        }).then(function(res){
            loading.hideLoading();
            if(res.success && res.data.length){
                var html = "";
                $.each(res.data, function(i, d){
                    html += '<option value="'+d.lineCode+'">'+d.line.name+'</option>';
                });
                $("#lineCode").html(html).trigger("change");
            }else{
                res.msg && base.showMsg(res.msg);
                $("#travelForm").hide();
                $("#noTravel").show();
            }
        }, function(){
            base.showMsg("线路信息获取失败");
            $("#travelForm").hide();
            $("#noTravel").show();
            loading.hideLoading();
        });
    }
    function initUpload(){
        var showImgContainer = $("#showImgContainer");
        var defaultImg = __inline("../images/default-img.png");
        var closeImg = __inline("../images/close-red.png");
        qiniu.getQiniuToken()
            .then(function(res){
                if(res.success){
                    token = res.data.uploadToken;
                    qiniu.uploadInit({
                        token: token,
                        btnId: "uploadBtn",
                        containerId: "uploadContainer",
                        multi_selection: true,
                        showUploadProgress: function(up, file){
                            // $(".upload-progress").css("width", parseInt(file.percent, 10) + "%");
                            $("#" + file.id).find(".write-progress-wrap").show()
                                .find(".write-progress-up").css("width", parseInt(file.percent, 10) + "%");
                        },
                        fileAdd: function(file, up){
                            showImgContainer.show();
                            var imgCtn = $('<div class="wp33 pt10 plr6 p-r fl" id="'+file.id+'">'+
                                                '<div class="write-travel-img-wrap" style="height: '+width+'px">'+
                                                    '<img src="'+defaultImg+'" class="center-img wp100 hp100">'+
                                                '</div>'+
                                                '<div class="w-travel-close-wrap">'+
                                                    '<img src="'+closeImg+'" class="shan1">'+
                                                '</div>'+
                                                '<div class="write-progress-wrap"><div class="write-progress-up"></div></div>'+
                                            '</div>').appendTo(showImgContainer);
                            (function(imgCtn, id){
                                imgCtn.find('.w-travel-close-wrap').on('click', function (e) {
                                    up.removeFile(file);
                                    if(showImgContainer.find(".w-travel-close-wrap").length == 1){
                                        showImgContainer.hide();
                                    }
                                    var key = $("#" + id).find(".center-img").attr("data-src");
                                    var pic = $("#pic").val();
                                    pic = pic.split(/\|\|/);
                                    for(var i = 0; i < pic.length; i++){
                                        if(pic[i] == key){
                                            pic.splice(i, 1);
                                            break;
                                        }
                                    }
                                    $("#pic").val(pic);
                                    imgCtn.remove();
                                });
                            })(imgCtn, file.id)
                        },
                        fileUploaded: function(up, url, key, file){
                            $("#" + file.id).find(".write-progress-wrap").hide()
                                .end().find(".center-img").attr("src", url + suffix)
                                .attr("data-src", key).removeClass("hp100 wp100");
                            var pic = $("#pic").val();
                            if(pic)
                                pic = pic + '||' + key;
                            else
                                pic = key;
                            $("#pic").val(pic).valid();
                        }
                    });
                }else{
                    base.showMsg(res.msg || "token获取失败");
                }
            }, function(){
                base.showMsg("token获取失败");
            })
    }

    function addListener() {
        $("#travelForm").validate({
            'rules': {
                lineCode: {
                    required: true
                },
                name: {
                    required: true,
                    maxlength: 32,
                    isNotFace: true
                },
                pic: {
                    required: true
                },
                description: {
                    required: true,
                    isNotFace: true
                }
            }
        });
        $("#showImgContainer").on("click", ".center-img", function(){
            showImg.createImg($(this).attr("src")).showImg();
        });
        $("#submitBtn").on("click", function(){
            if($("#travelForm").valid()){
                applyTravelNote();
            }
        });
        $("#lineCode").on("change", function(){
            var _self = $(this);
            _self.siblings(".over-select-text").html( _self.find("option:selected").text() );
        });
        $("#description").on("keyup", function(){
            var val = $(this).val();
            if(!val)
                $("#noTextarea").show();
            else
                $("#noTextarea").hide();
        });
    }

    function applyTravelNote(){
        loading.createLoading("上传中...");
        var data = $("#travelForm").serializeObject();
        Ajax.post("618120", {
            json: data
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                location.href = './travel-note-list.html';
            }else{
                base.showMsg(res.msg);
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("游记发布失败");
        })
    }
});
