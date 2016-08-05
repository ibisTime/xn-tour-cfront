define("app/views/operator/Confirm", [
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/dom-style',
    'dojo/on',
    'dojo/mouse',
    'dijit/DialogUnderlay',
    'app/common/Global',
    'dojo/query',
    'dijit/focus',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/string',
    "dojo/dom-class",
    'dojo/dnd/Moveable',
    'app/ux/GenericTextBox',
    'app/ux/GenericButton',
    'app/views/ViewMixin',
    'app/common/Ajax',
    'app/common/RSA',
    'app/ux/GenericTooltip',
    'dojo/_base/lang',
    'dojo/cookie',
    'app/ux/GenericMiniMsgBox',
    'app/views/common/LoginTopbar',
    'dojo/when',
    'app/common/Data',
    'dojo/text!./templates/Confirm.html',
    'app/jquery/$'
], function(declare, _WidgetBase, _TemplatedMixin, domStyle, on, mouse,
            DialogUnderlay, Global, query, focusUtil, dom, domConstruct, string,
            domClass, Moveable, TextBox, Button, ViewMixin, Ajax, RSA,
            Tooltip, lang, cookie, MiniMsgBox, LoginTopbar, when, Data, template, J){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,
        closeAction: 'hide',
        tMsg: "",
        ok: '',
        cancel: '',
        msg: "",
        okHandler: "",
        cancelHandler: "",

        contentClass: '',
        _setCancelAttr: function(value){
            var me = this;
            this._set('cancel', value);
            me.cancelHandler && me.cancelHandler.remove && me.cancelHandler.remove();
            me.cancelHandler = on(this.cancelBtn, "click", function(){
                value.call(me);
            });
        },
        _setTMsgAttr: function (value) {
            this._set('tMsg', value);
            this.titleMsg.innerHTML = value;
        },
        _setOkAttr: function(value){
            var me = this;
            this._set('ok', value);
            me.okHandler && me.okHandler.remove && me.okHandler.remove();
            me.okHandler = on(this.okBtn, "click", function() {
                value.call(me);
            });
        },
        _setMsgAttr: function(value){
            this._set('msg', value);
            this.confirmMsg.innerHTML = value;
        },

        show: function(func) {
            var me = this;
            domStyle.set(me.domNode, {
                display: 'block'
            });
            $(".confirm_dialog").length > 0 ? domStyle.set(me.domNode, {
                "display": "block"
            }) : query("body")[0].appendChild(me.domNode);
            $(".confirm_dialog").show();
            if (document.activeElement) {
                document.activeElement.blur();
            }
            me.domNode.focus();
            if(func){
                func();
            }
        },

        close: function() {
            var me = this;
            domConstruct.destroy(me.domNode);
        },

        hide: function() {
            var me = this;
            domStyle.set(me.domNode, {
                display: 'none'
            });
        },

        postCreate: function(){
            var me = this;

            domStyle.set(me.domNode, {
                position: 'absolute',
                'zIndex': '10000',
                'padding': '4px'
            });

            me.inherited(arguments);
        }
    });
});