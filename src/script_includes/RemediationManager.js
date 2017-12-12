var RemediationManager = Class.create();
RemediationManager.prototype = {
    
    /**
     * Class to manage Nexthink alerts received through Inbound Actions. This class can be invoked
     * to create an incident or change_request
     * @constructor
     */
    initialize: function() {
        this._PROP_REMOTE_ACTION_USER_EMAIL = 'global.remote_action_user_email';
        this._INCIDENT_CATEGORY = 'inquiry';
        this._INCIDENT_CONTACT_TYPE = 'email';
        // The incidents will be created as RESOLVED
        this.incident_state = 6; // RESOLVED state
        this.change_request_state = 3; //CLOSED state
    },
    
    /**
     * Creates a task from an email alert
     * @param {object} current - GlideRecord to be inserted in database
     * @param {object} email - EmailObject with information from the email received
     * @param {string} type - 'incident' or 'change_request'. Based on this values, more
     * information can be added to the record.
     */
    createTaskFromAlert: function(current, email_obj, type) {
        // Get the user ID which the task will be assigned
        
        var device_name_list = this._getDeviceListFromEmail(email_obj);
        
        var sys_id = this._createRecord(current, email_obj, this._getRemoteActionUserEmail(), type);
        
        this._insertAffectedCis(sys_id, device_name_list);
    },
    
    /**
     * Gets the value for global.remote_action_user_email property
     * @return {string} - Value for this._PROP_REMOTE_ACTION_USER_EMAIL property
     */
    _getRemoteActionUserEmail: function() {
        return gs.getProperty(this._PROP_REMOTE_ACTION_USER_EMAIL);
    },
    
    /**
      * Creates a new record (the table name already comes in 'current' var)
     * Basic information about caller_id, assigned_to, comments and short description
     * are set. Moreover, based on 'type' value, more information is added.
     * @param {object} current - GlideRecord to be inserted in database
     * @param {object} email - EmailObject with information from the email received
     * @param {string} caller_id - User Id or email of the user which the task will be
     * asisgend to.
     * @param {string} type - 'incident' or 'change_request'. Based on this values, more
     * information can be added to the record.
     * @return {string} The sys_id of the new record created
     */
    _createRecord: function(current, email, caller_id, type) {
        current.caller_id = caller_id;
        current.assigned_to = caller_id;
        current.comments =  '[code]' + "Remediation alert received from: " + email.origemail + "<br><br>" + email.body_html+'[/code]';        
        
        current.short_description = email.subject;

        this._addExtraFields(current, type);

        return current.insert();
    },
    
    /**
     * Gets the device list of devices in a Nexthink email alert.
     * The device table is extracted and, from that, the device list extracted
     * using XPath and regular expression.
     * @param {object} email - Email data
     * @return {object} List of device names
     */
    _getDeviceListFromEmail: function (email) {
        var device_name_list = [];
        var table_string = this._extractDevicesHTMLTable(email);

        var xmlDoc = new XMLDocument2();
        xmlDoc.parseXML(table_string);

        var iter = xmlDoc.getNode("//tbody").getChildNodeIterator();
        var i = 0;
        while (iter.hasNext()) {
            var node_tr = iter.next();
            // when i > 1 because the firs is the table header
            if (i > 1 && !gs.nil(node_tr)) {
                var match_list = node_tr.toString().match(/.*?<span.*?>(.*?)<\/span>/);
                if(match_list){
                    device_name_list.push(match_list[1]);
                }
            }
            i += 1;
        }
        return device_name_list;
    },
    
    /**
     * Function to extract the second table that comes in a Nexthink email alert, which
     * is the device table
     * @param {object} email - Email data
     * @return {string} Substring with the device table in HTML
     **/
    _extractDevicesHTMLTable: function (email) {
        var n = email.body_html.indexOf("<table");
        var table_index_init = email.body_html.indexOf("<table", (n+1));
        var table_index_end = email.body_html.indexOf("</table>", table_index_init);
        var table_string = email.body_html.substring(table_index_init, table_index_end + ("</table>".length));
        return table_string.replace(/<o:p><\/o:p>/g, "");
    },
    
    /**
     * Adds more information based on 'incident' or 'change_request' task.
     * @param {object} current - GlideRecord to be inserted in database
     * @param {string} type - 'incident' or 'change_request'. Based on this values, more
     * information can be added to the record.
     */
    _addExtraFields: function(current, type) {
        if (type === "incident") {
            current.category = this._INCIDENT_CATEGORY;
            current.state = this.incident_state;
            current.contact_type = this._INCIDENT_CONTACT_TYPE;
        } else if (type === "change_request") {
            current.state = this.change_request_state;
        }
    },
    
    /**
     * Inserts in task_ci, which is the table to link a Tasks (incident or change_request) with
     * ci's
     * @param {string} sys_id_task - Sys Id if the task to link the devices
     * @param {object} device_name_list - List of device names to link to the task
     */
    _insertAffectedCis: function (sys_id_task, device_name_list) {
        for(var i = 0; i < device_name_list.length; i++){
            var list_cis = getRecordFieldValue("cmdb_ci_computer", ["sys_id"], {name: device_name_list[i]});
            var sys_id_device = list_cis[0]["sys_id"];
            var gr = new GlideRecord("task_ci");
            gr.initialize();
            gr.ci_item = sys_id_device;
            gr.task = sys_id_task;
            gr.insert();
        }
    },

    type: 'RemediationManager'
};