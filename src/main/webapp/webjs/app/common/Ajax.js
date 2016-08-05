/**
 * generic post request, the data format is json
 * */
define("app/common/Ajax", [
	'dojo/request',
	'dojo/json',
	'app/common/Message',
	'dijit/registry',
	'app/common/Global'
], function(request, json, Message, registry, Global) {
	var cache = {};
	return {
		post: function(url, kwArgs, sync) {
			var data = kwArgs || {},
				url = url || '',
				promise = request.post(url, {
					handleAs: 'json', // response type, if this defined, the unaccept http status like 404 will make a mistake, because it return html
					// serialize json string
					data: data,
					sync: sync || false,
					timeout: 50000 // 50 sec
				});
			var handlerResponse = function(response, error) {
				if (error) {
					Message.msg('Error', error.message);
				}
				if (data.title && data.msg) {
					Message.msg(data.title, data.msg);
				}
			};
			promise.then(function(response) {
				handlerResponse(response);
				// deal with session timeout
//				if (response && response.exceptions && response.exceptions[0]['no'] == -1000) {
//					location.href = Global.baseUrl + '/user/login.htm';
//				}
			}, function(error) {
				//handlerResponse(null, error);
				promise.cancel(error);
			});
			return promise;
		},

        put: function(url, kwArgs, sync) {
            var data = kwArgs || {},
                url = url || '',
                promise = request.put(url, {
                    handleAs: 'json', // response type, if this defined, the unaccept http status like 404 will make a mistake, because it return html
                    // serialize json string
                    data: data,
                    sync: sync || false,
                    timeout: 50000 // 50 sec
                });
            var handlerResponse = function(response, error) {
                if (error) {
                    Message.msg('Error', error.message);
                }
                if (data.title && data.msg) {
                    Message.msg(data.title, data.msg);
                }
            };
            promise.then(function(response) {
                handlerResponse(response);
                // deal with session timeout
//				if (response && response.exceptions && response.exceptions[0]['no'] == -1000) {
//					location.href = Global.baseUrl + '/user/login.htm';
//				}
            }, function(error) {
                //handlerResponse(null, error);
                promise.cancel(error);
            });
            return promise;
        },

		// get image
		get: function(url, param, reload, async) {
			if (typeof param == 'boolean' || typeof param == 'undefined') {
				reload = param;
				param = {};
			}
			var tokenStr = '_=' + new Date().valueOf(),
				symbol = (url.indexOf('?') === -1 ? '?' : '&');
			if (url && !/_=.*/.test(url)) {
				var send_url = url + symbol + tokenStr;
			}
			var cache_url = url + json.stringify(param);
			if (reload) {
				delete cache[cache_url];
			}
			if (!cache[cache_url]) {
				cache[cache_url] = request.get(url, {
					handleAs: 'json', // response type, if this defined, the unaccept http status like 404 will make a mistake, because it return html
					query: param,
					sync: async || false
				});
			}
			return cache[cache_url];
		}
	}
});