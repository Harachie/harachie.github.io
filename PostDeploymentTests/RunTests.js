var page = require('webpage').create();
var args = require('system').args;
var fs = require('fs');
var url;

var config = {
    "sourceSystem": "xmg-bkr.efi.internal/PostDeploymentTests",
    "targetSystem": "xmg-bkr.efi.internal",
    "testSuite": "/Tests/SmartCanvasTests.json",
    "publicKey": "82E1F02F",
    "privateKey": "4B8E980D67E5FDE0491A9724B90F5EAE9B642B26AC6E86B1",
    "adminPublicKey": "",
    "adminPrivateKey": ""
};

if (args[1]) {
    config = JSON.parse(decodeURI(args[1]));
}

url = "https://" + config.sourceSystem + "/RunTests.html#" + JSON.stringify(config);

function writeFinalResult(data) {
    console.log("Total: ", data.total, " Failed: ", data.failed, " Passed: ", data.passed, " Runtime: ", data.runtime);
}

function writeGenericErrorMessage(message) {
    fs.write('output.html', message, 'w');
    writeFinalResult({ "total": 1, "failed": 1, "passed": 0, "runtime": 1 });
}

page.open(url, function (status) {
    if (status !== "success") {
        writeGenericErrorMessage("Failed to load url: " + url);
        phantom.exit();
    }
});

page.onCallback = function (data) {   
    page.evaluate(function () {
        cleanUp();
    });
    fs.write('output.html', page.content, 'w');
    writeFinalResult(data);
    phantom.exit();
};


