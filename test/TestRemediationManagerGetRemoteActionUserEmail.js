describe("Test for RemediationManager:", function() {
	var remediation;
	
	var number;
	
	beforeEach(function() {
		
		remediation = new x_nexsa_imc.RemediationManager();
    });
	
	it("Check access to property global.remote_action_user_email", function() {
		var current_value = gs.getProperty(remediation._PROP_REMOTE_ACTION_USER_EMAIL);
		
		var prop_value = remediation._getRemoteActionUserEmail();
		
		expect(prop_value).toEqual(current_value);
	});
});
	
jasmine.getEnv().execute();