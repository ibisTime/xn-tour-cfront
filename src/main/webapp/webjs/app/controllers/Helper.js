/**
 * this file deals with almost function controllers used 
 */
define([
    'app/jquery/NProgress',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/dom-attr',
    'dojo/on',
    'dojo/when',
    'app/common/Ajax',
    'app/common/Global',
    'app/common/Data',
    'app/common/Fx',
    'dijit/registry',
    'dojo/query',
    'dojo/has',
    'dojo/_base/sniff',
    'app/ux/GenericSideToolbar',
    'app/views/common/LoginTopbar',
    'app/views/common/LogoutTopbar',
    'dojo/cookie',
    'app/views/common/Error',
    'app/ux/GenericTooltip',
    'dojo/request/notify',
    'dojo/json',
    'dojo/_base/config',
    'app/views/common/LoginWin',
    'dojo/NodeList-traverse'
], function(NProgress, dom, domConstruct, domClass, domStyle, domAttr, on, when, Ajax, Global, Data, Fx,
		registry, query, has, sniff, SideToolbar, LoginTopbar, LogoutTopbar, cookie,
        ErrorPanel, Tooltip, notify, JSON, Config, LoginWindow) {
	var mainMenuItems = query('.subnav-item', 'subheader'),
		sideBarItems = query('.list-lside-item', 'sidebar'),
		callForHelpEl = dom.byId('callforhelp'),
		smallLogo = dom.byId('logotopbar'),
		scrollTop = 0,
		subHeader = dom.byId('subheader'),
        menuPro = dom.byId('menu-product'),
        menuProItems = dom.byId('menu-product-items'),
        headerNav = dom.byId('header-nav'),
        loginWin = new LoginWindow();
	
	var renderItem = function(items, role) {
		items.filter('[data-access~='+role+']').style('display', 'block');
		items.filter(':not([data-access~='+role+'])').forEach(function(item) {
			domConstruct.destroy(item);
		});
	};

    // generic progress bar for loading data
    notify("start", function(){
        // Do something when the request queue has started
        // This event won't fire again until "stop" has fired
        NProgress.start();
    });

    notify("done", function(responseOrError){
        if(responseOrError instanceof Error){
            // Do something when a request has failed
        }else{
            NProgress.inc();
        }
    });
    notify("stop", function(){
        NProgress.done(true);
    });
    function notLogin() {
        sessionStorage.removeItem("uKind");
        dom.byId("bag_img").innerHTML = '<a id="icon_login">登录<i class="icon_login"></i></a>';
        $("#headProdUl").children("a").show();
        $("#icon_login").on("click", function () {
            loginWin.show();
        });
        var rtnUrl = Global.getUrlParam("return");
        rtnUrl && $("#icon_login").click();
    }

    function getCartTotal() {
        Ajax.get(Global.baseUrl + '/operators/queryCart', {}, true)
            .then(function (response) {
            if(response.success){
                var data = response.data, len = data.length;
                if(len){
                    $('<span>'+len+'</span>').appendTo($("#bag_img").find("div.p-relative:first"));
                }else{
                    $("#bag_img").find("div.p-relative:first>span").remove();
                }
            }
        });
    }

    function logout(){
        Ajax.post(Global.baseUrl+'/user/logout', {})
            .then(function (response) {
                if(response.success){
                    sessionStorage.removeItem("uKind");
                    location.href = Global.baseUrl+'/home/index.htm';
                }
            });
    }

	return {
		init: function(config) {
            // get the role of login user
            config = config || {};
            window.onerror = function() {
                return false;
            };
            if (!('login' in config) || config.login) {
                when(Data.getUser(), function(user) {
                    if (user) {
                        if(user.kind == "f2"){
                            sessionStorage.setItem("uKind", "f2");
                            dom.byId("headProdUl").innerHTML =
                                '<a style="display: inline;" href="'+Global.baseUrl+'/user/productModel.htm"><li>我要批发</li></a>' +
                                '<a style="display: inline;" href="'+Global.baseUrl+'/user/order_list.htm"><li>我的订单</li></a>' +
                                '<a style="display: inline;" href="'+Global.baseUrl+'/user/after_service.htm"><li>售后服务</li></a>';
                            dom.byId("bag_img").innerHTML = '<div id="logout" style="cursor: pointer;line-height:56px;padding: 0 10px;">退出</div>' +
                                '<div><a href="'+Global.baseUrl+'/user/user_info.htm"><i class="user-center"></i>个人中心</a></div>';
                            if(location.pathname.indexOf("productModel") != -1){
                                $("#headProdUl>a:first").addClass("active");
                            }else if(location.pathname.indexOf("order_list") != -1){
                                $("#headProdUl>a:eq(1)").addClass("active");
                            }else if(location.pathname.indexOf("after_service") != -1){
                                $("#headProdUl>a:eq(2)").addClass("active");
                            }else if(location.pathname.indexOf("home/index") != -1){
                                $("#index_imgs").find(".img-ul>a").attr("href", Global.baseUrl+"/user/productModel.htm");
                            }
                        }else{
                            sessionStorage.setItem("uKind", "f1");
                            $("#headProdUl").children("a").show();
                            dom.byId("bag_img").innerHTML = '<div class="nofloat p-relative"><a href="'+Global.baseUrl+'/user/cart.htm"><i></i>购物车</a></div>' +
                                '<div class="nofloat">' +
                                '<a href="'+Global.baseUrl+'/user/order_list.htm"><i class="user-center"></i>个人中心</a></div>' +
                                '<div id="logout" style="cursor: pointer;line-height:56px;">退出</div>';
                            if(location.pathname.indexOf("after_service") != -1){
                                $("#headProdUl>a:eq(2)").addClass("active");
                            }
                            getCartTotal();
                        }
                    } else {
                        notLogin();
                    }
                });
            }else{
                notLogin();
            }
            $("#bag_img").on("click", "#logout", function () {
                logout();
            });
			// clear cache from client
            //on(document, 'click', function(e) {
             //   var target = e.target,
             //       count = 4;
             //   for (var i = 0; i < count; i++) {
             //       if (target && target.nodeName.toLowerCase() == 'a') {
             //           if (target.href.indexOf('#') >= 0) { // anchor won't add _=
             //               continue;
             //           }
             //           var me = target,
             //           // clip the time stamp param
             //               href = temp = me.href.replace(/(&?_=.*(?=&)|&?_=.*)/,'').replace('?&', '?').replace(/\?$/,''),
             //               tokenStr = '_=' + new Date().valueOf(),
             //               symbol = (href.indexOf('?') === -1 ? '?' : '&');
             //           //if(href.indexOf('return') === -1){
             //           //	href += symbol + 'return=' + location.href;
             //           //}
             //           //symbol = (href.indexOf('?') === -1 ? '?' : '&');
             //           if (href && href !== 'javascript:void(0)' && !/_=.*/.test(href) && domAttr.get(me, 'href')[0] !== '#') {
             //               me.href = href + symbol + tokenStr;
             //           }
             //           // recover the url after clicking
             //           setTimeout(function() {
             //               if (temp) {
             //                   me.href = temp;
             //               }
             //           }, 1);
             //           break;
             //       } else {
             //           if (!target.parentNode) {
             //               break;
             //           }
             //           target = target.parentNode;
             //       }
             //   }
            //});
            //on(document, 'a:click', function(e) {
				//var me = this,
				//	// clip the time stamp param
				//	href = temp = this.href.replace(/(&?_=.*(?=&)|&?_=.*)/,'').replace('?&', '?').replace(/\?$/,''),
				//	tokenStr = '_=' + new Date().valueOf(),
				//	symbol = (href.indexOf('?') === -1 ? '?' : '&');
				//if (href && href !== 'javascript:void(0)' && !/_=.*/.test(href) && domAttr.get(this, 'href')[0] !== '#') {
				//	this.href = href + symbol + tokenStr;
				//}
				//// recover the url after clicking
				//setTimeout(function() {
				//	if (temp) {
				//		me.href = temp;
				//	}
				//}, 1);
            //});

            on(document, 'click', function(e) {
               var aroundNode;
               if (Tooltip._masterTT && Tooltip._masterTT.aroundNode && Tooltip._masterTT.aroundNode != e.target) {
                   Tooltip.hide();
               }
            });

            // show help text
            on(document, '.help:mouseover', function(e) {
                Tooltip.show(domAttr.get(this, 'data-help'), this, 'info');
            });

            on(document, '.help:mouseout', function(e) {
                Tooltip.hide();
            });

            // hide the tooltip
            on(document, 'focusin', function(e) {
                Tooltip.hide();
            });
			
			// focus first input
            if (!config.noFocus) {
                Global.focusText();
            }


			// press enter key, if the screen has the displayed button to commit, invoke the click event dispatcher
			on(window, 'keypress', function(e) {
				var charOrCode = e.charCode || e.keyCode;
				if (charOrCode === 13) { // enter
					e.preventDefault();
					var btns = query('.dijitButton.enterbutton').reverse();
					btns.some(function(btnEl) {
						var btn = registry.byNode(btnEl);
						if (btn && !btn.get('disabled') && btnEl.offsetHeight !==0 && btn.onClick) {
							btn.onClick.call(btn);
							return true; // broke the loop
						}
						if (!btn) { // dom
							btnEl.click();
							return true;
						}
					});
				}
			});
			
			// sniff browser
//			if (has("ie") <= 8 && !cookie('warningBarClosed')) {
//				warningBar = new WarningBar({
//					msg: '请使用谷歌、火狐或最新版IE浏览器！'
//				});
//				warningBar.placeAt(document.body);
//				warningBar.show();
//			}
			
			// call for help anim
			if (callForHelpEl) {
				on(callForHelpEl, 'mouseenter', function() {
					domClass.add(query('i', this)[0], 'phone-calling');
				});
				on(callForHelpEl, 'mouseleave', function() {
					domClass.remove(query('i', this)[0], 'phone-calling');
				});
			}
			
			// active scroll
			on(window, 'scroll', function(e) {
                renderScroll();
			});

            function renderScroll() {
                var top = document.body.scrollTop + document.documentElement.scrollTop;
                domClass[top ? 'add' : 'remove'](document.body, 'scrolled');
            }

            renderScroll();
			
			// place sidetoolbar

            var stbItem = [{
                xtype: 'totop'
            }];

			var sideToolbar = new SideToolbar({
				items: stbItem
			});
			sideToolbar.placeAt(document.body);

            // header

            query('.nav-menu .pop-menu').on('mouseenter', function() {
                query(this).query('.sub-menu').style('display', 'block');
            });

            query('.nav-menu .pop-menu').on('mouseleave', function() {
                query(this).query('.sub-menu').style('display', 'none');
            });
		},
        getCartTotal: function () {
            getCartTotal();
        }
	};
});