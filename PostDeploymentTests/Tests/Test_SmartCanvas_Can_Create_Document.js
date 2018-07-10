define([], function () {

    QUnit.test("SmartCanvas: create empty document", function (assert) {
        var done = assert.async();

        function createEmptyDocument(name, displayName) {
            var model = dsmx.model.smartServer.createModel.create();

            // state.campaignName = name;

            model.name = name;
            model.displayName = displayName;
            model.importDefaultFonts = true;

            dsmx.api.smartServer.e.createDocumentTemplate(model, function (responseObject) {
                assert.ok(responseObject > 0, "CampaignId > 0");
                done();

            }, function (eo) {
                assert.ok(false, eo.message + ", campaign name: " + name);
                done();
            })
        }

        createEmptyDocument(dsmx.algorithm.createGuid().replace(/-/g, ""), "");

    });

});