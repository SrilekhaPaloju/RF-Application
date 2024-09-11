sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
 
], function (Controller, Fragment) {
    'use strict';
 
    return Controller.extend("com.app.rfscreens.controller.BaseController", {
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },
        // loadFragment: async function (sFragmentName) {
        //     const oFragment = await Fragment.load({
        //         id: this.getView().getId(),
        //         name: `com.app.rfscreens.fragments.${sFragmentName}`,
        //         controller: this
        //     });
        //     this.getView().addDependent(oFragment);
        //     return oFragment
        // },
    })
 
});