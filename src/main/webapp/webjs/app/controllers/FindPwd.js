define("app/controllers/FindPwd",[
    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/query',
    'app/common/Ajax',
    'app/common/Global',
    'app/controllers/Helper',
    'app/ux/GenericTooltip',
    'app/jquery/$',
    'dojo/domReady!'
], function(dom, domStyle, domClass, domConstruct, on, query, Ajax, Global, Helper, Tooltip, J) {

    var handleSend = {}, count = 1;
    function initView() {
        on(dom.byId("mobile"),"keyup", getLisFunc("mobile", 2));
        on(dom.byId("mobile"), "change", validate_mobile);
        on(dom.byId("verification"), "keyup", getLisFunc("verification", 1));
        on(dom.byId("verification"), "change",validate_verification);
        on(dom.byId("password"), "keyup", getLisFunc("password", 1));
        on(dom.byId("password"), "change", validate_password);
        on(dom.byId("password"), "focus", function(){
            var parent = this.parentNode;
            $(parent).next().css({
                "display": "block"
            });
        });
        on(dom.byId("password"), "blur", function(){
            var parent = this.parentNode;
            $(parent).next().css({
                "display": "none"
            });
        });
        on(dom.byId("repassword"), "keyup", getLisFunc("repassword", 1));
        on(dom.byId("repassword"), "change", validate_repassword);
        on(dom.byId("repassword"), "focus", function(){
            var parent = this.parentNode;
            $(parent).next().css({
                "display": "block"
            });
        });
        on(dom.byId("repassword"), "blur", function(){
            var parent = this.parentNode;
            $(parent).next().css({
                "display": "none"
            });
        });
        on(dom.byId("next"), "click", function(){
            count = 1;
            valide();
        });

    }
    function handleSendVerifiy() {
        Ajax.post(Global.baseUrl + '/gene/findloginpwd/send',
            {
                "mobile": dom.byId("mobile").value
            }).then(function (response) {

            var parent = dom.byId("verification").parentNode;
            if (response.success) {
                domStyle.set(dom.byId("getVerification"), {
                    cursor: "no-drop"
                });
                $(dom.byId("getVerification")).addClass("cancel-send");
                for(var i = 0; i <= 60; i++){
                    (function (i) {
                        setTimeout(function(){
                            if(i < 60){
                                dom.byId("getVerification").innerHTML = (60 - i) + "s";
                            }else{
                                dom.byId("getVerification").innerHTML = "获取验证码";
                                domStyle.set(dom.byId("getVerification"), {
                                    cursor: "pointer"
                                });
                                $(dom.byId("getVerification")).removeClass("cancel-send");
                                handleSend = on.once(dom.byId("getVerification"), "click", handleSendVerifiy);
                            }
                        }, 1000*i);
                    })(i);
                }
            } else {
                handleSend = on.once(dom.byId("getVerification"), "click", handleSendVerifiy);
                var span = $(parent).find("span.warning")[2];
                span.style.display = "block";
                fadeOut(span);
            }
        });
    }
    function checkMobile (){
        Ajax.post(Global.baseUrl + '/user/mobile/check',
            {"loginName": dom.byId("mobile").value})
            .then(function (response) {
                var parent = dom.byId("mobile").parentNode;
                if (!response.success) {
                    var $success = $($(parent).find("span.success")[0]);
                    $success.fadeIn(300);
                    isReady(findPassword);
                } else {
                    var span = $(parent).find("span.warning")[2];
                    span.style.display = "block";
                    fadeOut(span);
                }
            });
    }
    function isReady(func) {
        if(!--count){
            func();
        }
    }
    function valide() {
        if(validate_verification() && validate_mobile()
            && validate_password() && validate_repassword()){
            checkMobile();
        }
    }
    function findPassword() {
        Ajax.post(Global.baseUrl + '/user/loginpwd/find',
            {
                "mobile": dom.byId("mobile").value,
                "smsCaptcha": dom.byId("verification").value,
                "newLoginPwd": dom.byId("password").value
            })
            .then(function (response) {
                var parent = dom.byId("mobile").parentNode;
                if (response.success) {
                    doSuccess();
                } else {
                    Tooltip.show(response.msg, dom.byId("next"), 'warning');
                }
            });
    }
    function doSuccess(){
        $(".register_title h4").text("密码重置成功");
        var height = parseInt( $(".register_dialog").css("height") );
        var userCont = $(".register_dialog");
        userCont.css("height", "auto");
        $(".register_content form").html('<div class="tupian"></div>' +
            '<div class="wenzi">恭喜您，密码设置成功！</div>' +
            '<div class="register_btn-wrapper">' +
            '<div class="register_btn register_btn-primary btnshezhi">' +
            '<a href="'+Global.baseUrl+'/home/index.htm">重回首页</a></div></div>');
        var finalHeight = parseInt( $(".register_dialog").css("height") );
        userCont.css("height", height + "px");
        var k = (finalHeight - height) / 10;
        for(var i = 1; i <= 10; i++){
            (function (i) {
                setTimeout(function(){
                    i < 10 ? domStyle.set(userCont, {
                        "height": (height + k * i) + "px"
                    }) : domStyle.set(userCont, {
                        "height": finalHeight + "px"
                    });
                }, i * 20);
            })(i);
        }
    }
    function getLisFunc(id, i){
        return function (e){
            var elem = dom.byId(id),
                keyCode = e.charCode || e.keyCode,
                placeholder = elem.parentNode.getElementsByTagName("span")[i];
            elem.value != "" ? ( placeholder.style.display = "none" )
                : placeholder.style.display = "block";
            if(keyCode == 13){
                valide();
            }
        }
    }
    function validate_verification(){
        var elem = dom.byId("verification"),
            parent = elem.parentNode,
            span;
        if(elem.value == ""){
            span = $(parent).find("span.warning")[0];
            span.style.display = "block";
            fadeOut(span);
            return false;
        }else if(!/^[\d]{4}$/.test(elem.value)){
            span = $(parent).find("span.warning")[1];
            span.style.display = "block";
            fadeOut(span);
            return false;
        }
        return true;
    }
    function validate_mobile(){
        var elem = dom.byId("mobile"),
            parent = elem.parentNode,
            span;
        handleSend.remove && handleSend.remove();
        if(elem.value == ""){
            span = $(parent).find("span.warning")[0];
            span.style.display = "block";
            fadeOut(span);
            return false;
        }else if(!/^1[3,4,5,7,8]\d{9}$/.test(elem.value)){
            span = $(parent).find("span.warning")[1];
            span.style.display = "block";
            fadeOut(span);
            return false;
        }
        if(!$(dom.byId("getVerification")).hasClass("cancel-send")){
            handleSend.remove && handleSend.remove();
            handleSend = on.once(dom.byId("getVerification"), "click", handleSendVerifiy);
        }
        return true;
    }
    function validate_password(){
        var elem = dom.byId("password"),
            parent = elem.parentNode,
            myreg = /^[^\s]{6,16}$/,
            span;
        if(elem.value == ""){
            span = $(parent).find("span.warning")[0];
            span.style.display = "block";
            fadeOut(span);
            return false;
        }else if(!myreg.test(elem.value)){
            span = $(parent).find("span.warning")[1];
            span.style.display = "block";
            fadeOut(span);
            return false;
        }
        return true;
    }
    function validate_repassword(){
        var elem1 = dom.byId("password"),
            elem2 = dom.byId("repassword"),
            parent = elem2.parentNode,
            span;
        if(elem2.value == ""){
            span = $(parent).find("span.warning")[0];
            span.style.display = "block";
            fadeOut(span);
            return false;
        }else if(elem2.value !== elem1.value){
            span = $(parent).find("span.warning")[1];
            span.style.display = "block";
            fadeOut(span);
            return false;
        }
        return true;
    }
    function setOpacity(elem, level) {
        if (elem.filters) {
            elem.style.filters = 'alpha(opacity=' + level + ')';
        } else {
            elem.style.opacity = level / 100;
        }
    }
    function fadeOut(elem) {
        setOpacity(elem, 1);
        for (var i = 0; i <= 100; i += 5) {
            (function (i) {
                var pos = i;
                setTimeout(function () {
                    setOpacity(elem, 100 - pos);
                }, (pos + 1) * 30)
            })(i);
        }
    }
    return {
        init: function() {
            initView();
        }
    }
});