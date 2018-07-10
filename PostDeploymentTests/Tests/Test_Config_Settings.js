define([], function () {

    QUnit.test("Configuration checks", function (assert) {
        assert.ok(config.targetSystem !== null, "TargetSystem is not null");
        assert.ok(config.targetSystem !== "", "TargetSystem is not empty");
    });

});
