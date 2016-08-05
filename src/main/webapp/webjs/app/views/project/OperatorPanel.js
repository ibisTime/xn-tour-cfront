define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'app/views/ViewMixin',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'app/common/Global',
    'dojo/text!./templates/OperatorPanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin, on, query,
             domClass, domStyle, Global, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin], {

        templateString: template,

        item: '',
        type: '',

        _setItemAttr: function(value) {

        },

        render: function () {
            var me = this;
        },

        addListeners: function() {
            var me = this;
            on(me.domNode, 'click', function() {
                window.open(Global.baseUrl + '/operator/index.htm?id=' + me.item.userId);
            });
        },

        isValid: function() {
            return true;
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});