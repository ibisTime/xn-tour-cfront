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
    'dojo/text!./templates/BusPanel.html'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin, on, query,
             domClass, domStyle, Global, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ViewMixin], {

        templateString: template,

        summaryItem: '',
        describeItem:'',
        type: '',

        render: function () {
            var me = this;
        },

        addListeners: function() {
            var me = this;

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