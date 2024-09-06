sap.ui.define([
    "./BaseController",
    "sap/ui/Device"
], function (Controller, Device) {
    "use strict";

    return Controller.extend("com.app.rfscreens.controller.Billoflading", {
        onInit: function () {
        },

        Onpressbackbol1: function () {
            this.getView().byId("billofladingicon2").setVisible(false);
            this.getView().byId("billofladingicon1").setVisible(true);
            this.getView().byId("billofladingicon3").setVisible(false);
            this.getView().byId("billofladingicon4").setVisible(false);
            this.getView().byId("_IDGenbackButton1").setVisible(false);
            this.getView().byId("_IDGenbackButton2").setVisible(false);
        
        },
        Onpressbackbol2: function () {
            this.getView().byId("billofladingicon2").setVisible(true);
            this.getView().byId("billofladingicon1").setVisible(false);
            this.getView().byId("billofladingicon3").setVisible(false);
            this.getView().byId("billofladingicon4").setVisible(false);
            this.getView().byId("_IDGenbackButton2").setVisible(false);
            this.getView().byId("_IDGenbackButton1").setVisible(true);

        },

        OnpressBOLsubmit: function () {
            this.getView().byId("billofladingicon1").setVisible(false);
            this.getView().byId("billofladingicon2").setVisible(true);
            this.getView().byId("_IDGenbackButton1").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(false);
        },
        onHUListPress:function(){
         this.getView().byId("billofladingicon1").setVisible(false);
            this.getView().byId("billofladingicon2").setVisible(false);
            this.getView().byId("billofladingicon3").setVisible(true);
            this.getView().byId("_IDGenbackButton1").setVisible(false);
            this.getView().byId("_IDGenbackButton2").setVisible(true);
        },
        onNewhuPress :function(){
            this.getView().byId("billofladingicon1").setVisible(false);
            this.getView().byId("billofladingicon2").setVisible(false);
            this.getView().byId("billofladingicon3").setVisible(false);
            this.getView().byId("billofladingicon4").setVisible(true);
            this.getView().byId("_IDGenbackButton1").setVisible(false);
            this.getView().byId("_IDGenbackButton3").setVisible(true);
        },
        oneEnterPress:function(){
            this.getView().byId("billofladingicon1").setVisible(false);
            this.getView().byId("billofladingicon2").setVisible(false);
            this.getView().byId("billofladingicon3").setVisible(false);
            this.getView().byId("billofladingicon4").setVisible(false);
            this.getView().byId("billofladingicon5").setVisible(true);
            this.getView().byId("_IDGenbackButton4").setVisible(true);
        },
        onGRPress:function(){
            this.getView().byId("billofladingicon1").setVisible(false);
            this.getView().byId("billofladingicon2").setVisible(false);
            this.getView().byId("billofladingicon3").setVisible(false);
            this.getView().byId("billofladingicon4").setVisible(false);
            this.getView().byId("billofladingicon5").setVisible(false);
            this.getView().byId("billofladingicon6").setVisible(true);
            this.getView().byId("_IDGenbackButton5").setVisible(true);
            this.getView().byId("_IDGenbackButton2").setVisible(false);
            this.getView().byId("_IDGenbackButton3").setVisible(false);
            this.getView().byId("_IDGenbackButton4").setVisible(false);

        },

        onunloadPress:function(){
            this.getView().byId("billofladingicon1").setVisible(false);
            this.getView().byId("billofladingicon2").setVisible(false);
            this.getView().byId("billofladingicon3").setVisible(false);
            this.getView().byId("billofladingicon4").setVisible(false);
            this.getView().byId("billofladingicon5").setVisible(false);
            this.getView().byId("billofladingicon6").setVisible(false);
            this.getView().byId("billofladingicon7").setVisible(true);
            this.getView().byId("_IDGenbackButton6").setVisible(true);
        },
        Onpressback3:function(){
            this.getView().byId("billofladingicon2").setVisible(true);
            this.getView().byId("billofladingicon1").setVisible(false);
            this.getView().byId("billofladingicon3").setVisible(false);
            this.getView().byId("billofladingicon4").setVisible(false);
            this.getView().byId("_IDGenbackButton2").setVisible(false);
            this.getView().byId("_IDGenbackButton1").setVisible(true);
        },
        Onpressback5:function(){
            this.getView().byId("_IDGenbackButton5").setVisible(false);
            this.getView().byId("billofladingicon4").setVisible(true);
            this.getView().byId("_IDGenbackButton4").setVisible(true);
        },
        });
});