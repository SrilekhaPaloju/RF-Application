sap.ui.define([
    "./BaseController",
    "sap/ui/Device"
], function (Controller,Device) {
    "use strict";

    return Controller.extend("com.app.rfscreens.controller.HuQuery", {
        onInit: function () {
        },
        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        },
        Onpresssubmit: function () {
            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(true);
            this.getView().byId("_IDGenButton1111").setVisible(true);

        },
        onHUContentPress: function () {
            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(true);
            this.getView().byId("icon4").setVisible(false);
            this.getView().byId("_IDGenButton1111").setVisible(false);
            this.getView().byId("_IDGenButton1122").setVisible(true);

        },
        onHUHierarchyPress: function () {
            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(true);
            this.getView().byId("_IDGenButton1111").setVisible(false);
            this.getView().byId("_IDGenButton1122").setVisible(true);
        },

        Onpressback1: function () {
            this.getView().byId("icon1").setVisible(false);
            this.getView().byId("icon2").setVisible(true);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(false);
            this.getView().byId("_IDGenButton1111").setVisible(true);
            this.getView().byId("_IDGenButton1122").setVisible(false);

        },
        Onpressback2: function () {
            this.getView().byId("icon1").setVisible(true);
            this.getView().byId("icon2").setVisible(false);
            this.getView().byId("icon3").setVisible(false);
            this.getView().byId("icon4").setVisible(false);
        },
    });
});