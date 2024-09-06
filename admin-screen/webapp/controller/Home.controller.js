sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library"
],
    function (Controller, Device, JSONModel, Popover, Button, library) {
        "use strict";

        return Controller.extend("com.app.adminscreen.controller.Home", {
            onInit: function () {
                var oModel = new JSONModel(sap.ui.require.toUrl("com/app/adminscreen/model/data.json"));
                this.getView().setModel(oModel);
                this._setToggleButtonTooltip(!Device.system.desktop);
                var oModelV2 = this.getOwnerComponent().getModel();
                this.getView().byId("pageContainer").setModel(oModelV2);
            },
            onItemSelect: function (oEvent) {
                var oItem = oEvent.getParameter("item");
                this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));

                var oTable = this.byId("idRequestDataTable");
                var oBinding = oTable.getBinding("items");
                // Create a filter to show only items where Status is true
                var oStatusFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "");
                // Apply the filter to the table binding
                oBinding.filter([oStatusFilter]);

                var oTable = this.byId("idUsersInformationTable");
                var oBinding = oTable.getBinding("items");
                // Create a filter to show only items where Status is true
                var oStatusFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, true);
                // Apply the filter to the table binding
                oBinding.filter([oStatusFilter]);
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
            onApprovePress: function () {
                var oTable = this.byId("idRequestDataTable");
                var aSelectedItems = oTable.getSelectedItems();
                var oModel = this.getOwnerComponent().getModel(); // Assuming your model is bound to the view

                if (aSelectedItems.length === 0) {
                    sap.m.MessageToast.show("Please select at least one item.");
                    return;
                }

                function generatePassword() {
                    const regex = /[A-Za-z@!#$%&]/;
                    const passwordLength = 8;
                    let password = "";

                    for (let i = 0; i < passwordLength; i++) {
                        let char = '';
                        while (!char.match(regex)) {
                            char = String.fromCharCode(Math.floor(Math.random() * 94) + 33);
                        }
                        password += char;
                    }

                    return password;
                }
                var oPassword = generatePassword();
                var that = this;

                // Iterate through selected items and update the fields
                aSelectedItems.forEach(function (oItem) {
                    var oContext = oItem.getBindingContext();
                    var sPath = oContext.getPath();
                    var sResourceType = oContext.getProperty("Resouecetype");// Get the Resource Type (Permanent/Temporary)


                    var oExpiryDate = new Date();
                    // Set the expiry date based on the resource type
                    if (sResourceType === "PermanentEmployee") {
                        oExpiryDate.setFullYear(oExpiryDate.getFullYear() + 1); // 1 year for permanent employees
                    } else if (sResourceType === "temporaryemployee") {
                        oExpiryDate.setMonth(oExpiryDate.getMonth() + 2); // 2 months for temporary employees
                    }

                    var oCurrentDateTime = new Date();
                    var sFormattedCurrentDateTime = that.formatDate(oCurrentDateTime);
                    var sFormattedExpiryDate = that.formatDate(oExpiryDate);

                    var oData = {
                        Notification: "your request has been Approved",
                        Approveddate: sFormattedCurrentDateTime,
                        Expirydate: sFormattedExpiryDate,
                        Password: oPassword,
                        Status: "true"
                    };

                    oModel.update(sPath, oData, {
                        success: function () {
                            sap.m.MessageToast.show("Approved!");
                        }.bind(this),
                        error: function () {
                            sap.m.MessageToast.show("Error updating items.");
                        }
                    });
                });
            },
            formatDate: function (oDate) {
                var sYear = oDate.getFullYear();
                var sMonth = ("0" + (oDate.getMonth() + 1)).slice(-2);
                var sDay = ("0" + oDate.getDate()).slice(-2);

                return `${sYear}-${sMonth}-${sDay}`;
            },
            onDeleteSelected: function () {
                // Get the table object
                var oTable = this.byId("idRequestDataTable");

                // Get the selected items
                var aSelectedItems = oTable.getSelectedItems();

                if (aSelectedItems.length === 0) {
                    sap.m.MessageToast.show("Please select at least one item to delete.");
                    return;
                }

                // Get the model (assuming it's an OData model)
                var oModel = this.getOwnerComponent().getModel();

                // Loop through the selected items and delete them using oModel.remove
                aSelectedItems.forEach(function (oSelectedItem) {
                    var oContext = oSelectedItem.getBindingContext();
                    var sPath = oContext.getPath();

                    // Perform the delete operation
                    oModel.remove(sPath, {
                        success: function () {
                            sap.m.MessageToast.show("Item deleted successfully.");
                        },
                        error: function () {
                            sap.m.MessageToast.show("Error occurred while deleting the item.");
                        }
                    });
                });

                // Clear the table selection
                oTable.removeSelections(true);
            },
            onDeleteResBtnPress: function () {
                // Get the table object
                var oTable = this.byId("idUsersInformationTable");

                // Get the selected items
                var aSelectedItems = oTable.getSelectedItems();

                if (aSelectedItems.length === 0) {
                    sap.m.MessageToast.show("Please select at least one item to delete.");
                    return;
                }

                // Get the model (assuming it's an OData model)
                var oModel = this.getOwnerComponent().getModel();

                // Loop through the selected items and delete them using oModel.remove
                aSelectedItems.forEach(function (oSelectedItem) {
                    var oContext = oSelectedItem.getBindingContext();
                    var sPath = oContext.getPath();

                    // Perform the delete operation
                    oModel.remove(sPath, {
                        success: function () {
                            sap.m.MessageToast.show("Resource deleted successfully.");
                        },
                        error: function () {
                            sap.m.MessageToast.show("Error occurred while deleting the item.");
                        }
                    });
                });

                // Clear the table selection
                oTable.removeSelections(true);
            },
            // sendemail:function(){
            // const sgMail = require('@sendgrid/mail');
            // sgMail.setApiKey('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');

            // const msg = {
            //     to: 'sripaloju47@gmail.com',
            //     from: 'sender@example.com', // Use the email address or domain you verified
            //     subject: 'Hello from SendGrid',
            //     text: 'This is a plain text email.',
            //     html: '<strong>This is an HTML email.</strong>',
            // };

            // sgMail.send(msg)
            //     .then(() => {
            //         console.log('Email sent');
            //     })
            //     .catch((error) => {
            //         console.error(error);
            //     });
            // },
            sendemail: function() {
                var apiKey = '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';
                var emailData = {
                    personalizations: [{
                        to: [{ email: 'sripaloju47@gmail.com' }],
                        subject: 'Hello from SendGrid'
                    }],
                    from: { email: 'sender@example.com' },
                    content: [{
                        type: 'text/plain',
                        value: 'This is a plain text email.'
                    }]
                };
            
                // Use fetch API to send the email
                fetch('https://api.sendgrid.com/v3/mail/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(emailData)
                })
                .then(response => {
                    if (response.ok) {
                        sap.m.MessageToast.show("Email sent successfully!");
                    } else {
                        response.json().then(error => {
                            console.error('Error sending email:', error);
                            sap.m.MessageToast.show("Failed to send email.");
                        });
                    }
                })
                .catch(error => {
                    console.error('Network error:', error);
                    sap.m.MessageToast.show("Network error occurred while sending email.");
                });
            },            

        });
    });
