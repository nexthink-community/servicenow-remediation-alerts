describe("Test for RemediationManager:", function() {
	
	var TABLE_INCIDENTS;
	
	var remediation;
	
	var number;
	
	beforeEach(function() {
		TABLE_INCIDENTS = 'incident';
		
		remediation = new x_nexsa_imc.RemediationManager();
		// mock _addExtraFields because has been tested in other place
		spyOn(remediation, "_addExtraFields");
    });
	
	afterEach(function() {
		// Clean just in case
		var obj = new GlideRecord(TABLE_INCIDENTS);
		obj.addQuery("number", number);
		obj.deleteMultiple();
    });
	
	it("Create a new incident", function() {
		// We are testing just incident and not change_request to because both share the common
		// functionality that is tested in this test.
		var type = "incident";
		var caller_id = "admin";
		var email = {origemail: 'origemail', body_text: 'body_text', subject: 'the subject xxxxx'};
		var obj = new GlideRecord(TABLE_INCIDENTS);
		obj.initialize();
		
		remediation._createRecord(obj, email, caller_id, type);
		
		number = obj.number;
		
		expect(remediation._addExtraFields).toHaveBeenCalledWith(obj, type);
		expect("caller_id" in obj).toBe(true);
		expect("assigned_to" in obj).toBe(true);
		expect("comments" in obj).toBe(true);
		expect("short_description" in obj).toBe(true);
	});
});
	
jasmine.getEnv().execute();