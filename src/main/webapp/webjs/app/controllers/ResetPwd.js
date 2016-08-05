define("app/controllers/ResetPwd",[
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

    var nextHandler = "";
    function initView() {
        on(dom.byId("origPassword"), "keyup", getLisFunc("origPassword", 1));
        on(dom.byId("origPassword"), "change",validate_origPassword);
        on(dom.byId("origPassword"), "focus", function(){
            var parent = this.parentNode;
            $(parent).next().css({
                "display": "block"
            });
        });
        on(dom.byId("origPassword"), "blur", function(){
            var parent = this.parentNode;
            $(parent).next().css({
                "display": "none"
            });
        });
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
        nextHandler = on(dom.byId("next"), "click", function(){
            valide();
        });

    }
    function valide() {
        if(validate_origPassword() && validate_password() && validate_repassword()){
            resetPassword();
        }
    }
    function resetPassword() {
        nextHandler.remove();
        $("#next").css("cursor", "default").text("设置中...");
        Ajax.post(Global.baseUrl + '/user/loginpwd/reset',
            {
                "oldLoginPwd": dom.byId("origPassword").value,
                "newLoginPwd": dom.byId("password").value
            })
            .then(function (response) {
                if (response.success) {
                    doSuccess();
                } else {
                    $("#next").css("cursor", "pointer").text("下一步");
                    nextHandler = on(dom.byId("next"), "click", function(){
                        valide();
                    });
                    Tooltip.show(response.msg, dom.byId("next"), 'warning');
                }
            });
    }
    function doSuccess(){
        $(".register_title h4").text("密码重置成功");
        var height = parseInt( $(".register_dialog").css("height") );
        var userCont = $(".register_dialog");
        userCont.css("height", "auto");
        $(".register_content form").html('<div class="tupian" style="height: 155px;"></div>' +
            '<div class="wenzi">恭喜您，密码设置成功！</div>' +
            '<div class="register_btn-wrapper" style="margin: 18px 1px 0 1px;">' +
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
    function validate_origPassword(){
        var elem = dom.byId("origPassword"),
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