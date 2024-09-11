sap.ui.define([
    "./BaseController",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/core/UIComponent"

],
function (Controller,Device,JSONModel,Popover,Button,library,UIComponent) {
    "use strict";
 
    return Controller.extend("com.app.rfscreens.controller.Usermenu", {
        onInit: function () {
            
            this._setToggleButtonTooltip(!Device.system.desktop);  
            const oRouter = this.getOwnerComponent().getRouter();
                   // Initialize JSON Model
                   var oModel = new JSONModel();
                   this.getView().setModel(oModel);
   
                 // Load data asynchronously
                   oModel.loadData(sap.ui.require.toUrl("com/app/rfscreens/model/data.json"));
                   oModel.attachRequestCompleted(function (oEvent) {
                       if (!oEvent.getParameter("success")) {
                           sap.m.MessageToast.show("Failed to load data.");
                       }
                   }.bind(this));
                   oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
        },
 
        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        },
 
        handleUserNamePress: function (event) {
            var oPopover = new Popover({
                showHeader: false,
                placement: PlacementType.Bottom,
                content: [
                    new Button({
                        text: 'Feedback',
                        type: ButtonType.Transparent
                    }),
                    new Button({
                        text: 'Help',
                        type: ButtonType.Transparent
                    }),
                    new Button({
                        text: 'Logout',
                        type: ButtonType.Transparent
                    })
                ]
            }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');
 
            oPopover.openBy(event.getSource());
        },
 
        onResourceDetailsLoad: async function (oEvent1) {

            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
            console.log(this.ID);
       
            var oModel = this.getView().getModel();
            var oModel1 = this.getOwnerComponent().getModel();
       
            await oModel1.read("/RFUISet('" + this.ID + "')", {
                success: function (oData) {
                    var area = oData.Area;
                    var areaArray = area.split(",").map(item => item.trim()); // Split and trim each area
                    var group = oData.Resourcegroup;
                    var groupArray = group.split(", ").map(item => item.trim()); // Split and trim each group
                    var resourceType = oData.Queue;
       
                    var aNavigationData = oModel.getProperty("/navigation");
       
                    // Loop through navigation data
                    aNavigationData.forEach(function (oProcess) {
                        var processVisible = false; // Flag to track visibility for each process
       
                        // Loop through areaArray
                        areaArray.forEach(function (areaArray1) {
                            var Area = `${areaArray1} Process`;
       
                            // Check if the process title matches any in the formatted array
                            if (oProcess.title === Area) {
                                oProcess.visible = true;
                                processVisible = true; // Mark this process as visible
                            }
                        });
       
                        // If no area matched, set process to false
                        if (!processVisible) {
                            oProcess.visible = false;
                        }
       
                        // Loop through items of each process
                        oProcess.items.forEach(function (oItem) {
                            // Set visibility of items based on the matching group and the process visibility
                            if (groupArray.includes(oItem.title) && oProcess.visible) {
                                oItem.visible = true;
                            } else {
                                oItem.visible = false;
                            }
                        });
                    });
       
                    // Update the model with modified visibility data after all processing
                    oModel.setProperty("/navigation", aNavigationData);
       
                    // Further actions can be performed here, like navigating to the next view
                }.bind(this),
                error: function () {
                }
            });
       
            // Additional code can be placed here if needed
        },
        
        onSideNavButtonPress: function () {
            var oToolPage = this.byId("toolPage");
            var bSideExpanded = oToolPage.getSideExpanded();
 
            this._setToggleButtonTooltip(bSideExpanded);
 
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },
 
        _setToggleButtonTooltip: function (bLarge) {
            var oToggleButton = this.byId('sideNavigationToggleButton');
            if (bLarge) {
                oToggleButton.setTooltip('Large Size Navigation');
            } else {
                oToggleButton.setTooltip('Small Size Navigation');
            }
        },
        OnPressHUQuery: function(){
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("HUQuerypage");
        },
        onReceivingofHUbyBillofLading: function(){
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Billoflading");
        },
    });
});
 