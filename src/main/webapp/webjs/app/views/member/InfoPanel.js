define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'app/views/ViewMixin',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'app/common/Global',
    'dojo/text!./templates/InfoPanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, ViewMixin, on, query,
             domClass, domStyle, Global, template) {
    return declare([_WidgetBase, _TemplatedMixin, ViewMixin], {

        templateString: template,

        render: function () {
            var me = this;
        },

        addListeners: function() {
            var me = this;
        },

        buildRendering: function () {
            var me = this;
            me.inherited(arguments);
            me.render();
            me.addListeners();
        }
    });
});