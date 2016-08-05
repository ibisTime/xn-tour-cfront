define("app/views/operator/ShowMsg", [
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
    'app/common/Position',
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
    'dojo/text!./templates/ShowMsg.html',
    'app/jquery/$'
], function(declare, _WidgetBase, _TemplatedMixin, domStyle, on, mouse,
            DialogUnderlay, Global, query, focusUtil, dom, domConstruct, string,
            domClass, Position, Moveable, TextBox, Button, ViewMixin, Ajax, RSA,
            Tooltip, lang, cookie, MiniMsgBox, LoginTopbar, when, Data, template, J){
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,
        closeAction: 'hide',
        msg: "",
        btn: "",
        btnHandler: "",

        contentClass: '',

        _setMsgAttr: function(value){
            this._set('msg', value);
            this.confirmMsg.innerHTML = value;
        },

        _setBtnAttr: function (fn) {
            this._set('btn', fn);
            var me = this;
            me.btnHandler = on(this.msgBtn, "click", function () {
                fn.call(me);
            });
        },

        show: function() {
            var me = this;
            domStyle.set(me.domNode, {
                display: 'block'
            });
            $(".showMsg_dialog").length > 0 ? domStyle.set(me.domNode, {
                "display": "block"
            }) : query("body")[0].appendChild(me.domNode);
            if (document.activeElement) {
                document.activeElement.blur();
            }
            me.domNode.focus();
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
        addListener: function () {
            var me = this;
            on(me.msgBtn, "click", function () {
                me[me.get('closeAction')]();
            });
        },
        postCreate: function(){
            var me = this;

            domStyle.set(me.domNode, {
                position: 'absolute',
                'zIndex': '10000',
                'padding': '4px'
            });
            me.addListener();
            me.inherited(arguments);
        }
    });
});