define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/validate/validate',
    'app/module/qiniu/qiniu',
    'app/module/smsCaptcha/smsCaptcha',
], function(base, Ajax, loading, Validate, qiniu, smsCaptcha) {
	var token, nickname, mobile, bizType = "805153", identityFlag;
	init();
	function init(){
		loading.createLoading();
		base.getUser()
			.then(function(res){
				loading.hideLoading();
				if(res.success){
					$("#showAvatar").attr("src", base.getWXAvatar(res.data.userExt.photo));
					nickname = res.data.nickname;
					$("#nick").html(nickname);
					if(mobile = res.data.mobile){
						$("#mobileName").text("修改手机号");
						$("#mobileAction").find(".right-left-cont-title-name").text("修改手机号");
						bizType = "805047";
					}
					identityFlag = res.data.identityFlag;
					if( identityFlag != "0"){
						$("#identityFlag").text("已绑定");
						$("#idNo").val(res.data.idNo).attr("disabled", "disabled");
						$("#realName").val(res.data.realName).attr("disabled", "disabled");
						$("#authenticationBtn").parent().hide();
					}else{
						$("#identityFlag").text("未绑定");
					}
					addListener();
					initUpload();
				}else{
					base.showMsg(res.msg || "用户信息获取失败");
				}
			}, function(){
				base.showMsg("用户信息获取失败");
			});
	}

	function addListener(){
		$("#nickWrap").on("click", function(){
			showLeft2Right($("#nicknameChange"), function(){
				$("#nickname").val(nickname);
			});
		});
		$("#nickBack").on("click", function(){
			hideLeft2Right($("#nicknameChange"));
		});
		$("#nicknameForm").validate({
            'rules': {
                nickname: {
                    required: true,
                    maxlength: 32,
                    isNotFace: true
                }
            },
            onkeyup: false
        });
        $("#changeNick").on("click", function(){
        	if($("#nicknameForm").valid()){
        		changeNickName();
        	}
        });
        $("#mobileBack").on("click", function(){
			hideLeft2Right($("#mobileAction"));
		});
		$("#mobileWrap").on("click", function(){
			showLeft2Right($("#mobileAction"));
		});
        smsCaptcha.init({
            checkInfo: function () {
                return $("#mobile").valid();
            },
            bizType: bizType
        });
        $("#mobileBtn").on("click", function(){
        	if($("#mobileForm").valid()){
        		if(mobile){
        			changeMobile();
        		}else{
        			bindMobile();
        		}
        	}
        });
        $("#mobileForm").validate({
            'rules': {
                mobile: {
                    required: true,
                    mobile: true
                },
                smsCaptcha: {
                	sms: true,
                	required: true
                }
            },
            onkeyup: false
        });

        $("#identityWrap").on("click", function(){
			showLeft2Right($("#authentication"));
		});
		$("#authenticationBack").on("click", function(){
			hideLeft2Right($("#authentication"));
		});
		$("#authenticationForm").validate({
            'rules': {
                realName: {
                    required: true,
                    maxlength: 32,
                    isNotFace: true
                },
                idNo: {
                	required: true,
                	isIdCardNo: true
                }
            },
            onkeyup: false
        });
        $("#authenticationBtn").on("click", function(){
        	if($("#authenticationForm").valid()){
        		identity();
        	}
        });
	}
	function identity(){
		loading.createLoading("认证中...");
		var data = $("#authenticationForm").serializeObject();
		data.idKind = 1;
		data.userId = base.getUserId();
		Ajax.post("805044", {
			json: data
		}).then(function(res){
			loading.hideLoading();
			if(res.success){
				hideLeft2Right($("#authenticationForm"), function(){
					identityFlag = true;
					$("#authenticationBtn").parent().hide();
					$("#identityFlag").text("已绑定");
					$("#realName, #idNo").attr("disabled", "disabled");
				});
			}else{
				base.showMsg(res.msg);
			}
		}, function(){
			base.showMsg("实名认证失败");
			loading.hideLoading();
		});
	}
	function changeMobile(){
		loading.createLoading("修改中...");
		Ajax.post("805047", {
			json: {
	            "newMobile": $("#mobile").val(),
	            "smsCaptcha": $("#smsCaptcha").val(),
	            "tradePwd": "111111",
	            "userId": base.getUserId()
	        }
		}).then(function(res){
			loading.hideLoading();
			if(res.success){
				hideLeft2Right($("#mobileAction"), function(){
					mobile = $("#mobile").val();
					$("#mobile").val("");
					$("#smsCaptcha").val("");
				});
			}else{
				base.showMsg(res.msg);
			}
		}, function(){
			base.showMsg("手机号修改失败");
			loading.hideLoading();
		});
	}
	function bindMobile(){
		loading.createLoading("绑定中...");
		Ajax.post("805153", {
			json: {
	            "mobile": $("#mobile").val(),
	            "smsCaptcha": $("#smsCaptcha").val(),
	            "userId": base.getUserId()
	        }
		}).then(function(res){
			loading.hideLoading();
			if(res.success){
				$("#mobileName").text("修改手机号");
				hideLeft2Right($("#mobileAction"), function(){
					mobile = $("#mobile").val();
					$("#mobile").val("");
					$("#smsCaptcha").val("");
					$("#mobileAction").find(".right-left-cont-title-name").text("修改手机号");
					bizType = "805047";
					smsCaptcha.init({
			            checkInfo: function () {
			                return $("#mobile").valid();
			            },
			            bizType: bizType,
			            id: 'smsCaptcha'
			        });
				});
			}else{
				base.showMsg(res.msg);
			}
		}, function(){
			base.showMsg("手机号绑定失败");
			loading.hideLoading();
		});
	}
	function changeNickName(){
		loading.createLoading("修改中...");
		nickname = $("#nickname").val();
		Ajax.post("805075", {
			json: {
				nickname: nickname,
				userId: base.getUserId()
			}
		}).then(function(res){
			loading.hideLoading();
			if(res.success){
				hideLeft2Right($("#nicknameChange"), function(){
					$("#nick").html(nickname);
				});
			}else{
				base.showMsg(res.msg);
			}
		}, function(){
			base.showMsg("昵称修改失败");
			loading.hideLoading();
		});
	}
	function showLeft2Right(cont, afterFn){
		cont.show()
			.animate({
	            left: 0
	        }, 200, function(){
	        	afterFn && afterFn();
	        });
	}
	function hideLeft2Right(cont, afterFn){
		cont.animate({
            left: "100%"
        }, 200, function () {
            cont.hide();
            afterFn && afterFn();
        });
	}

	function initUpload(){
		qiniu.getQiniuToken()
			.then(function(res){
				if(res.success){
					token = res.data.uploadToken;
					qiniu.uploadInit({
						token: token,
						btnId: "uploadBtn",
						containerId: "uploadContainer",
						multi_selection: false,
						showUploadProgress: function(up, file){
							$(".upload-progress").css("width", parseInt(file.percent, 10) + "%");
						},
						fileAdd: function(file){
							$(".upload-progress-wrap").show();
						},
						fileUploaded: function(up, url, key){
							$(".upload-progress-wrap").hide().find(".upload-progress").css("width", 0);
							loading.createLoading("上传中...");
							uploadAvatar(url, key);
						}
					});
				}else{
					base.showMsg(res.msg || "token获取失败");
				}
			}, function(){
				base.showMsg("token获取失败");
			})
	}
	function uploadAvatar(url, photo){
		Ajax.post("805077", {
			json: {
				"userId": base.getUserId(),
				"photo": photo
			}
		}).then(function(res){
			loading.hideLoading();
			if(!res.success){
				base.showMsg(res.msg);
			}else{
				$("#showAvatar").attr("src", url);
			}
		}, function(){
			loading.hideLoading();
		});
	}
});