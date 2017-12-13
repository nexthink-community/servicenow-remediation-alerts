# Nexthink Remediation Alerts
## Description
This ServiceNow plug-in offers Nexthink users the possibility of creating Incidents or Change Requests when a remediation action is executed in Nexthink.
For such remediation actions, Nexthink email alerts must be already defined through the Nexthink Finder.
The plug-in provides JavaScript scripts to implement the necessary logic to create Incidents or Change Requests out of those email alerts.
Those Incidents or Changes will include the list of affected devices by the alert.
Also, in this document is described the proper configuration to enable the Inbound Email Actions needed in ServiceNow.

## Functionality
- Automatic creation of ServiceNow Incidents or Change Requests when a remediation action takes place in the Nexthink side.
- Works on Chrome, Firefox, Internet Explorer, Edge and Safari browsers.
- Works on ServiceNow instances with Helsinki version or higher.

## Requirements
Nexthink Remediation Alerts plug-in requires:
- At least one instance of the Nexthink Engine 6.7 or higher.
- Alerts configured in Nexthink Finder 6.7 or higher.
- ServiceNow instance with Helsinki version or higher.
- Chrome, Firefox, Internet Explorer, Edge or Safari web browser.    

## Components
For each component, this plug-in provides the source code for the set-up process.
The following main components are part of the Nexthink Remediation Alerts plug-in.

### Script Includes
This plug-in provides one Script Included, which encapsulates all the logic:
- RemediationManager.js

### Inbound Email Actions
In order to process the emails sent by Nexthink Finder alerts, some Inbound Email Actions are needed in ServiceNow.
For that, this plug-in provides the full code: 
- create_change_from_nexthink_alert.js
- create_incident_from_nexthink_alert.js

### Property
This plug-in needs one property to be set in ServiceNow instance.
The property will set the sys_id or the email of the ServiceNow existing user whom all the Incident and Change Requests created will be assigned.
The property name will be remote_action_user_email.
Please note that if email provided, it must match with the content in the user record field email.

## Installation
The installation process for this plug-in will provide the instructions to populate the Script Include and the Inbound Email Actions.

### Enable Email service
In the ServiceNow instance:
- Change the application scope to Global.
- Navigate to System Properties -> Email Properties and set the Inbound Email Configuration -> Email receiving enabled property to true. 

### Create Script Include
In the ServiceNow instance, please follow the steps below:
- Change the application scope to Global
- Menu System Definition -> Script Includes
- Click on New button
- Please fill in the fields indicated:
  Name: `RemediationManager`
  Accessible from: `All application scopes`
  Active: `Checked`
  Script: `[Content of RemediationManager.js]`  
- Click Submit button

The Script Include has been successfully created in ServiceNow and it is ready to be used by the Inbound Email Actions.

### Create Inbound Email Actions
This plug-in needs two Inbound Email Actions in ServiceNow to be able to create Incidents or Change Requests out of a Nexthink alert email.
The names for the Inbound Email Actions should be:
- Create incident from Nexthink Alert
- Create change from Nexthink Alert

Now, the process to create an Inbound Email Action is described.
In the ServiceNow instance, please follow the instructions below to create both Inbound Email Actions needed:
- Change the application scope to Global
- Menu System Policy -> Email -> Inbound Actions
- Click on New button
- Please fill in the fields indicated:
  Name: `Please fill in this field with one of the names indicated above`
  Target table: `Incident [incident] / Change Request [change_request]`
  Active: `Checked`
  Action type: `Record Action`
  TAB When to run	
  Type: `New`
  TAB Actions	
  Script: `[Content of create_incident_from_nexthink_alert.js / create_change_from_nexthink_alert.js]`
- Click on Submit button

Please note, the steps described above must be done for both Inbound Email Action names indicated at the beginning of this sub-chapter. 
At the end of these steps, ServiceNow will have two new Inbound Email Actions with Active field set to true.
As both actions are active, when an email from an alert is received at ServiceNow, a new Incident and a new Change Request will be created simultaneously.
To avoid this situation, only one of the Inbound Email Actions must be active, based on the customer needs.
Please note that, if emails are already being received into the ServiceNow instance, it should be considered to add conditions in both Inbound Email Actions in order to filter (based on subject, to, etc) the emails that come from Nexthink alerts.
Have in mind that alerts are sent from Nexthink using the noreply@nexthink.com email address.

### Create Property
In the ServiceNow instance, please follow the steps below to create this new property:
- Change the application scope to Global
- Enter sys_properties.list in the navigation filter. Verify the property that you want to create does not already exist
- Click on New button
- Please fill in the fields indicated:
  Name: `remote_action_user_email`
  Type: `String`
  Value: `[sys_id or email address of the user to assign the incidents and change requests]`
- Click on Submit button.

With those steps, the property is ready. From now on, all the Incidents or Change Requests created from Nexthink alerts, will be assigned to that user.

### Configure Incident and Change Request view
As mentioned in the description chapter, the devices affected by the Nexthink alert will be included as Affected Cis in the Incident or Change Request.
If this list is not visible in the ServiceNow instance, the Incident and Change Request view must be edited to display this list.
Please note that for this operation, the user must have enough privileges to edit views in ServiceNow.
To do so, once in the ServiceNow instance, please follow the steps below:
- Change the application scope to Global
- Go to any existing incident/change request
- Right click in the top grey bar and select Configure -> Form Layout
- Under Form view and section area select the section where the Affected CI list will be displayed
- In the Available list, select Affected CIs and move it to Selected list
- Click on Save button

From now on, all the Incidents and Change Requests will display the Affected CIs list.

## Run Jasmine tests
ServiceNow Jasmine-based environment for unit testing is available from Istanbul version.
Unit tests to be run in such platform are included.

### Prepare environment
In the ServiceNow instance:
- Change the application scope to Global
- Browse Automatic Test Framework on the main menu
- Select Tests
- Insert test records, copying and pasting every test snippet
- Go back to Automatic Test Framework on the main menu
- Select Suites
- Create one test suite that includes all the tests previously created

### Run the tests
In the ServiceNow instance:
- Change the application scope to Global
- Browse Automatic Test Framework on the main menu
- Select Suites
- Click on the test suite just created
- Click on Run Test Suite to run all the tests associated
