define([
    'app/util/dialog'
], function(dialog) {
    var cache = {};
    return {
        /**
         * data request through get should be cached in per page
         * add timestamp after url can clear server and browser cache
         * */
        get: function(url, param, reload, sync) {
            if (typeof param == 'boolean' || typeof param == 'undefined') {
                reload = param;
                param = {};
            }
            var tokenStr = '_=' + new Date().valueOf(),
                symbol = (url.indexOf('?') === -1 ? '?' : '&');
            if (url && !/_=.*/.test(url)) {
                var send_url = url + symbol + tokenStr;
            }
            var cache_url = url + JSON.stringify(param);
            if (reload) {
                delete cache[cache_url];
            }
            if (!cache[cache_url]) {
                cache[cache_url] = $.ajax({
                    async: !sync,
                    type: 'get',
                    url: send_url,
                    data: param
                });
                cache[cache_url].then(function(res) {
                    if (res.timeout) {
                        localStorage.removeItem("user");
                        location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
                    }
                }, function(res) {});
            }
            return cache[cache_url];
        },

        post: function(url, param) {
            var specialCode = /^[\s0-9a-zA-Z\u4e00-\u9fa5\u00d7\u300a\u2014\u2018\u2019\u201c\u201d\u2026\u3001\u3002\u300b\u300e\u300f\u3010\u3011\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff0d\uff03\uffe5\x21-\x7e]*$/;
            var flag = false;
            for (var n in param) {
                if (!specialCode.test(param[n])) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                var defer = jQuery.Deferred();
                defer.resolve({ success: false, msg: "提交表单中含特殊字符" });
                return defer.promise();
            }
            var promise = $.ajax({
                type: 'post',
                traditional: true,
                url: url,
                data: param
            });
            //var promise = $.post(url, param);
            promise.then(function(res) {
                if (res.timeout) {
                    localStorage.removeItem("user");
                    location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
                }
            }, function(res) {});
            return promise;
        }
    };
});