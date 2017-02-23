define([
    'jquery',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loading/loading'
], function($, Ajax, dialog, loading) {

    if (Number.prototype.toFixed) {
        var ori_toFixed = Number.prototype.toFixed;
        Number.prototype.toFixed = function() {
            var num = ori_toFixed.apply(this, arguments);
            if (num == 0 && num.indexOf('-') == 0) { // -0 and 0
                num = num.slice(1);
            }
            return num;
        }
    }

    String.prototype.temp = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    Date.prototype.format = function(format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };

    $.prototype.serializeObject = function() {
        var a, o, h, i, e;
        a = this.serializeArray();
        o = {};
        h = o.hasOwnProperty;
        for (i = 0; i < a.length; i++) {
            e = a[i];
            if (!h.call(o, e.name)) {
                o[e.name] = e.value;
            }
        }
        return o;
    };
    //获取全国所有城市信息
    function getRealLocation(initFun, province, city, area, longitude, latitude, errFun) {
        Base.getAddress()
            .then(function(data) {
                citylist = data.citylist;
                var html = "",
                    k = 0;
                //遍历省
                $.each(citylist, function(i, prov) {
                    if(Base.isAddrEqual(prov.p, province)){
                        province = prov.p;
                        $.each(prov.c, function(j, c) {
                            //如果是当前定位的位置，则显示并保存到session中
                            if (Base.isAddrEqual(c.n, city)) {
                                city = c.n;
                                if(c.a && c.a[0].s && area){
                                    $.each(c.a, function (k, a) {
                                        if(Base.isAddrEqual(a.s, area)){
                                            area = a.s;
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
                loading.hideLoading();
                if(!province){
                    Base.showMsg("定位失败");
                    errFun && errFun();
                }else{
                    //直辖市
                    if(area == ""){
                        area = city;
                        city = province;
                    }
                    sessionStorage.setItem("province", province);
                    sessionStorage.setItem("city", city);
                    sessionStorage.setItem("area", area);
                    sessionStorage.setItem("longitude", longitude);
                    sessionStorage.setItem("latitude", latitude);

                    initFun();
                }
            });
    }

    var Base = {
        encodeInfo: function(info, headCount, tailCount, space) {
            headCount = headCount || 0;
            tailCount = tailCount || 0;
            info = info.trim();
            var header = info.slice(0, headCount),
                len = info.length,
                tailer = info.slice(len - tailCount),
                mask = '**************************************************', // allow this length
                maskLen = len - headCount - tailCount;
            if (space) {
                mask = '**** **** **** **** **** **** **** **** **** **** **** ****';
            }
            return maskLen > 0 ? (header + mask.substring(0, maskLen + (space ? maskLen / 4 : 0)) + (space ? ' ' : '') + tailer) : info;
        },
        formatDate: function(date, format){
            return date ? new Date(date).format(format) : "--";
        },
        getImg: function(pic){
            return pic ? (PIC_PREFIX + pic + THUMBNAIL_SUFFIX) : "";
        },
        getUrlParam: function(name, locat) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = (locat || window.location.search).substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]);
            return '';
        },
        findObj: function(array, key, value, key2, value2) {
            var i = 0,
                len = array.length,
                res;
            for (i; i < len; i++) {
                if (array[i][key] == value && !key2) {
                    return array[i];
                } else if (key2 && array[i][key] == value && array[i][key2] == value2) {
                    return array[i];
                }
            }
        },
        formatMoney: function(s, t) {
            return $.isNumeric(s) ? (+s / 1000).toFixed(t || 2) : "--";
        },
        fZeroMoney: function(s) {
            if(!$.isNumeric(s))
                return 0;
            s = +s / 1000;
            return s.toFixed(0);
        },
        getDictList: function(type){
            return Ajax.get("807706", {
                parentKey: type
            });
        },
        calculateSecurityLevel: function(password) {
            var strength_L = 0;
            var strength_M = 0;
            var strength_H = 0;

            for (var i = 0; i < password.length; i++) {
                var code = password.charCodeAt(i);
                // 数字
                if (code >= 48 && code <= 57) {
                    strength_L++;
                    // 小写字母 大写字母
                } else if ((code >= 65 && code <= 90) ||
                    (code >= 97 && code <= 122)) {
                    strength_M++;
                    // 特殊符号
                } else if ((code >= 32 && code <= 47) ||
                    (code >= 58 && code <= 64) ||
                    (code >= 94 && code <= 96) ||
                    (code >= 123 && code <= 126)) {
                    strength_H++;
                }
            }
            // 弱
            if ((strength_L == 0 && strength_M == 0) ||
                (strength_L == 0 && strength_H == 0) ||
                (strength_M == 0 && strength_H == 0)) {
                return "1";
            }
            // 强
            if (0 != strength_L && 0 != strength_M && 0 != strength_H) {
                return "3";
            }
            // 中
            return "2";
        },
        calculateDays: function(start, end){
            if(!start || !end)
                return 0;
            start = new Date(start);
            end = new Date(end);
            return (end - start) / (3600 * 24 * 1000);
        },
        isAddrEqual: function(name1, name2){
            return name1 == name2 || name2.indexOf(name1) != -1 || name1.indexOf(name2) != -1 || false
        },
        getPic: function(pic, suffix){
            if(pic){
                pic = pic.split(/\|\|/)[0];
            }
            if(!/^http/i.test(pic)){
                pic = PIC_PREFIX + pic + (suffix || THUMBNAIL_SUFFIX);
            }
            return pic;
        },
        getAvatar: function(pic){
            var defaultAvatar = __inline("../images/default-avatar.png");
            return pic ? (PIC_PREFIX + pic + THUMBNAIL_SUFFIX) : defaultAvatar;
        },
        getWXAvatar: function(pic){
            var defaultAvatar = __inline("../images/default-avatar.png");
            var suffix = '?imageMogr2/auto-orient/thumbnail/!65x65r';
            if(!pic){
                pic = defaultAvatar;
            }else if(!/^http/i.test(pic)){
                pic = PIC_PREFIX + pic + suffix;
            }
            return pic;
        },
        initLocation: function initLocation(initFun, errFun) {
            var province = sessionStorage.getItem("province") || "",
                city = sessionStorage.getItem("city") || "",
                area = sessionStorage.getItem("area") || "",
                longitude = sessionStorage.getItem("longitude", longitude),
                latitude = sessionStorage.getItem("latitude", latitude);

            if (!province) {
                loading.createLoading("定位中...");
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        var geoc = new BMap.Geocoder();
                        geoc.getLocation(r.point, function(rs){
                            var addComp = rs.addressComponents;
                            province = addComp.province || "";
                            city = addComp.city || "";
                            area = addComp.district || "";
                            longitude = r.point.lng;
                            latitude = r.point.lat;
                            if(province == city){
                                city = area;
                                area = "";
                            }
                            //百度地图的城市名称可能和oss存的名称不同，需要匹配出相同的名称
                            getRealLocation(initFun, province, city, area, longitude, latitude, errFun);
                        });  
                    } else {
                        loading.hideLoading();
                        Base.showMsg("定位失败");
                        errFun && errFun();
                    }
                }, { enableHighAccuracy: true });
            }else{
                initFun();
            }
        },
        //获取地址json
        getAddress: function() {
            var addr = localStorage.getItem("addr");
            if (addr) {
                var defer = jQuery.Deferred();
                addr = $.parseJSON(addr);
                if (!addr.citylist) {
                    addr = $.parseJSON(addr);
                }
                defer.resolve(addr);
                return defer.promise();
            } else {
                return Ajax.get1("/static/js/lib/city.min.json")
                    .then(function(res) {
                        if (res.citylist) {
                            localStorage.setItem("addr", JSON.stringify(res));
                            return res;
                        }
                        localStorage.setItem("addr", JSON.stringify(res));
                        return $.parseJSON(res);
                    });
            }
        },
        getModelMenu: function(l){
            return Ajax.get("806051", {
                type: "3",
                parentCode: "0",
                location: l,
            });
        },
        getDomain: function() {
            return location.origin;
        },
        isNotFace: function(value) {
            var pattern = /^[\s0-9a-zA-Z\u4e00-\u9fa5\u00d7\u300a\u2014\u2018\u2019\u201c\u201d\u2026\u3001\u3002\u300b\u300e\u300f\u3010\u3011\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff0d\uff03\uffe5\x21-\x7e]*$/;
            return pattern.test(value)
        },
        showMsg: function(msg, time) {
            var d = dialog({
                content: msg,
                quickClose: true
            });
            d.show();
            setTimeout(function() {
                d.close().remove();
            }, time || 1500);
        },
        makeReturnUrl: function(param) {
            var url = location.pathname + location.search;
            if(param){
                var str = "";
                for(var n in param){
                    str += "&" + n + "=" + param[n];
                }
                if(/\?/i.test(url)){
                    url = url + str;
                }else{
                    url = url + "?" + str.substr(1, str.length);
                }
            }
            return encodeURIComponent(url);
        },
        getReturnParam: function() {
            var re = Base.getUrlParam("return");
            if (re) {
                return encodeURIComponent(re);
            }
            return "";
        },
        goBackUrl: function(url, isLoginBack) {
            var rUrl = Base.getUrlParam("return");
            if(isLoginBack){
                var returnUrl = sessionStorage.getItem("l-return");
                sessionStorage.removeItem("l-return");
                location.href = returnUrl || url || "../user/user.html";
            }else{
                if (rUrl) {
                    location.href = rUrl;
                } else {
                    location.href = url || "../index.html";
                }
            }
            
        },
        addIcon: function() {
            var icon = sessionStorage.getItem("icon");
            if (icon && icon != "undefined") {
                $("head").append('<link rel="shortcut icon" type="image/ico" href="' + icon + '">');
            }
        },
        isLogin: function() {
            return !!sessionStorage.getItem("user");
        },
        getUser: function(refresh) {
            return Ajax.get("805056", {
                userId: Base.getUserId()
            }, !refresh)
                .then(function(res){
                    if(res.success){
                        Base.setSessionUserInfo(res.data);
                    }
                    return res;
                }, function(res){
                    return res;
                });
        },
        getUserId: function() {
            return sessionStorage.getItem("user") || "";
        },
        setSessionUser: function(res) {
            sessionStorage.setItem("user", res.data.userId);
            sessionStorage.setItem("tk", res.data.token);
        },
        setSessionUserInfo: function(data){
            data && sessionStorage.setItem("u_info", JSON.stringify(data));
        },
        getSessionUserInfo: function(){
            var info = sessionStorage.getItem("u_info");
            return info && $.parseJSON(info) || {};
        },
        //清除sessionStorage中和用户相关的数据
        clearSessionUser: function() {
            sessionStorage.removeItem("user"); //userId
            sessionStorage.removeItem("tk"); //token
        },
        //登出
        logout: function() {
            Base.clearSessionUser();
        },
        hidePullUp: function(){
            $("#pullUp").css("visibility", "hidden");
        },

        showPullUp: function(){
            $("#pullUp").css("visibility", "visible");
        },
        goLogin: function(){
            // location.href = "../user/wx-login.html?return=" + Base.makeReturnUrl();
            sessionStorage.setItem("l-return", location.pathname + location.search);
            location.href = "../user/wx-login.html";
        },
        confirm: function(msg) {
            return (new Promise(function (resolve, reject) {
                var d = dialog({
                    content: msg,
                    ok: function () {
                        var that = this;
                        setTimeout(function () {
                            that.close().remove();
                        }, 1000);
                        resolve();
                        return true;
                    },
                    cancel: function () {
                        reject();
                        return true;
                    },
                    cancelValue: '取消',
                    okValue: '确定'
                });
                d.showModal();
            }));

        },
        setTitle: function (title) {
            document.title = title;
            var $iframe = $('<iframe src="../images/favicon.ico" style="visibility: hidden;"></iframe>');
            $iframe.on('load', function() {
                setTimeout(function() {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo($('body'));
        }
    };
    Base.addIcon();
    return Base;
});