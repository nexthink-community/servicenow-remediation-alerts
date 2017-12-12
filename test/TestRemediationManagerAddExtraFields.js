describe("Test for RemediationManager:", function() {
    
    it("Check add extra fields based on task type", function() {
        var remediation = new x_nexsa_imc.RemediationManager();
        var obj = {};
        var type = "incident";
        var _RESOLVED_STATE = 6;
        var _CLOSED_STATE = 3;
        
        remediation._addExtraFields(obj, type);
        
        expect("category" in obj).toBe(true);
        expect("state" in obj).toBe(true);
        expect("contact_type" in obj).toBe(true);
        expect(obj.state == _RESOLVED_STATE).toBe(true);
        
        type = "change_request";
        
        obj = {};
        remediation._addExtraFields(obj, type);
        
        expect("state" in obj).toBe(true);
        expect(obj.state == _CLOSED_STATE).toBe(true);
    });
});
    
jasmine.getEnv().execute();