describe("Test for RemediationManager:", function() {
	var remediation;
	var email;
	var body_html = 'what ever <table>other table</table> <table>table inside with <o:p></o:p> tags</table>';
	
	beforeEach(function() {
		remediation = new x_nexsa_imc.RemediationManager();
		email = {body_html: body_html};
    });
	
	it("Check extract device HTML table from a Nexthink email alert", function() {
		var exp = '<table>table inside with  tags</table>';
		var ret = remediation._extractDevicesHTMLTable(email);
		expect(ret).toEqual(exp);
	});
});
	
jasmine.getEnv().execute();