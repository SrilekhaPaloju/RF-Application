sap.ui.define([
    "./BaseController",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    'sap/ui/core/SeparatorItem',
    "sap/ui/model/json/JSONModel",
],
    function (Controller, Device, MessageBox, SeparatorItem, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("com.app.rfscreens.controller.Home", {
            onInit: function () {
                this._fetchUniqueProcessAreas();
            },
            onCloseDialog: function () {
                if (this.ologinDialog.isOpen()) {
                    this.ologinDialog.close()
                }
            },
            onPressSignupBtn: async function () {
                if (!this.oActiveLoansDialog) {
                    this.oActiveLoansDialog = await this.loadFragment("SignUpDetails")
                    this._fetchUniqueProcessAreas();
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
            onCloseFP: function () {
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

                var oMultiComboBox = this.byId("AreaSelect");

                // Clear all selected items
                oMultiComboBox.setSelectedKeys([]);
            },
            onCheckBoxSelect: function () {
                // Get the MultiComboBox instance for the Process Area
                var oMultiComboBox = this.byId("AreaSelect");

                // Retrieve the selected items
                var aSelectedItems = oMultiComboBox.getSelectedItems();

                // Initialize an array to hold the filters
                var aFilters = [];

                // Iterate over the selected items to add corresponding filters
                aSelectedItems.forEach(function (oItem) {
                    var sKey = oItem.getText(); // Get the key (e.g., "Inbound", "Outbound", "Internal")

                    // Add filter for the selected process area
                    aFilters.push(new sap.ui.model.Filter("Processarea", sap.ui.model.FilterOperator.EQ, sKey));
                });

                // Combine the filters with an OR condition
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // This specifies the OR condition
                });

                // Get the Group MultiComboBox and apply the filters
                var oGroupMultiComboBox = this.byId("GroupSelect");
                // Fetch data from the model with applied filters
                var oModel = this.getView().getModel();
                oModel.read("/AreaSet", {
                    filters: [oCombinedFilter],
                    success: function (oData) {
                        // Process data to remove duplicates
                        var aUniqueItems = [];
                        var oProcessGroups = {};

                        // Iterate over fetched data
                        oData.results.forEach(function (oItem) {
                            var sGroup = oItem.Processgroup;

                            // Add to unique items if not already present
                            if (!oProcessGroups[sGroup]) {
                                oProcessGroups[sGroup] = true;
                                aUniqueItems.push({
                                    key: sGroup,
                                    text: sGroup
                                });
                            }
                        });

                        // Clear existing items in the MultiComboBox
                        oGroupMultiComboBox.removeAllItems();

                        // Add the unique items to the MultiComboBox
                        aUniqueItems.forEach(function (oItem) {
                            oGroupMultiComboBox.addItem(new sap.ui.core.Item({
                                key: oItem.key,
                                text: oItem.text
                            }));
                        });

                        // Make sure the Group MultiComboBox is visible
                        oGroupMultiComboBox.setVisible(true);
                        this.getGroupHeader(oGroup);
                    },
                    error: function (oError) {
                        // Handle error if necessary
                        sap.m.MessageToast.show("Failed to fetch data.");
                    }
                });
            },          
            // getGroupHeader: function (oGroup) {
            //     return new SeparatorItem( {
            //         text: oGroup.key
            //     });
            // },     
            onSubmitPress: function () {
                var oUserView = this.getView();
                var oAreaSelect = this.byId("AreaSelect");
                var oGroupSelect = this.byId("GroupSelect");

                // Get selected process areas
                var aSelectedAreas = oAreaSelect.getSelectedKeys();

                // Get selected groups
                var aSelectedGroups = oGroupSelect.getSelectedKeys();

                // Define a map of process areas to corresponding groups
                var oAreaGroupMap = {
                    "Inbound": ["Unloading", "Deconsolidation", "Putaway", "Receiving Of Hanndling Units", "Set Ready for warehouse processing"], // Example group keys for Inbound
                    "Outbound": ["Picking", "Packing", "Loading", "Pick Point", "Consumption", "Distribution Equipment"],// Example group keys for Outbound
                    "Internal": ["Inventory Counting", "Adhoc WT creations", "Queries", "Quality Management", "Resource Management"] // Example group keys for Internal
                };

                var bError = false;

                // Validate the selection
                aSelectedAreas.forEach(function (sArea) {
                    if (oAreaGroupMap[sArea]) {
                        var aCorrespondingGroups = oAreaGroupMap[sArea];
                        var bGroupSelected = aSelectedGroups.some(function (sGroup) {
                            return aCorrespondingGroups.includes(sGroup);
                        });

                        if (!bGroupSelected) {
                            bError = true;
                            MessageBox.error("Please select at least one group from the " + sArea + " area.");
                        }
                    }
                });
                if (!bError) {
                    // Get the form inputs
                    var sEmployeeID = this.byId("idEmployeeIDInput").getValue();
                    var sResourceName = this.byId("idResourceNameInput").getValue();
                    var oResourceTypeComboBox = oUserView.byId("idRoesurcetypeInput");
                    var oSelectedItem = oResourceTypeComboBox.getSelectedItem();
                    var sPhone = this.byId("idInputPhoneNumber").getValue();
                    var oEmail = this.byId("idInputEmail").getValue();

                    var oMultiComboBox = this.byId("AreaSelect");
                    // Retrieve the selected items
                    var aSelectedItems = oMultiComboBox.getSelectedKeys();
                    var sSelectedAreas = aSelectedItems.join(",");

                    // Get the selected groups from the MultiComboBox
                    var oItem = this.byId("GroupSelect").getSelectedKeys();
                    var resourceGroup = oItem.join(", ");

                    var bValid = true;
                    var bAllFieldsFilled = true;

                    // Validate Email
                    if (oEmail && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(oEmail)) {
                        oUserView.byId("idInputEmail").setValueState("Information");
                        oUserView.byId("idInputEmail").setValueStateText("email pattern should be xyz@gmail.com");
                        bValid = false;
                    } else {
                        oUserView.byId("idInputEmail").setValueState("None");
                    }

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
                        Loginfirst: true,
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

                    var oMultiComboBox = this.byId("AreaSelect");

                    // Clear all selected items
                    oMultiComboBox.setSelectedKeys([]);
                }
            },
            _fetchUniqueProcessAreas: function () {
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/AreaSet", {
                    success: function (oData) {
                        var aProcessAreas = oData.results;
                        var uniqueProcessAreasSet = new Set();

                        // Add unique Processarea values to the Set
                        aProcessAreas.forEach(function (item) {
                            uniqueProcessAreasSet.add(item.Processarea);
                        });

                        // Convert the Set back to an array for the JSON model
                        var aUniqueProcessAreas = Array.from(uniqueProcessAreasSet).map(function (area) {
                            return { Processarea: area };
                        });

                        var oUniqueModel = new sap.ui.model.json.JSONModel({
                            ProcessAreas: aUniqueProcessAreas
                        });

                        var oMultiComboBox = this.byId("AreaSelect");
                        if (!oMultiComboBox) {
                            // If it's inside a fragment, use Fragment.byId
                            oMultiComboBox = sap.ui.core.Fragment.byId("fragmentId", "AreaSelect");
                        }
                        if (oMultiComboBox) {
                            oMultiComboBox.setModel(oUniqueModel);
                            oMultiComboBox.bindItems({
                                path: "/ProcessAreas",
                                template: new sap.ui.core.Item({
                                    key: "{Processarea}",
                                    text: "{Processarea}"
                                })
                            });
                        } else {
                        }
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error reading AreaSet:", oError);
                    }
                });
            },
            onResourceLoginBtnPress: async function () {
                var oView = this.getView();

                // Retrieve values from input fields
                var sWarehouseNumber = oView.byId("idwhInput").getValue();
                var sResourceId = oView.byId("IdResourceInput").getValue();
                var sPassword = oView.byId("Idpassword").getValue();

                var bValid = true;
                var bAllFieldsFilled = true;

                if (!sWarehouseNumber) {
                    oView.byId("idwhInput").setValueState("Information");
                    oView.byId("idwhInput").setValueStateText("warehouse number is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else if (sWarehouseNumber.length !== 4 || !/^\d+$/.test(sWarehouseNumber)) {
                    oView.byId("idwhInput").setValueState("Information");
                    oView.byId("idwhInput").setValueStateText("Warehouse number must be a 4-digit Alphanumeric value.");
                    bValid = false;
                } else {
                    oView.byId("idwhInput").setValueState("None");
                }
                if (!sResourceId) {
                    oView.byId("IdResourceInput").setValueState("Information");
                    oView.byId("IdResourceInput").setValueStateText("ResourceID number is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else if (sResourceId.length !== 6) {
                    oView.byId("IdResourceInput").setValueState("Information");
                    oView.byId("IdResourceInput").setValueStateText("ResourceID must be a 6-digit numeric value.");
                    bValid = false;
                } else {
                    oView.byId("IdResourceInput").setValueState("None");
                }
                if (!sPassword) {
                    oView.byId("Idpassword").setValueState("Information");
                    oView.byId("Idpassword").setValueStateText("Password number is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oView.byId("Idpassword").setValueState("None");
                }

                if (!bAllFieldsFilled) {
                    sap.m.MessageToast.show("Please Enter all mandatory details");
                    return;
                }
                if (!bValid) {
                    sap.m.MessageToast.show("Please enter correct data");
                    return;
                }

                // Get the model from the component
                var oModel = this.getOwnerComponent().getModel();
                var that = this;
                var todayDate = new Date()
                var today = that.formatDate(todayDate);
                try {
                    // Make the API call to check if the resource exists
                    await oModel.read("/RFUISet('" + sResourceId + "')", {
                        success: function (oData) {
                            // Check if the password matches
                            if (oData.Password === sPassword) {

                                // Check if the user is logging in for the first time
                                if (oData.Loginfirst) {
                                    sap.m.MessageToast.show("Welcome! It seems this is your first login.");
                                   that.sample();

                                }
                                else {
                                    var Id = oData.Resourceid;
                                    this.getRouter().navTo("RouteUsermenu", { id: Id });
                                    sap.m.MessageToast.show("Welcome back!");
                                    oView.byId("idwhInput").setValue();
                                    oView.byId("IdResourceInput").setValue();
                                    oView.byId("Idpassword").setValue();
                                }
                            } else {
                                // If password doesn't match, show an error message
                                sap.m.MessageToast.show("Incorrect password.");
                            }
                        }.bind(this),
                        error: function () {
                            sap.m.MessageToast.show("User does not exist.");
                        }
                    });
                } catch (error) {
                    sap.m.MessageToast.show("An error occurred while checking the user.");
                }

            },
            sample: async function () {
                if (!this.oResetDialog) {
                    this.oResetDialog = await this.loadFragment("Resetpassword")
                }
                this.oResetDialog.open();
            },
            onCancelPress: function () {
                if (this.oResetDialog.isOpen()) {
                    this.oResetDialog.close()
                }
            },
            onSavePress: async function () {
                var oView = this.getView();

                // Retrieve the new password and confirm password from the dialog input fields
                var sNewPassword = oView.byId("idResetNewPassword").getValue();
                var sConfirmPassword = oView.byId("idresetConfirmPassword").getValue();

                // Check if the passwords match
                if (sNewPassword !== sConfirmPassword) {
                    sap.m.MessageToast.show("Passwords do not match. Please try again.");
                    return; // Stop further execution if passwords don't match
                }

                // Retrieve the resource ID from the login view (assuming it's already in context)
                var sResourceId = oView.byId("IdResourceInput").getValue();

                // Prepare the data to update
                var oDataUpdate = {
                    Loginfirst: false,  // Indicates the user has logged in before
                    Password: sNewPassword
                };

                // Get the model from the component
                var oModel = this.getOwnerComponent().getModel();

                // Update the user's password in the backend
                try {
                    await oModel.update(`/RFUISet('${sResourceId}')`, oDataUpdate, {
                        success: function () {
                            sap.m.MessageToast.show("Password updated successfully!");
                            oView.byId("idResetNewPassword").setValue();
                            oView.byId("idresetConfirmPassword").setValue();
                            this.oResetDialog.close()
                            oView.byId("idwhInput").setValue();
                            oView.byId("IdResourceInput").setValue();
                            oView.byId("Idpassword").setValue();

                        }.bind(this),
                        error: function () {
                            sap.m.MessageToast.show("Error updating user login status.");
                        }
                    });
                } catch (error) {
                    sap.m.MessageToast.show("An error occurred while updating the password.");
                }
            },
            formatDate: function (oDate) {
                var sYear = oDate.getFullYear();
                var sMonth = ("0" + (oDate.getMonth() + 1)).slice(-2);
                var sDay = ("0" + oDate.getDate()).slice(-2);

                return `${sYear}-${sMonth}-${sDay}`;
            },
        
        });
    });
