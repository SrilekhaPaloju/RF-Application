sap.ui.define([
    "./BaseController",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    'sap/ui/core/SeparatorItem',
],
    function (Controller, Device, MessageBox, SeparatorItem,MessageToast) {
        "use strict";

        return Controller.extend("com.app.rfscreens.controller.Home", {
            onInit: function () {

            },
            onCloseDialog: function () {
                if (this.ologinDialog.isOpen()) {
                    this.ologinDialog.close()
                }
            },
            onPressSignupBtn: async function () {
                if (!this.oActiveLoansDialog) {
                    this.oActiveLoansDialog = await this.loadFragment("SignUpDetails")
                }
                this.oActiveLoansDialog.open();
            },

            //Register Dialog close Btn...
            onCloseRegisterDialog: function () {
                this.oActiveLoansDialog.close();
            },
            handleLinkPress: async function () {
                if (!this.oforgotDialog) {
                    this.oforgotDialog = await this.loadFragment("Forgotpassword")
                }
                this.oforgotDialog.open();
            },
            onRsesetPress: function () {
                this.oforgotDialog.close();
            },
            onClearRegisterDialog: function () {
                var oView = this.getView();
                oView.byId("idEmployeeIDInput").setValue("");
                oView.byId("idResourceNameInput").setValue("");
                oView.byId("idInputEmail").setValue("");
                oView.byId("idInputPhoneNumber").setValue("");

                // Unselect checkboxes
                oView.byId("idRoesurcetypeInput").setSelectedItem(null);

                // Clear the selected keys from GroupSelect MultiComboBox
                oView.byId("GroupSelect").setSelectedKeys([]);

                var oMultiComboBox = this.byId("checkboxContainer");

                // Clear all selected items
               oMultiComboBox.setSelectedKeys([]);
            },
         onCheckBoxSelect: function () {
            // Get the MultiComboBox instance for the Process Area
            var oMultiComboBox = this.byId("checkboxContainer");
        
            // Retrieve the selected items
            var aSelectedItems = oMultiComboBox.getSelectedItems();
        
            // Initialize an array to hold the filters
            var aFilters = [];
        
            // Iterate over the selected items to add corresponding filters
            aSelectedItems.forEach(function(oItem) {
                var sKey = oItem.getText(); // Get the key (e.g., "Inbound", "Outbound", "Internal")
        
                // Add filter for the selected process area
                aFilters.push(new sap.ui.model.Filter("Processarea", sap.ui.model.FilterOperator.EQ, sKey)); 
            });
        
            // Combine the filters with an OR condition
            var oCombinedFilter = new sap.ui.model.Filter({
                filters: aFilters,
                and: false
            });
        
            // Get the Group MultiComboBox and apply the filters
            var oGroupMultiComboBox = this.byId("GroupSelect");
        
            // Bind the aggregation with the new filters
            oGroupMultiComboBox.bindAggregation("items", {
                path: "/AreaSet",
                template: new sap.ui.core.Item({
                    key: "{Processgroup}",
                    text: "{Processgroup}"
                }),
                filters: oCombinedFilter,
                sorter: {
                    path: "Processarea",
                    group: true
                },
                groupHeaderFactory: this.getGroupHeader
            });
        
            // Make sure the Group MultiComboBox is visible
            oGroupMultiComboBox.setVisible(true);
        },                  
            onSubmitPress: function () {

                const oUserView = this.getView();
                // Get the form inputs
                var sEmployeeID = this.byId("idEmployeeIDInput").getValue();
                var sResourceName = this.byId("idResourceNameInput").getValue();
                var oResourceTypeComboBox = oUserView.byId("idRoesurcetypeInput");
                var oSelectedItem = oResourceTypeComboBox.getSelectedItem();
                var sPhone = this.byId("idInputPhoneNumber").getValue();
                var oEmail = this.byId("idInputEmail").getValue();

                var oMultiComboBox = this.byId("checkboxContainer");
                // Retrieve the selected items
                var aSelectedItems = oMultiComboBox.getSelectedItems();
                var aSelectedValues = aSelectedItems.map(function(oItem) {
                    return oItem.getText(); // Use oItem.getKey() if you need the key instead of the text
                });
                var sSelectedAreas = aSelectedValues.join(","); 

                // Get the selected groups from the MultiComboBox
                var oItem = this.byId("GroupSelect").getSelectedKeys();
                var resourceGroup = oItem.join(", ");

                var bValid = true;
                var bAllFieldsFilled = true;

                // Validate fields and set value state and messages
                if (!sEmployeeID) {
                    oUserView.byId("idEmployeeIDInput").setValueState("Information");
                    oUserView.byId("idEmployeeIDInput").setValueStateText("Employee ID is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else if (!/^\d{6}$/.test(sEmployeeID)) {
                    oUserView.byId("idEmployeeIDInput").setValueState("Information");
                    oUserView.byId("idEmployeeIDInput").setValueStateText("Resource ID must be a 6-digit numeric value");
                    bValid = false;
                } else {
                    oUserView.byId("idEmployeeIDInput").setValueState("None");
                }

                if (!sResourceName) {
                    oUserView.byId("idResourceNameInput").setValueState("Information");
                    oUserView.byId("idResourceNameInput").setValueStateText("Resource Name cannot be empty");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oUserView.byId("idResourceNameInput").setValueState("None");
                }

                if (!oSelectedItem) {
                    oUserView.byId("idRoesurcetypeInput").setValueState("Information");
                    oUserView.byId("idRoesurcetypeInput").setValueStateText("Please select Resource Type");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oUserView.byId("idRoesurcetypeInput").setValueState("None");
                }

                // Validate Phone Number
                if (!sPhone) {
                    oUserView.byId("idInputPhoneNumber").setValueState("Information");
                    oUserView.byId("idInputPhoneNumber").setValueStateText("Phone number is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else if (sPhone.length !== 10 || !/^\d+$/.test(sPhone)) {
                    oUserView.byId("idInputPhoneNumber").setValueState("Information");
                    oUserView.byId("idInputPhoneNumber").setValueStateText("Phone number must be a 10-digit numeric value");
                    bValid = false;
                } else {
                    oUserView.byId("idInputPhoneNumber").setValueState("None");
                }

                if (!bAllFieldsFilled) {
                    sap.m.MessageToast.show("Please fill all mandatory details");
                    return;
                }

                if (!bValid) {
                    sap.m.MessageToast.show("Please enter correct data");
                    return;
                }


                if (!bValid) {
                    sap.m.MessageToast.show("Please fill all the required fields correctly.");
                    return; // Prevent further execution
                }

                var oModel = this.getView().getModel();
                var that = this;
                oModel.create("/RFUISet", {
                    Resourceid: sEmployeeID,
                    Validity: false,
                    Resourcename: sResourceName,
                    Resouecetype: oSelectedItem.getKey(), // assuming getKey() gives the value you need
                    Area: sSelectedAreas,
                    Email: oEmail,
                    Phonenumber: sPhone,
                    Resourcegroup: resourceGroup,
                    Status :"true"
                }, {
                    success: function (oData) {
                        sap.m.MessageToast.show("your details are sent to supervisior please wait until you get the approval");
                        that.oActiveLoansDialog.close();
                    },
                    error: function (oError) {
                        MessageBox.error("Error");
                    }
                })
                oUserView.byId("idEmployeeIDInput").setValue("");
                oUserView.byId("idResourceNameInput").setValue("");
                oUserView.byId("idInputEmail").setValue("");
                oUserView.byId("idInputPhoneNumber").setValue("");

                // Unselect checkboxes
                oUserView.byId("idRoesurcetypeInput").setSelectedItem(null);

                // Clear the selected keys from GroupSelect MultiComboBox
                oUserView.byId("GroupSelect").setSelectedKeys([]);

                var oMultiComboBox = this.byId("checkboxContainer");

                // Clear all selected items
               oMultiComboBox.setSelectedKeys([]);
            },
            onResourceLoginBtnPress: async function () {
                var oView = this.getView();

                // Retrieve values from input fields
                var sWarehouseNumber = oView.byId("idwhInput").getValue();
                var sResourceId = oView.byId("IdResourceInput").getValue();
                var sPassword = oView.byId("Idpassword").getValue();

                // Perform validation checks
                if (!sWarehouseNumber) {
                    sap.m.MessageToast.show("Please enter the Warehouse Number.");
                    return;
                }
                if (!sResourceId) {
                    sap.m.MessageToast.show("Please enter the Resource ID.");
                    return;
                }
                if (!sPassword) {
                    sap.m.MessageToast.show("Please enter the Password.");
                    return;
                }
                if (!(sWarehouseNumber && sResourceId && sPassword)) {
                    sap.m.MessageToast.show("Please enter all the details");
                    return;
                }

                // Get the model from the component
                var oModel = this.getOwnerComponent().getModel();

                // Make the API call to check if the resource exists
                try {
                    await oModel.read("/RFUISet('" + sResourceId + "')", {
                        success: function (oData) {
                            var Id = oData.Resourceid;
                            this.getOwnerComponent().getRouter().navTo("RouteUsermenu", { id: Id });
                            // You can perform further actions here, like navigating to the next view
                        }.bind(this),
                        error: function () {
                            sap.m.MessageToast.show("User does not exist");
                        }
                    });
                } catch (error) {
                    MessageToast.show("An error occurred while checking the user.");
                }
            },

        });
    });
