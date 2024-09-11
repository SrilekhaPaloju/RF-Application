sap.ui.define([
    "./BaseController",
    "sap/ui/Device"
], function (Controller, Device) {
    "use strict";

    return Controller.extend("com.app.rfscreens.controller.InitialScreen", {
        onInit: function () {

        },
        onDevButtonPress:async function(){
        this.LoadSapLogon();
        },
        onsapCancelPress:function(){
            this.oConfigSap.close();
        },
        onProdButtonPress: function(){
            this.LoadSapLogon();
        },
        onEnvButtonPress: function(){
            this.LoadSapLogon();
        },
          LoadSapLogon: async function(){
            this.oConfigSap ??= await this.loadFragment({
                name: "com.app.rfscreens.fragments.SapLogon"
            })
            this.oConfigSap.open();
        },
        handleLinksapPress: async function(){
            this.oConnetSap ??= await this.loadFragment({
                name: "com.app.rfscreens.fragments.ConnecttoSAP"
            })
            this.oConnetSap.open();
        },
        onCloseconnectsap:function(){
            this.oConnetSap.close();
        }
    });
});