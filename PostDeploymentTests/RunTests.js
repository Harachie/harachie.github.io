var page = require('webpage').create();
var url = "https://harachie.github.io/PostDeploymentTests/RunTests.html#{%22sourceSystem%22:%22harachie.github.io/PostDeploymentTests%22,%22targetSystem%22:%22xmg-bkr.efi.internal%22,%22testSuite%22:%22/Tests/SmartCanvasTests.json%22,%22publicKey%22:%2282E1F02F%22,%22privateKey%22:%224B8E980D67E5FDE0491A9724B90F5EAE9B642B26AC6E86B1%22,%22adminPublicKey%22:%22%22,%22adminPrivateKey%22:%22%22}";

page.open(url, function (status) {
   
});

page.onCallback = function (data) {
    console.log("Total: ", details.total, " Failed: ", details.failed, " Passed: ", details.passed, " Runtime: ", details.runtime);
    phantom.exit();
};


