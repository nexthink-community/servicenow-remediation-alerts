describe("Test for RemediationManager:", function() {
    var remediation;
    var caller_id;
    var device_name_list;
    var sys_id_create_record;
    
    beforeEach(function() {
        caller_id = "admin";
        device_name_list = ["dev01", "dev02"];
        sys_id_create_record = "000000000001";
        remediation = new x_nexsa_imc.RemediationManager();
        // Mock access functions
        spyOn(remediation, "_getDeviceListFromEmail").andReturn(device_name_list);
        spyOn(remediation, "_getRemoteActionUserEmail").andReturn(caller_id);
        spyOn(remediation, "_createRecord").andReturn(sys_id_create_record);
        spyOn(remediation, "_insertAffectedCis").andReturn(caller_id);
    });
    
    it("Create new task (incident or change_request)", function() {
        // We are testing just incident and not change_request to because both share the common
        // functionality that is tested in this test.
        var obj = {};
        var type = "incident";
        
        var email = {origemail: 'origemail', body_text: 'body_text', subject: 'the subject xxxxx'};
        
        remediation.createTaskFromAlert(obj, email, type);
        
        expect(remediation._getDeviceListFromEmail).toHaveBeenCalledWith(email);
        expect(remediation._getRemoteActionUserEmail).toHaveBeenCalled();
        expect(remediation._createRecord).toHaveBeenCalledWith(obj, email, caller_id, type);
        expect(remediation._insertAffectedCis).toHaveBeenCalledWith(sys_id_create_record, device_name_list);
    });
});
    
jasmine.getEnv().execute();