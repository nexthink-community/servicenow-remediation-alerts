describe("Test for RemediationManager:", function() {
    var remediation;
    var sys_id_device;
    var sys_id_task;
    var device_name_list;
    
    beforeEach(function() {
        remediation = new x_nexsa_imc.RemediationManager();
        sys_id_device = "000000001";
        sys_id_task = "00000000002";
        device_name_list = ["nxt-device1"];
        x_nexsa_imc.getRecordFieldValue = jasmine.createSpy("getRecordFieldValue() spy").andReturn([{sys_id: sys_id_device}]);
    });
    
    it("Insert affected CIs", function() {        
        remediation._insertAffectedCis(sys_id_task, device_name_list);
        
        // Check if it was inserted
        var gr = new GlideRecord("task_ci");
        gr.addQuery("ci_item", sys_id_device);
        gr.addQuery("task", sys_id_task);
        gr.query();
        
        expect(gr.hasNext()).toBe(true);
        while(gr.next()){
            expect(gr.getValue("ci_item")).toEqual(sys_id_device);
            expect(gr.getValue("task")).toEqual(sys_id_task);
        }
        expect(x_nexsa_imc.getRecordFieldValue).toHaveBeenCalled();
    });
});
    
jasmine.getEnv().execute();