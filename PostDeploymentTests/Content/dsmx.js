(function (factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        //AMD. Register as anonymous module.
        define(["jquery"], factory);
    } else if (typeof exports === "object") {
        //CommonJS
        module.exports = factory(require("jquery"));
    } else {
        //Browser globals.
        window.dsmx = factory(jQuery, window.dsmx);
    }
	
	
})(function ($, dsmxApi) {
    "use strict";

    var dsmx = dsmxApi || {};

    function isDefined(v) {
        return (typeof v !== "undefined");
    }

    function isNotNull(obj) {
        return (obj !== null);
    }

    function isAssigned(obj) {
        return isDefined(obj) && isNotNull(obj);
    }

    function isFunction(obj) {
        return isDefined(obj) && (typeof obj === "function");
    }

    dsmx.config = dsmx.config || {}; //can be set before js loaded
    dsmx.settings = dsmx.settings || {}; //can be set before js loaded
    dsmx.algorithm = {};
    dsmx.signing = {};
    dsmx.api = {};
    dsmx.api.core = {};
    dsmx.api.test = {};
    dsmx.api.contacts = { e: {}, statistics: { e: {} }, unsubscribers: { e: {} } };
    dsmx.api.duplicateContacts = { e: {} };
    dsmx.api.portalUsers = { e: {} };
    dsmx.api.portalSkins = { e: {} };
    dsmx.api.portalUserRoles = {};
    dsmx.api.portalUserRoles.e = {};
    dsmx.api.campaignTemplates = {};
    dsmx.api.campaignTemplates.e = {};
    dsmx.api.campaignCategories = {};
    dsmx.api.admin = { e: {} };
    dsmx.api.login = {};
    dsmx.api.accounts = { e: {} };
    dsmx.api.dataRelations = { e: {}, extensionItems: {} };
    dsmx.api.campaignDatabase = { e: {}, extensionItems: {} };
    dsmx.api.resources = { e: {} };
    dsmx.api.userUploads = { e: {}, admin: {} };
    dsmx.api.dataRelations.admin = { e: {} };
    dsmx.api.dataRelations.admin.campaign = { e: {} };
    dsmx.api.contacts.filter = {};
    dsmx.api.smartServer = { e: {} };
    dsmx.api.serverSettings = { e: {} };
    dsmx.api.twitter = { e: {} };
    dsmx.api.applications = { e: {} };
    dsmx.api.applications.admin = { e: {} };
    dsmx.api.fonts = { e: {} };
    dsmx.api.fonts.admin = { e: {} };
    dsmx.api.impositions = { e: {} };
    dsmx.api.impositions.admin = { e: {} };
    dsmx.api.dbSync = { e: {} };
    dsmx.api.dbSync.admin = { e: {} };
    dsmx.api.dashboard = { e: {} };
    dsmx.api.dashboard.smartCampaign = { e: {} };
    dsmx.api.extensionItems = {};
    dsmx.api.extensionItems.admin = {};
    dsmx.api.extensionItems.admin.categories = { e: {} };
    dsmx.api.extensionItems.admin.items = { e: {} };
    dsmx.api.extensionItems.admin.versions = { e: {} };
    dsmx.api.extensionItems.categories = { e: {} };
    dsmx.api.extensionItems.items = { e: {} };
    dsmx.api.extensionItems.versions = { e: {} };
    dsmx.api.smartCampaign = { e: {} };
    dsmx.api.database = { e: {} };
    dsmx.api.database.admin = { e: {} };
    dsmx.api.campaigns = {};
    dsmx.api.emails = { e: {} };
    dsmx.api.emails.smtpServers = { e: {} };
    dsmx.api.buckets = { e: {} };
    dsmx.api.translations = { e: {} };
    dsmx.api.svg = { e: {} };

    dsmx.model = {};
    dsmx.model.codeContract = {};
    dsmx.model.dataRelations = {};

    dsmx.api.login.e = {};
    dsmx.api.contacts.filter.e = {};

    /* config start */

    dsmx.config.targetSystem = dsmx.config.targetSystem || null;
    dsmx.config.targetDirectory = dsmx.config.targetDirectory || null;
    dsmx.config.targetProtocol = dsmx.config.targetProtocol || "https";
    dsmx.config.targetPort = dsmx.config.targetPort || null;
    dsmx.config.publicKey = dsmx.config.publicKey || null;
    dsmx.config.privateKey = dsmx.config.privateKey || null;
    dsmx.config.adminPublicKey = dsmx.config.adminPublicKey || null;
    dsmx.config.adminPrivateKey = dsmx.config.adminPrivateKey || null;

    dsmx.config.addDesignerHeader = dsmx.config.addDesignerHeader || false;
    dsmx.config.campaignName = dsmx.config.campaignName || null;
    dsmx.config.customerId = dsmx.config.customerId || 0;
    dsmx.config.sourcePublicKey = dsmx.config.sourcePublicKey || null;

    dsmx.config.getFinalTargetUrlInternal = function (returnProtocolRelativeUrl) {
        var final = "";

        if (dsmx.config.targetSystem) {
            var index = dsmx.config.targetSystem.indexOf("/");
            var system;
            var directory;

            if (index > 0) {
                system = dsmx.config.targetSystem.substring(0, index);
                directory = dsmx.config.targetSystem.substring(index + 1);

                dsmx.config.targetSystem = system;
                dsmx.config.targetDirectory = directory;
            }
        }

        if (returnProtocolRelativeUrl === false && dsmx.config.targetProtocol) {
            final += dsmx.config.targetProtocol + ":";
        }

        final += "//" + dsmx.config.targetSystem;

        if (dsmx.config.targetPort) {
            final += ":" + dsmx.config.targetPort;
        }

        if (dsmx.config.targetDirectory) {
            final += "/" + dsmx.config.targetDirectory;
        }

        return final;
    };

    dsmx.config.getFinalTargetUrl = function () {
        return dsmx.config.getFinalTargetUrlInternal(false);
    };

    dsmx.config.getProtocolRelativeTargetUrl = function () {
        return dsmx.config.getFinalTargetUrlInternal(true);
    };

    dsmx.config.adjustApiPath = function (apiPath) {
        var final = apiPath;

        if (dsmx.config.targetDirectory) {
            final = "/" + dsmx.config.targetDirectory + apiPath; //api path is always "/api/blah" (with leading slash)
        }

        return final;
    };

    dsmx.config.assert = function () {
        if (!dsmx.config.targetSystem) {
            throw "dsmx.config.targetSystem is not set.";
        }
    };

    dsmx.config.useSigned = function () {
        if (dsmx.config.publicKey && dsmx.config.privateKey) {
            return true;
        }

        return false;
    };

    /* config end */

    /* settings start */

    dsmx.settings.preferredCountryProperty = "englishName";
    dsmx.settings.preferredLanguageProperty = "name";

    /* settings end */

    /* algorithm start */

    dsmx.algorithm.arrayReplace = function (str, arr) {
        var rx;
        var i;

        for (i = 0; i < arr.length; i += 1) {
            rx = new RegExp("\\{" + i + "\\}", "g");
            str = str.replace(rx, arr[i]);
        }

        return str;
    };

    dsmx.algorithm.arrayApply = function (arr, applier) {
        var i;

        if (dsmx.api.isArray(arr)) {
            for (i = 0; i < arr.length; i += 1) {
                applier(arr[i]);
            }
        }
    };

    dsmx.algorithm.arrayApplyWhere = function (arr, applier, condition) {
        var i;

        if (dsmx.api.isArray(arr)) {
            for (i = 0; i < arr.length; i += 1) {
                if (condition(arr[i])) {
                    applier(arr[i]);
                }
            }
        }
    };

    dsmx.algorithm.htmlEncode = function (value) {
        //create a in-memory div, set it's inner text(which jQuery automatically encodes)
        //then grab the encoded contents back out.  The div never exists on the page.
        return $("<div/>").text(value).html();
    };

    dsmx.algorithm.hmacSha256 = function (data, password) {
        return CryptoJS.HmacSHA256(data, password);
    };

    dsmx.algorithm.md5 = function (data, password) {
        return CryptoJS.MD5(data + password);
    }

    dsmx.algorithm.currentUtcDateTimeStamp = function () {
        return (new Date()).toISOString().replace(/T/, " ").replace(/\..+/, "") + "Z";
    };

    dsmx.algorithm.currentUtcDateStamp = function () {
        return (new Date()).toISOString().replace(/T.+/, "");
    };

    dsmx.algorithm.getSortedKeys = function (o) {
        var keys = [];
        var p;

        Object.keys(o).forEach(function (p) {
            if (o.hasOwnProperty(p)) {
                keys.push(p);
            }
        });

        keys.sort();

        return keys;
    };

    dsmx.algorithm.createGuid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };

    dsmx.algorithm.sealMd5 = function (sharedSecret, parameterArray) {
        var seal;
        var data = "";
        var i;

        for (i = 0; i < parameterArray.length; i++) {
            data += parameterArray[i].name + parameterArray[i].value;
        }

        seal = dsmx.algorithm.md5(data, sharedSecret).toString().toUpperCase();

        return seal;
    };

    dsmx.algorithm.sealParameters = function (sharedSecret, authenticationCode, parameterArray) {
        var finalParameterArray = [];
        var i;

        for (i = 0; i < parameterArray.length; i++) {
            finalParameterArray.push(parameterArray[i]);
        }

        finalParameterArray.push({ "name": "ac", "value": authenticationCode });
        finalParameterArray.push({ "name": "seal", "value": dsmx.algorithm.sealMd5(sharedSecret, finalParameterArray) });
        finalParameterArray.push({ "name": "sealMethod", "value": "MD5" });
        finalParameterArray.push({ "name": "sealType", "value": "DSMXLicense" });

        return finalParameterArray;
    };

    dsmx.algorithm.createStreamImageUrl = function (dsmiBaseUrl, sharedSecret, authenticationCode, parameterArray) {
        var seal;
        var url;
        var parameters = "";
        var keyValues = [];
        var finalParameterArray = [];
        var i;

        for (i = 0; i < parameterArray.length; i++) {
            finalParameterArray.push(parameterArray[i]);
        }

        finalParameterArray.push({ "name": "ac", "value": authenticationCode });
        finalParameterArray.push({ "name": "seal", "value": dsmx.algorithm.sealMd5(sharedSecret, finalParameterArray) });
        finalParameterArray.push({ "name": "sealMethod", "value": "MD5" });
        finalParameterArray.push({ "name": "sealType", "value": "DSMXLicense" });

        for (i = 0; i < finalParameterArray.length; i++) {
            keyValues.push(finalParameterArray[i].name + "=" + encodeURIComponent(finalParameterArray[i].value));
        }

        url = dsmiBaseUrl + "/streamimage.aspx?" + keyValues.join("&");

        return url;
    };

    /* algorithm end */



    /* signing start */

    dsmx.signing.getEditPageSignData = function (privateKey) {
        var currentUtcDateTimeStamp = dsmx.algorithm.currentUtcDateTimeStamp();
        var derivedKey = dsmx.algorithm.hmacSha256(currentUtcDateTimeStamp, privateKey);
        var sign = dsmx.algorithm.hmacSha256("EditPageSign", derivedKey);

        return { sign: sign, dateStamp: currentUtcDateTimeStamp };
    };

    dsmx.signing.addHmacSha256HeaderGetDateTimeStamp = function (publicKey, request) {
        var currentUtcDateTimeStamp = dsmx.algorithm.currentUtcDateTimeStamp();

        request.setRequestHeader("X-DSM-Algo", "hmacsha256");
        request.setRequestHeader("X-DSM-Id", publicKey);
        request.setRequestHeader("X-DSM-Time", currentUtcDateTimeStamp);

        if (dsmx.config.addDesignerHeader) {
            request.setRequestHeader("X-DSM-Cid", dsmx.config.customerId);
            request.setRequestHeader("X-DSM-Campaign", dsmx.config.campaignName);
        }

        if (dsmx.config.sourcePublicKey) {
            request.setRequestHeader("X-DSM-Sid", dsmx.config.sourcePublicKey);
        }

        return currentUtcDateTimeStamp;
    };

    dsmx.signing.getPreDerivedKey = function (privateKey, targetSystem, timestamp, requestMethod, targetApi) {
        var lowerTargetSystem = targetSystem.toLocaleLowerCase();
        var derivedKey = dsmx.algorithm.hmacSha256(lowerTargetSystem, privateKey);

        derivedKey = dsmx.algorithm.hmacSha256(timestamp, derivedKey);
        derivedKey = dsmx.algorithm.hmacSha256(dsmx.algorithm.currentUtcDateStamp(), derivedKey);
        derivedKey = dsmx.algorithm.hmacSha256(requestMethod.toLowerCase(), derivedKey);
        derivedKey = dsmx.algorithm.hmacSha256(targetApi.toLowerCase(), derivedKey);

        if (dsmx.config.sourcePublicKey) {
            derivedKey = dsmx.algorithm.hmacSha256(dsmx.config.sourcePublicKey.toLowerCase(), derivedKey);
        }

        return derivedKey;
    };

    dsmx.signing.getDesignerSign = function (privateKey, targetSystem, timestamp, requestMethod) {
        var lowerTargetSystem = targetSystem.toLocaleLowerCase();
        var derivedKey = dsmx.algorithm.hmacSha256(lowerTargetSystem, privateKey);

        derivedKey = dsmx.algorithm.hmacSha256(timestamp, derivedKey);
        derivedKey = dsmx.algorithm.hmacSha256(dsmx.algorithm.currentUtcDateStamp(), derivedKey);
        derivedKey = dsmx.algorithm.hmacSha256(requestMethod.toLowerCase(), derivedKey);

        if (dsmx.config.customerId) {
            derivedKey = dsmx.algorithm.hmacSha256(dsmx.config.customerId, derivedKey);
        }

        if (dsmx.config.campaignName) {
            derivedKey = dsmx.algorithm.hmacSha256(dsmx.config.campaignName.toLowerCase(), derivedKey);
        }

        return derivedKey;
    };

    dsmx.signing.signRequestWithoutData = function (publicKey, privateKey, request, requestMethod, targetApi) {
        var currentUtcDateTimeStamp = dsmx.signing.addHmacSha256HeaderGetDateTimeStamp(publicKey, request);
        var preDerivedKey = dsmx.signing.getPreDerivedKey(privateKey, dsmx.config.targetSystem, currentUtcDateTimeStamp, requestMethod, targetApi);
        var sign = dsmx.signing.signWithoutData(preDerivedKey);

        if (dsmx.config.addDesignerHeader) {
            request.setRequestHeader("X-DSM-DesignerSignature", dsmx.signing.getDesignerSign(privateKey, dsmx.config.targetSystem, currentUtcDateTimeStamp, requestMethod));
        }

        request.setRequestHeader("X-DSM-Signature", sign);
    };

    dsmx.signing.signRequestJson = function (publicKey, privateKey, request, requestMethod, targetApi, json) {
        var currentUtcDateTimeStamp = dsmx.signing.addHmacSha256HeaderGetDateTimeStamp(publicKey, request);
        var preDerivedKey = dsmx.signing.getPreDerivedKey(privateKey, dsmx.config.targetSystem, currentUtcDateTimeStamp, requestMethod, targetApi);
        var sign = dsmx.signing.signJson(preDerivedKey, json);

        if (dsmx.config.addDesignerHeader) {
            request.setRequestHeader("X-DSM-DesignerSignature", dsmx.signing.getDesignerSign(privateKey, dsmx.config.targetSystem, currentUtcDateTimeStamp, requestMethod));
        }

        request.setRequestHeader("X-DSM-Signature", sign);
    };

    dsmx.signing.signWithoutData = function (preDerivedKey) {
        return dsmx.algorithm.hmacSha256("", preDerivedKey); //no value so add this
    };

    dsmx.signing.signJson = function (preDerivedKey, json) {
        var derivedKey;

        if (json) {
            derivedKey = dsmx.algorithm.hmacSha256(json, preDerivedKey);
        } else {
            derivedKey = dsmx.algorithm.hmacSha256("", preDerivedKey); //no value so add this
        }

        return derivedKey;
    };

    dsmx.signing.signParams = function (preDerivedKey, params) {
        var derivedKey;
        var i;

        if (params) {
            var urlJoined = "";
            var sortedKeys = dsmx.algorithm.getSortedKeys(params);
            var param;

            for (i = 0; i < sortedKeys.length; i += 1) {
                param = params[sortedKeys[i]];

                if (i > 0) {
                    urlJoined += "&";
                }

                urlJoined += param.name + "=" + param.value;
            }

            derivedKey = dsmx.algorithm.hmacSha256(urlJoined, preDerivedKey);
        } else {
            derivedKey = dsmx.algorithm.hmacSha256("", preDerivedKey); //no value so add this
        }

        return derivedKey;
    };

    /* signing end */

    /* api start */

    dsmx.api.core.postJsonNoSigning = function (targetApi, json, doneCallback, failCallback) {
        dsmx.config.assert();
        $.ajax({
            url: dsmx.config.getFinalTargetUrl() + targetApi,
            beforeSend: function (request) {
                request.withCredentials = true;
            },
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: json,
            dataType: "json",
            success: doneCallback,
            error: failCallback,
            crossDomain: true,
            cache: true
        });
    };

    dsmx.api.core.postJson = function (targetApi, json, doneCallback, failCallback) {
        if (dsmx.config.useSigned()) {
            dsmx.config.assert();

            $.ajax({
                url: dsmx.config.getFinalTargetUrl() + targetApi,
                beforeSend: function (request) {
                    request.withCredentials = true;
                    dsmx.signing.signRequestJson(dsmx.config.publicKey, dsmx.config.privateKey, request, "POST", dsmx.config.adjustApiPath(targetApi), json);
                },
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: json,
                dataType: "json",
                success: doneCallback,
                error: failCallback,
                crossDomain: true,
                cache: true
            });
        } else {
            dsmx.api.core.postJsonNoSigning(targetApi, json, doneCallback, failCallback);
        }
    };

    dsmx.api.core.postJsonAdmin = function (targetApi, json, doneCallback, failCallback) {
        if (dsmx.config.useSigned()) {
            dsmx.config.assert();

            $.ajax({
                url: dsmx.config.getFinalTargetUrl() + targetApi,
                beforeSend: function (request) {
                    request.withCredentials = true;
                    dsmx.signing.signRequestJson(dsmx.config.adminPublicKey, dsmx.config.adminPrivateKey, request, "POST", dsmx.config.adjustApiPath(targetApi), json);
                },
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: json,
                dataType: "json",
                success: doneCallback,
                error: failCallback,
                crossDomain: true,
                cache: true
            });
        } else {
            dsmx.api.core.postJsonNoSigning(targetApi, json, doneCallback, failCallback);
        }
    };

    dsmx.api.core.getNoSigning = function (targetApi, doneCallback, failCallback) {
        dsmx.config.assert();
        $.ajax({
            url: dsmx.config.getFinalTargetUrl() + targetApi,
            beforeSend: function (request) {
                request.withCredentials = true;
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: doneCallback,
            error: failCallback,
            crossDomain: true,
            cache: true
        });
    };

    dsmx.api.core.get = function (targetApi, doneCallback, failCallback) {
        if (dsmx.config.useSigned()) {
            dsmx.config.assert();

            $.ajax({
                url: dsmx.config.getFinalTargetUrl() + targetApi,
                beforeSend: function (request) {
                    request.withCredentials = true;
                    dsmx.signing.signRequestWithoutData(dsmx.config.publicKey, dsmx.config.privateKey, request, "GET", dsmx.config.adjustApiPath(targetApi));
                },
                xhrFields: {
                    withCredentials: true
                },
                type: "GET",
                contentType: "application/json; charset=utf-8",
                success: doneCallback,
                error: failCallback,
                crossDomain: true,
                cache: true
            });
        } else {
            dsmx.api.core.getNoSigning(targetApi, doneCallback, failCallback);
        }
    };

    dsmx.api.core.getAdmin = function (targetApi, doneCallback, failCallback) {
        if (dsmx.config.useSigned()) {
            dsmx.config.assert();

            $.ajax({
                url: dsmx.config.getFinalTargetUrl() + targetApi,
                beforeSend: function (request) {
                    request.withCredentials = true;
                    dsmx.signing.signRequestWithoutData(dsmx.config.adminPublicKey, dsmx.config.adminPrivateKey, request, "GET", dsmx.config.adjustApiPath(targetApi));
                },
                xhrFields: {
                    withCredentials: true
                },
                type: "GET",
                contentType: "application/json; charset=utf-8",
                success: doneCallback,
                error: failCallback,
                crossDomain: true,
                cache: true
            });
        } else {
            dsmx.api.core.getNoSigning(targetApi, doneCallback, failCallback);
        }
    };

    dsmx.api.core.buildEasyDoneCallback = function (doneCallback, failCallback) {
        var dc = doneCallback;
        var fc = failCallback;

        var r = function (response) {
            if (response.state == 0) {
                if (dc) {
                    dc(response.responseObject);
                }
            } else if (fc) {
                fc({
                    "message": response.failureMessage,
                    "originalResponse": response
                });
            }
        };

        return r;
    };

    dsmx.api.core.buildEasyFailCallback = function (failCallback) {
        var fc = failCallback;

        var r = function (e) {
            if (fc) {
                if (e.responseJSON && e.responseJSON.state == 1) {
                    fc({
                        "message": e.responseJSON.failureMessage,
                        "originalResponse": e
                    });
                } else {
                    fc({
                        "message": e.statusText,
                        "originalResponse": e
                    });
                }
            }
        };

        return r;
    };

    dsmx.api.core.createEasyWrapperMethod = function (namespace, currentMethodName) {
        var methodName = currentMethodName;
        var ns = namespace;

        return function (params, doneCallback, failCallback) { //this method body is the same for all methods with parameter, a bit more complex, but not repetition
            ns[methodName](
                params,
                dsmx.api.core.buildEasyDoneCallback(doneCallback, failCallback),
                dsmx.api.core.buildEasyFailCallback(failCallback)
            );
        };
    };

    dsmx.api.core.createEasyWrapperMethodNoParams = function (namespace, currentMethodName) {
        var methodName = currentMethodName;
        var ns = namespace;

        return function (doneCallback, failCallback) { //this method body is the same for all methods without parameter, a bit more complex, but not repetition
            ns[methodName](
                dsmx.api.core.buildEasyDoneCallback(doneCallback, failCallback),
                dsmx.api.core.buildEasyFailCallback(failCallback)
            );
        };
    };

    dsmx.api.core.createEasyWrappers = function (namespace, methodNames) {
        var currentMethodName;
        var i;

        for (i = 0; i < methodNames.length; i += 1) {
            currentMethodName = methodNames[i];
            namespace.e[currentMethodName] = dsmx.api.core.createEasyWrapperMethod(namespace, currentMethodName);
        }
    };

    dsmx.api.core.createEasyWrappersNoParams = function (namespace, methodNames) {
        var currentMethodName;
        var i;

        for (i = 0; i < methodNames.length; i += 1) {
            currentMethodName = methodNames[i];
            namespace.e[currentMethodName] = dsmx.api.core.createEasyWrapperMethodNoParams(namespace, currentMethodName);
        }
    };



    //auto generated methods

    dsmx.api.core.selectPostMethod = function (params) {
        if (typeof params != "undefined" && params !== null && params.sendWithAdminKeys === true) {
            if (!dsmx.config.adminPublicKey) {
                throw "No admin public key provided";
            }

            if (!dsmx.config.adminPrivateKey) {
                throw "No admin private key provided";
            }

            return dsmx.api.core.postJsonAdmin;
        }

        return dsmx.api.core.postJson;
    };

    dsmx.api.core.throwErrorIfUndefinedOrNull = function (parameter, throwMessage) {
        if (typeof parameter == "undefined" || parameter === null) {
            throw throwMessage;
        }
    };

    dsmx.api.core.generatePostMethods = function (namespace, apiNamespace, postMethods) {
        postMethods.forEach(function (methodName) {
            namespace[methodName] = function (params, doneCallback, failCallback) {
                var json;
                var postMethod;

                dsmx.api.core.throwErrorIfUndefinedOrNull(params, "You must provide a model.");
                json = JSON.stringify(params);
                postMethod = dsmx.api.core.selectPostMethod(params);
                postMethod(apiNamespace + methodName, json, doneCallback, failCallback);
            };
        });

        namespace.e = namespace.e || {};
        dsmx.api.core.createEasyWrappers(namespace, postMethods);
    };

    // LOGIN
    dsmx.api.login.login = function (doneCallback, failCallback) {
        var json = JSON.stringify({ something: "toset" });

        dsmx.api.core.postJson("/api/login", json, doneCallback, failCallback);
    };

    dsmx.api.login.getOneTimeToken = function (doneCallback, failCallback) {
        var json = JSON.stringify({ something: "toset" });

        dsmx.api.core.postJson("/api/login/getonetimetoken", json, doneCallback, failCallback);
    };

    dsmx.api.login.get = function (requestModel, doneCallback, failCallback) {
        //var requestModel = {
        //    filter: ""
        //};

        dsmx.api.core.postJson("/api/login/get", JSON.stringify(requestModel), doneCallback, failCallback);
    };

    dsmx.api.login.create = function (createModel, doneCallback, failCallback) {
        //var createModel = {
        //loginType: 1,//1 = Dashboard
        //login: "",
        //password: "",
        //environmentIds: [],
        //campaignIDs: [],
        //};

        dsmx.api.core.postJson("/api/login/create", JSON.stringify(createModel), doneCallback, failCallback);
    };

    dsmx.api.login.delete = function (deleteModel, doneCallback, failCallback) {
        //var deleteModel = {
        //ids: []
        //};

        dsmx.api.core.postJson("/api/login/delete", JSON.stringify(deleteModel), doneCallback, failCallback);
    };

    dsmx.api.login.assign = function (assignModel, doneCallback, failCallback) {
        //var assignModel = {
        //id: 19,
        //campaignIDs: [],
        //environmentIDs: []
        //};

        dsmx.api.core.postJson("/api/login/assign", JSON.stringify(assignModel), doneCallback, failCallback);
    };

    dsmx.api.login.unassign = function (unassignModel, doneCallback, failCallback) {
        //var unassignModel = {
        //id: 19,
        //campaignIDs: [],
        //environmentIDs: []
        //};

        dsmx.api.core.postJson("/api/login/unassign", JSON.stringify(unassignModel), doneCallback, failCallback);
    };

    dsmx.api.login.resetPassword = function (resetModel, doneCallback, failCallback) {
        //var resetModel = {
        //loginId: 0,//LoginId or login
        //login: "",//LoginId or login
        //password: ""
        //};

        dsmx.api.core.postJson("/api/login/resetpassword", JSON.stringify(resetModel), doneCallback, failCallback);
    };

    dsmx.api.login.getEnvironmentsAndCampaigns = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/login/getenvironmentsandcampaigns", doneCallback, failCallback);
    }


    // CAMPAIGN TEMPLATE

    dsmx.api.internal = {};

    dsmx.api.campaignTemplates.getImportStatus = function (importId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaigntemplates/getimportstatus/" + importId, doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.getMetaData = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.campaignTemplateId) {
            dsmx.api.handleError(params, "No 'campaignTemplateId' parameter provided.");
            return;
        }

        if (!dsmx.api.isInteger(params.campaignTemplateId)) {
            dsmx.api.handleError(params, "Parameter 'campaignTemplateId' is not an integer.");
            return;
        }

        dsmx.api.core.get("/api/campaignTemplates/" + params.campaignTemplateId + "/metadata", doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.getMetaDataByName = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.campaignTemplateName) {
            dsmx.api.handleError(params, "No 'campaignTemplateName' parameter provided.");
            return;
        }

        dsmx.api.core.get("/api/campaignTemplates/" + params.campaignTemplateName + "/metadata", doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.getMetaDataByNameAndRandomKey = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.campaignTemplateName) {
            dsmx.api.handleError(params, "No 'campaignTemplateName' parameter provided.");
            return;
        }

        dsmx.api.core.get("/api/campaignTemplates/" + params.campaignTemplateName + "/" + params.randomKey + "/metadata", doneCallback, failCallback);
    };



    //internal usage only
    dsmx.api.campaignTemplates.getImportStatusUntilFinalStateInternal = function () {
        var c = dsmx.api.internal.current;
        var s = dsmx.model.api.campaignTemplates.importStatus;

        dsmx.api.campaignTemplates.getImportStatus(c.importId, function (response) {
            if (response.state === 0) {
                var ro = response.responseObject;

                if (ro.state === s.stateE.queued) {
                    if (c.progressCallback) {
                        c.progressCallback(s.toMessage(ro), 0);
                    }
                } else if (ro.state === s.stateE.running) {
                    if (c.progressCallback) {
                        c.progressCallback(s.toMessage(ro), ro.progressDetail);
                    }
                } else if (ro.state === s.stateE.completed) {
                    if (ro.errorCode == s.errorE.none) {
                        if (c.completeCallback) {
                            c.completeCallback(ro.campaignTemplateId);
                        }
                    } else if (ro.errorCode === s.errorE.needUserInputOverwriteOrCreateNew) {
                        if (c.decisionCallback) {
                            c.decisionCallback(c.importId);
                        }
                    } else {
                        if (c.failCallback) {
                            c.failCallback(s.toMessage(ro), ro.errorCode);
                        }
                    }
                }

                if (ro.state !== s.stateE.completed) {
                    setTimeout(dsmx.api.campaignTemplates.getImportStatusUntilFinalStateInternal, 750);
                }
            } else {
                if (c.failCallback) {
                    c.failCallback(response.failureMessage, response.failureDetail);
                }
            }
        }, function (response) {
            if (response.responseJSON && response.responseJSON.state === 1) {
                if (c.failCallback) {
                    c.failCallback(response.responseJSON.failureMessage, response.responseJSON.failureDetail);
                }
            } else {
                if (c.failCallback) {
                    c.failCallback(response.statusText, -1);
                }
            }
        });
    };

    //query the campaign template import status until there is a final state
    dsmx.api.campaignTemplates.getImportStatusUntilFinalState = function (importId, completeCallback, failCallback, progressCallback, decisionCallback) {
        dsmx.api.internal.current = {
            importId: importId,
            completeCallback: completeCallback,
            failCallback: failCallback,
            progressCallback: progressCallback,
            decisionCallback: decisionCallback
        };

        dsmx.api.campaignTemplates.getImportStatusUntilFinalStateInternal();
    };

    dsmx.api.campaignTemplates.continueImport = function (model, doneCallback, failCallback) {
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/campaigntemplates/continueimport", json, doneCallback, failCallback);
    };
    dsmx.api.campaignTemplates.continueImportSync = function (model, doneCallback, failCallback) {
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/campaigntemplates/continueimportsync", json, doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.update = function (model, doneCallback, failCallback) {
        if (model === null) {
            dsmx.api.handleError({ failCallback: failCallback }, "No model provided.");
            return;
        }

        if (!model.id) {
            dsmx.api.handleError({ failCallback: failCallback }, "No 'id' parameter provided.");
            return;
        }

        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/campaigntemplates/update", json, doneCallback, failCallback);
    };

    //gets the overall count of campaign templates
    dsmx.api.campaignTemplates.count = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/count", doneCallback, failCallback);
    };

    //gets the overall count of campaign templates with the specified query
    dsmx.api.campaignTemplates.countWithQuery = function (query, doneCallback, failCallback) {
        var json = JSON.stringify(query);

        dsmx.api.core.postJson("/api/campaignTemplates/count", json, doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.countByRole = function (query, roleName, doneCallback, failCallback) {
        var json = JSON.stringify(query);

        dsmx.api.core.postJson("/api/campaignTemplates/countbyrole/" + encodeURIComponent(roleName), json, doneCallback, failCallback);
    };

    //get the first 50 campaign templates
    dsmx.api.campaignTemplates.get = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates", doneCallback, failCallback);
    };

    //get the first 50 campaign templates beginning after 'start'
    dsmx.api.campaignTemplates.getWithStart = function (start, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/" + start, doneCallback, failCallback);
    };

    //the the first 'size' campaign templates beginning after 'start'
    dsmx.api.campaignTemplates.getWithStartAndSize = function (start, size, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/" + start + "/" + size, doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.getWithQuery = function (query, doneCallback, failCallback) {
        var json = JSON.stringify(query);

        dsmx.api.core.postJson("/api/campaignTemplates/get", json, doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.getByRole = function (query, roleName, doneCallback, failCallback) {
        var json = JSON.stringify(query);

        if (typeof roleName == "undefined" || roleName == null) {
            roleName = "";
        }

        dsmx.api.core.postJson("/api/campaignTemplates/getbyrole/" + encodeURIComponent(roleName), json, doneCallback, failCallback);
    };

    //get a single campaign template
    dsmx.api.campaignTemplates.getByName = function (name, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/byname/" + name, doneCallback, failCallback);
    };

    //get a single campaign template
    dsmx.api.campaignTemplates.getById = function (id, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/byid/" + id, doneCallback, failCallback);
    };

    //checks whether this campaign template name already exists
    dsmx.api.campaignTemplates.exists = function (name, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/exists/" + name, doneCallback, failCallback);
    };

    //marks this campaign tempalte as approved
    dsmx.api.campaignTemplates.approve = function (campaignTemplateId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/approve/" + campaignTemplateId, doneCallback, failCallback);
    };

    //marks this campaign template as disapproved
    dsmx.api.campaignTemplates.disapprove = function (campaignTemplateId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/disapprove/" + campaignTemplateId, doneCallback, failCallback);
    };

    //deletes a campaign template
    dsmx.api.campaignTemplates.delete = function (campaignTemplateId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/delete/" + campaignTemplateId, doneCallback, failCallback);
    };


    //get all existing categories
    //returns an array of category models
    dsmx.api.campaignTemplates.getCategories = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/categories", doneCallback, failCallback);
    };

    //adds a new category
    dsmx.api.campaignTemplates.addCategory = function (categoryModel, doneCallback, failCallback) {
        var json = JSON.stringify(categoryModel);

        dsmx.api.core.postJson("/api/campaignTemplates/category/add", json, doneCallback, failCallback);
    };

    //adds a new category
    dsmx.api.campaignTemplates.addCategoryWithName = function (categoryName, doneCallback, failCallback) {
        var model = dsmx.model.api.campaignTemplates.category.create();

        model.name = categoryName;

        dsmx.api.campaignTemplates.addCategory(model, doneCallback, failCallback);
    };

    //connects a campaign template to a category
    //expects a dsmx.model.api.campaignTemplates.connectTemplateToCategory model
    dsmx.api.campaignTemplates.connectCategory = function (connectModel, doneCallback, failCallback) {
        var json = JSON.stringify(connectModel);

        dsmx.api.core.postJson("/api/campaignTemplates/category/connect", json, doneCallback, failCallback);
    };

    //disconnects a campaign template from a category
    //expects a dsmx.model.api.campaignTemplates.connectTemplateToCategory model
    dsmx.api.campaignTemplates.disconnectCategory = function (connectModel, doneCallback, failCallback) {
        var json = JSON.stringify(connectModel);

        dsmx.api.core.postJson("/api/campaignTemplates/category/disconnect", json, doneCallback, failCallback);
    };

    //deletes a category
    dsmx.api.campaignTemplates.deleteCategory = function (categoryModel, doneCallback, failCallback) {
        var json = JSON.stringify(categoryModel);

        dsmx.api.core.postJson("/api/campaignTemplates/category/delete", json, doneCallback, failCallback);
    };
















    //get all existing target audiences
    //returns an array of target audience models
    dsmx.api.campaignTemplates.getTargetAudiences = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/targetaudiences", doneCallback, failCallback);
    };

    //adds a new target audience
    dsmx.api.campaignTemplates.addTargetAudience = function (targetAudienceModel, doneCallback, failCallback) {
        var json = JSON.stringify(targetAudienceModel);

        dsmx.api.core.postJson("/api/campaignTemplates/targetaudience/add", json, doneCallback, failCallback);
    };

    //adds a new target audience
    dsmx.api.campaignTemplates.addTargetAudienceWithName = function (targetAudienceName, doneCallback, failCallback) {
        var model = dsmx.model.api.campaignTemplates.targetAudience.create();

        model.name = targetAudienceName;

        dsmx.api.campaignTemplates.addTargetAudience(model, doneCallback, failCallback);
    };

    //connects a campaign template to a target audience
    //expects a dsmx.model.api.campaignTemplates.connectTemplateToTargetAudience model
    dsmx.api.campaignTemplates.connectTargetAudience = function (connectModel, doneCallback, failCallback) {
        var json = JSON.stringify(connectModel);

        dsmx.api.core.postJson("/api/campaignTemplates/targetaudience/connect", json, doneCallback, failCallback);
    };

    //disconnects a campaign template from a target audience
    //expects a dsmx.model.api.campaignTemplates.connectTemplateToTargetAudience model
    dsmx.api.campaignTemplates.disconnectTargetAudience = function (connectModel, doneCallback, failCallback) {
        var json = JSON.stringify(connectModel);

        dsmx.api.core.postJson("/api/campaignTemplates/targetaudience/disconnect", json, doneCallback, failCallback);
    };

    //deletes a target audience
    dsmx.api.campaignTemplates.deleteTargetAudience = function (targetAudienceModel, doneCallback, failCallback) {
        var json = JSON.stringify(targetAudienceModel);

        dsmx.api.core.postJson("/api/campaignTemplates/targetaudience/delete", json, doneCallback, failCallback);
    };
















    //get all existing outbound channels
    //returns an array of outbound channel models
    dsmx.api.campaignTemplates.getOutboundChannels = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/outboundchannels", doneCallback, failCallback);
    };

    //adds a new outbound channel
    dsmx.api.campaignTemplates.addOutboundChannel = function (outboundChannelModel, doneCallback, failCallback) {
        var json = JSON.stringify(outboundChannelModel);

        dsmx.api.core.postJson("/api/campaignTemplates/outboundchannel/add", json, doneCallback, failCallback);
    };

    //adds a new outbound channel
    dsmx.api.campaignTemplates.addOutboundChannelWithName = function (outboundChannelName, doneCallback, failCallback) {
        var model = dsmx.model.api.campaignTemplates.outboundChannel.create();

        model.name = outboundChannelName;

        dsmx.api.campaignTemplates.addOutboundChannel(model, doneCallback, failCallback);
    };

    //connects a campaign template to a outbound channel
    //expects a dsmx.model.api.campaignTemplates.connectTemplateToOutboundChannel model
    dsmx.api.campaignTemplates.connectOutboundChannel = function (connectModel, doneCallback, failCallback) {
        var json = JSON.stringify(connectModel);

        dsmx.api.core.postJson("/api/campaignTemplates/outboundchannel/connect", json, doneCallback, failCallback);
    };

    //disconnects a campaign template from a outbound channel
    //expects a dsmx.model.api.campaignTemplates.connectTemplateToOutboundChannel model
    dsmx.api.campaignTemplates.disconnectOutboundChannel = function (connectModel, doneCallback, failCallback) {
        var json = JSON.stringify(connectModel);

        dsmx.api.core.postJson("/api/campaignTemplates/outboundchannel/disconnect", json, doneCallback, failCallback);
    };

    //deletes a outbound channel
    dsmx.api.campaignTemplates.deleteOutboundChannel = function (outboundChannelModel, doneCallback, failCallback) {
        var json = JSON.stringify(outboundChannelModel);

        dsmx.api.core.postJson("/api/campaignTemplates/outboundchannel/delete", json, doneCallback, failCallback);
    };







    //get the first 50 campaign templates which are marked as approved
    dsmx.api.campaignTemplates.getApproved = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/approved", doneCallback, failCallback);
    };

    //get the first 50 campaign templates after 'start' which are marked as approved
    dsmx.api.campaignTemplates.getApprovedWithStart = function (start, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/approved/" + start, doneCallback, failCallback);
    };

    //get the first 'size' campaign templates after 'start' which are marked as approved
    dsmx.api.campaignTemplates.getApprovedWithStartAndSize = function (start, size, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/approved/" + start + "/" + size, doneCallback, failCallback);
    };


    //get the first 50 campaign templates which are marked as disapproved
    dsmx.api.campaignTemplates.getDisapproved = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/disapproved", doneCallback, failCallback);
    };

    //get the first 50 campaign templates after 'start' which are marked as disapproved
    dsmx.api.campaignTemplates.getDisapprovedWithStart = function (start, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/disapproved/" + start, doneCallback, failCallback);
    };

    //get the first 'size' campaign templates after 'start' which are marked as disapproved
    dsmx.api.campaignTemplates.getDisapprovedWithStartAndSize = function (start, size, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/disapproved/" + start + "/" + size, doneCallback, failCallback);
    };

    //retrieves all campaign templates by a given category id, support for queries
    dsmx.api.campaignTemplates.getWithQueryByCategory = function (query, categoryId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaignTemplates/getwithquerybycategory/" + encodeURIComponent(categoryId), JSON.stringify(query), doneCallback, failCallback);
    };

    //retrieves campaign template count by a given category id, support for queries
    dsmx.api.campaignTemplates.countWithQueryByCategory = function (query, categoryId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaignTemplates/countwithquerybycategory/" + encodeURIComponent(categoryId), JSON.stringify(query), doneCallback, failCallback);
    };

    //get the first 50 campaign templates which belong to the specfied 'category'
    dsmx.api.campaignTemplates.getByCategory = function (categoryName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/bycategory/" + categoryName, doneCallback, failCallback);
    };

    //get the first 50 campaign templates after 'start' which belong to the specfied 'category'
    dsmx.api.campaignTemplates.getByCategoryWithStart = function (categoryName, start, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/bycategory/" + categoryName + "/" + start, doneCallback, failCallback);
    };

    //get the first 'size' campaign templates after 'start' which belong to the specfied 'category'
    dsmx.api.campaignTemplates.getByCategoryWithStartAndSize = function (categoryName, start, size, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/bycategory/" + categoryName + "/" + start + "/" + size, doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.getAssignedRoles = function (campaignTemplateID, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/getroles/" + parseInt(campaignTemplateID), doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.assignRole = function (campaignTemplateID, role, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/assignrole/" + parseInt(campaignTemplateID) + "/" + encodeURIComponent(role), doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.removeRole = function (campaignTemplateID, role, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaignTemplates/removerole/" + parseInt(campaignTemplateID) + "/" + encodeURIComponent(role), doneCallback, failCallback);
    };

    dsmx.api.campaignTemplates.getByRoles = function (roles, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaignTemplates/campaignsbyroles/", JSON.stringify(roles), doneCallback, failCallback);
    };



    dsmx.api.campaignTemplates.portal = {
        e: {},
        getApprovedByPlaceholder: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.placeholder) {
                dsmx.api.handleError(params, "No 'placeholder' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaigntemplates/portal/byplaceholder/" + encodeURIComponent(params.placeholder) + "/approved", doneCallback, failCallback);
        },
        getNotApprovedByPlaceholder: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.placeholder) {
                dsmx.api.handleError(params, "No 'placeholder' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaigntemplates/portal/byplaceholder/" + encodeURIComponent(params.placeholder) + "/notapproved", doneCallback, failCallback);
        },
        getAllByPlaceholder: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.placeholder) {
                dsmx.api.handleError(params, "No 'placeholder' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaigntemplates/portal/byplaceholder/" + encodeURIComponent(params.placeholder) + "/all", doneCallback, failCallback);
        },
        getByPlaceholder: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.placeholder) {
                dsmx.api.handleError(params, "No 'placeholder' parameter provided.");
                return;
            }

            if (dsmx.api.isDefined(params.isApproved) && params.isApproved != null) {
                if (params.isApproved) {
                    dsmx.api.campaignTemplates.portal.getApprovedByPlaceholder(params, doneCallback, failCallback);

                } else {
                    dsmx.api.campaignTemplates.portal.getNotApprovedByPlaceholder(params, doneCallback, failCallback);
                }
            } else {
                dsmx.api.campaignTemplates.portal.getAllByPlaceholder(params, doneCallback, failCallback);
            }
        },
        getApprovedByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaigntemplates/portal/bycategory/" + encodeURIComponent(params.categoryName) + "/approved", doneCallback, failCallback);
        },
        getNotApprovedByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaigntemplates/portal/bycategory/" + encodeURIComponent(params.categoryName) + "/notapproved", doneCallback, failCallback);
        },
        getAllByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaigntemplates/portal/bycategory/" + encodeURIComponent(params.categoryName) + "/all", doneCallback, failCallback);
        },
        getByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            if (dsmx.api.isDefined(params.isApproved) && params.isApproved != null) {
                if (params.isApproved) {
                    dsmx.api.campaignTemplates.portal.getApprovedByCategory(params, doneCallback, failCallback);

                } else {
                    dsmx.api.campaignTemplates.portal.getNotApprovedByCategory(params, doneCallback, failCallback);
                }
            } else {
                dsmx.api.campaignTemplates.portal.getAllByCategory(params, doneCallback, failCallback);
            }
        }
    };


    // CAMPAIGN CATEGORIES
    dsmx.api.campaignCategories.e = {};

    dsmx.api.campaignCategories.getAll = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaigntemplatecategories/get", doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.getWithQuery = function (query, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaigntemplatecategories/getwithquery", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.getWithRole = function (query, roleName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaigntemplatecategories/getbyrole/" + encodeURIComponent(roleName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.countWithQuery = function (query, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaigntemplatecategories/countwithquery", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.countWithRole = function (query, roleName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaigntemplatecategories/countbyrole/" + encodeURIComponent(roleName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.getByRole = function (query, roleName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaigntemplatecategories/get", doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.insert = function (campaignCategoryName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaigntemplatecategories/insert/" + encodeURIComponent(campaignCategoryName), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.updateByID = function (campaignCategoryID, campaignCategoryName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaigntemplatecategories/update/" + parseInt(campaignCategoryID) + "/" + encodeURIComponent(campaignCategoryName), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.update = function (campaignCategoryModel, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaigntemplatecategories/update/", JSON.stringify(campaignCategoryModel), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.deleteByID = function (campaignCategoryID, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaigntemplatecategories/deletebyid/" + parseInt(campaignCategoryID), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.deleteByName = function (campaignCategoryName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaigntemplatecategories/deletebyname/" + encodeURIComponent(campaignCategoryName), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.getRoles = function (categoryName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaigntemplatecategories/getroles/" + encodeURIComponent(categoryName), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.assignRole = function (categoryName, roleName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaigntemplatecategories/assignrole/" + encodeURIComponent(categoryName) + "/" + encodeURIComponent(roleName), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.removeRole = function (categoryName, roleName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaigntemplatecategories/removerole/" + encodeURIComponent(categoryName) + "/" + encodeURIComponent(roleName), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.getByRoles = function (roles, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaigntemplatecategories/categoriesbyroles/", JSON.stringify(roles), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.getByDocumentTemplate = function (query, documentTemplateName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaigntemplatecategories/getbydocumenttemplate/" + encodeURIComponent(documentTemplateName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.countByDocumentTemplate = function (query, documentTemplateName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaigntemplatecategories/countbydocumenttemplate/" + encodeURIComponent(documentTemplateName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.getByCampaignTemplate = function (query, campaignTemplateId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaigntemplatecategories/getbycampaigntemplate/" + parseInt("" + campaignTemplateId), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.countByCampaignTemplate = function (query, campaignTemplateId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/campaigntemplatecategories/countbycampaigntemplate/" + parseInt("" + campaignTemplateId), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.getByImage = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params given!";
        }

        if (!params.query) {
            throw "No query given!";
        }

        if (!params.imageName) {
            throw "No image name given!";
        }

        dsmx.api.core.postJson("/api/campaigntemplatecategories/getbyimage/" + encodeURIComponent(params.imageName) + "/", JSON.stringify(params.query), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.countByImage = function (params, doneCallback, failCallback) {
        var query = null;
        var imageName = "";

        if (!params) {
            throw "No params given!";
        }

        if (!params.query) {
            throw "No query given!";
        }

        if (!params.imageName) {
            throw "No image name given!";
        }

        dsmx.api.core.postJson("/api/campaigntemplatecategories/countbyimage/" + encodeURIComponent(params.imageName) + "/", JSON.stringify(params.query), doneCallback, failCallback);
    };

    dsmx.api.campaignCategories.portal = {
        e: {},
        getContainingApprovedTemplates: function (doneCallback, failCallback) {
            dsmx.api.core.get("/api/campaigntemplatecategories/portal/containingtemplates/approved", doneCallback, failCallback);
        },
        getContainingNotApprovedTemplates: function (doneCallback, failCallback) {
            dsmx.api.core.get("/api/campaigntemplatecategories/portal/containingtemplates/notapproved", doneCallback, failCallback);
        },
        getContainingAllTemplates: function (doneCallback, failCallback) {
            dsmx.api.core.get("/api/campaigntemplatecategories/portal/containingtemplates", doneCallback, failCallback);
        },
        getContainingTemplates: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (dsmx.api.isDefined(params.isApproved) && params.isApproved != null) {
                if (params.isApproved) {
                    dsmx.api.campaignCategories.portal.getContainingApprovedTemplates(doneCallback, failCallback);
                } else {
                    dsmx.api.campaignCategories.portal.getContainingNotApprovedTemplates(doneCallback, failCallback);
                }
            } else {
                dsmx.api.campaignCategories.portal.getContainingAllTemplates(doneCallback, failCallback);
            }
        }
    };



    //  ADMIN

    dsmx.api.admin.logs = {};

    dsmx.api.admin.logs.codeE = {
        unknown: 0,
        couldNotSendSimpleMail: 1,
        couldNotSendMail: 2,
        mailSent: 3
    };

    dsmx.api.admin.logs.codeMessageE = {
        unknown: "Unknown error: {0}",
        couldNotSendSimpleMail: "Could not send e-mail from '{0}' to '{1}' with subject '{2}' using template '{3}': {4}",
        couldNotSendMail: "Could not send e-mail from '{0}' to '{1}' with subject '{2}' using mail '{3}': {4}",
        mailSent: "E-Mail from '{0}' to '{1}' with subject '{2}' using mail '{3}' has been sent."
    };


    dsmx.api.admin.logs.toHumanReadable = function (logEntry, prependDateTime, dateFormater) {
        var codes = dsmx.api.admin.logs.codeE;
        var messages = dsmx.api.admin.logs.codeMessageE;
        var json;
        var final;

        if (logEntry.code === codes.unknown) {
            final = dsmx.algorithm.arrayReplace(messages.unknown, [logEntry.errorMessage]);

        } else if (logEntry.code === codes.couldNotSendSimpleMail) {
            json = JSON.parse(logEntry.json);
            final = dsmx.algorithm.arrayReplace(messages.couldNotSendSimpleMail, [json.FromAddress, json.ToAddress, json.Subject, json.MailServerTemplate, logEntry.errorMessage]);

        } else if (logEntry.code === codes.couldNotSendMail) {
            json = JSON.parse(logEntry.json);
            final = dsmx.algorithm.arrayReplace(messages.couldNotSendMail, [json.FromAddress, json.ToAddress, json.Subject, json.MailServerTemplate, logEntry.errorMessage]);

        } else if (logEntry.code === codes.mailSent) {
            json = JSON.parse(logEntry.json);
            final = dsmx.algorithm.arrayReplace(messages.mailSent, [json.FromAddress, json.ToAddress, json.Subject, json.MailServerTemplate]);
        }

        if (prependDateTime === true) {
            if (dateFormater) {
                final = dateFormater(logEntry.lastUpdate) + " : " + final;
            } else {
                final = logEntry.lastUpdate + " : " + final;
            }
        }

        return final;
    };


    dsmx.api.admin.getAllAdminTokens = function (doneCallback, failCallback) {
        dsmx.api.core.getNoSigning("/api/admin/getalladmintokens", doneCallback, failCallback);
    };

    dsmx.api.admin.deleteAdminToken = function (deleteModel, doneCallback, failCallback) {
        //DeleteModel: {publicKey: "", privateKey: ""}
        dsmx.api.core.postJsonNoSigning("/api/admin/deleteadmintoken", JSON.stringify(deleteModel), doneCallback, failCallback);
    };

    dsmx.api.createAdminToken = function (name, doneCallback, failCallback) {
        dsmx.api.core.getNoSigning("/api/admin/createserveradminaccount/" + encodeURIComponent(name), doneCallback, failCallback);
    };

    dsmx.api.admin.getAllAccountIds = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/admin/getallaccountids", doneCallback, failCallback);
    };

    dsmx.api.admin.getAllTokens = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/admin/getalltokens", doneCallback, failCallback);
    };

    dsmx.api.admin.getAllTokensByAccountId = function (accountId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/admin/getalltokens/" + accountId, doneCallback, failCallback);
    };

    dsmx.api.admin.getLogSources = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/admin/logging/sources", doneCallback, failCallback);
    };

    dsmx.api.admin.getLogEntriesBySource = function (model, doneCallback, failCallback) {
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/admin/logging/getall", json, doneCallback, failCallback);
    };

    dsmx.api.admin.createStatistics = function (model, doneCallback, failCallback) {
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/admin/createstatistics", json, doneCallback, failCallback);
    };

    dsmx.api.admin.getStatisticsStatus = function (params, doneCallback, failCallback) {
        dsmx.api.core.get("/api/admin/getstatisticsstatus/" + params.statusId, doneCallback, failCallback);
    };

    dsmx.api.admin.recycle = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/admin/recycle", doneCallback, failCallback);
    };

    dsmx.api.admin.gcCollect = function (doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/admin/gccollect", "", doneCallback, failCallback);
    };

    dsmx.api.admin.gcCompactCollect = function (doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/admin/gccompactcollect", "", doneCallback, failCallback);
    };

    dsmx.api.admin.serverSettings = function (doneCallback, failCallback) {
        dsmx.api.core.getNoSigning("/api/admin/serverSettings", doneCallback, failCallback);
    };


    dsmx.api.admin.get50LogEntries = function (params, doneCallback, failCallback) {
        var model;
        var json;
        var apiPath;

        if (dsmx.api.isNotSet(params, "You need to provide a parameters.", failCallback)) {
            return;
        }

        if (!(params.campaignId || params.byAccount === true)) {
            dsmx.api.failOrThrow(failCallback, "You need to provide a 'campaignId' or 'byAccount' parameter.");
            return;
        }

        if (params.campaignId) {
            apiPath = "/api/admin/get50logentries/bycampaign/" + params.campaignId;

            if (dsmx.api.isNotInteger(params.campaignId, "You need to provide a valid 'campaignId' integer parameter.", failCallback)) {
                return;
            }
        }

        if (params.byAccount === true) {
            apiPath = "/api/admin/get50logentries/byaccount";
        }

        dsmx.api.core.get(apiPath, doneCallback, failCallback);
    };

    dsmx.api.admin.singleSignOn = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.ssoToken) {
            dsmx.api.handleError(params, "No 'ssoToken' parameter provided.");
            return;
        }

        var model = { value: params.ssoToken };
        var json = JSON.stringify(model);

        dsmx.api.core.postJsonNoSigning("/api/admin/sso", json, doneCallback, failCallback);
    };

    //  ACCOUNTS
    dsmx.api.accounts.create = function (model, doneCallback, failCallback) {
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/accounts/create", json, doneCallback, failCallback);
    };

    dsmx.api.accounts.getAbsoluteTaskStates = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/accounts/automatedtaskstates", doneCallback, failCallback);
    };

    dsmx.api.accounts.getAccountUsers = function (accountId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/accounts/accountusers/" + parseInt(accountId), doneCallback, failCallback);
    };

    dsmx.api.accounts.deleteAccountUser = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/accounts/deleteuser", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.accounts.deleteAccount = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/accounts/deleteaccount", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.accounts.getAccountDeletionStatus = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/accounts/accountdeletionstatus", JSON.stringify(settings), doneCallback, failCallback);
    };

    //  CONTACTS
    dsmx.api.contacts.count = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/count", doneCallback, failCallback);
    };

    dsmx.api.contacts.countWithQuery = function (query, doneCallback, failCallback) {
        var json = JSON.stringify(query);

        dsmx.api.core.postJson("/api/contacts/count", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.insert = function (model, doneCallback, failCallback) {
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/contacts/insert", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.get = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts", doneCallback, failCallback);
    };

    dsmx.api.contacts.getWithStart = function (start, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/" + start, doneCallback, failCallback);
    };

    dsmx.api.contacts.getWithStartAndSize = function (start, size, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/" + start + "/" + size, doneCallback, failCallback);
    };

    dsmx.api.contacts.getWithQuery = function (query, doneCallback, failCallback) {
        var json = JSON.stringify(query);

        dsmx.api.core.postJson("/api/contacts/get", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.update = function (model, doneCallback, failCallback) {
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/contacts/update", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.updateField = function (model, doneCallback, failCallback) {
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/contacts/updatefield", json, doneCallback, failCallback);
    };

    //deletes one ore more contacts by either one given id or a given array of ids
    dsmx.api.contacts.delete = function (id, doneCallback, failCallback) {
        if (Object.prototype.toString.call(id) === "[object Array]") {
            dsmx.api.core.postJson("/api/contacts/delete", JSON.stringify(id), doneCallback, failCallback);
        } else {
            dsmx.api.core.get("/api/contacts/delete/" + encodeURIComponent(id), doneCallback, failCallback);
        }
    };

    dsmx.api.contacts.getBatches = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/batches", doneCallback, failCallback);
    };

    dsmx.api.contacts.getBatchContexts = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/batchcontexts", doneCallback, failCallback);
    };

    dsmx.api.contacts.createBatch = function (name, doneCallback, failCallback) {
        var json = JSON.stringify({ name: name });

        dsmx.api.core.postJson("/api/contacts/createbatch", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.getAdditionalColumns = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/additionalcolumns", doneCallback, failCallback);
    };

    dsmx.api.contacts.getAdditionalColumnsForAccount = function (accountId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/additionalcolumnsforaccount/" + encodeURIComponent(parseInt(accountId)), doneCallback, failCallback);
    };

    dsmx.api.contacts.importFromUrl = function (model, doneCallback, failCallback) {
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/contacts/importfromurl", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.import = function (model, doneCallback, failCallback) {
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/contacts/import", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.getImportStatus = function (importId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/importstatus/" + importId, doneCallback, failCallback);
    };

    dsmx.api.contacts.fileupload = {};
    dsmx.api.contacts.fileupload.getStatus = function (importID, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/fileupload/status/" + encodeURIComponent(importID), doneCallback, failCallback);
    };

    dsmx.api.contacts.fileupload.getColumnMappings = function (importID, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/fileupload/mappings/" + encodeURIComponent(importID), doneCallback, failCallback);
    };

    dsmx.api.contacts.fileupload.startImport = function (importID, columnMappings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/contacts/fileupload/start/" + encodeURIComponent(importID), JSON.stringify(columnMappings), doneCallback, failCallback);
    };

    //methods in the e namespace are simpler to use. you will always get the responseObject in the done callback or the error message in the fail callback.

    dsmx.api.contacts.filter.save = function (model, doneCallback, failCallback) {
        var json = JSON.stringify({ name: model.name, json: model.json });

        dsmx.api.core.postJson("/api/contacts/filter/save", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.filter.delete = function (name, doneCallback, failCallback) {
        var json = JSON.stringify({ name: name });

        dsmx.api.core.postJson("/api/contacts/filter/delete", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.filter.exists = function (name, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/filter/exists/" + encodeURIComponent(name), doneCallback, failCallback);
    };

    dsmx.api.contacts.filter.get = function (name, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/filter/get/" + encodeURIComponent(name), doneCallback, failCallback);
    };

    dsmx.api.contacts.filter.getAll = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/filter/getall", doneCallback, failCallback);
    };

    dsmx.api.contacts.filter.e.getAll = function (doneCallback, failCallback) {
        dsmx.api.contacts.filter.getAll(
            dsmx.api.core.buildEasyDoneCallback(doneCallback, failCallback),
            dsmx.api.core.buildEasyFailCallback(failCallback)
        );
    };

    //  DUPLICATE CONTACTS
    dsmx.api.duplicateContacts.getFilter = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/contactduplicates/getfilter", doneCallback, failCallback);
    };

    dsmx.api.duplicateContacts.getFilterByAccount = function (accountId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contactduplicates/getfilterbyaccount/" + encodeURIComponent(accountId), doneCallback, failCallback);
    };

    dsmx.api.duplicateContacts.setFilter = function (filter, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/contactduplicates/setfilter", JSON.stringify(filter), doneCallback, failCallback);
    };

    dsmx.api.duplicateContacts.setFilterByAccount = function (filter, accountId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/contactduplicates/setfilterbyaccount/" + encodeURIComponent(accountId), JSON.stringify(filter), doneCallback, failCallback);
    };

    dsmx.api.duplicateContacts.setFilterOnAll = function (filter, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/contactduplicates/ensurefilter", JSON.stringify(filter), doneCallback, failCallback);
    };

    dsmx.api.duplicateContacts.getHashingStatus = function (processingID, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contactduplicates/status/" + encodeURIComponent(processingID), doneCallback, failCallback);
    };

    dsmx.api.duplicateContacts.rehashDatabase = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/contactduplicates/hash", doneCallback, failCallback);
    };

    dsmx.api.duplicateContacts.rehashDatabaseByAccount = function (accountId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/contactduplicates/hashbyaccount/" + encodeURIComponent(accountId), doneCallback, failCallback);
    };

    //Smart Campaign
    dsmx.api.smartCampaign.login = function (credentials, doneCallback, failCallback) {
        dsmx.api.core.postJsonNoSigning("/api/smartcampaign/login", JSON.stringify(credentials), doneCallback, failCallback);
    };

    dsmx.api.smartCampaign.getDashboardUserMetaData = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/smartcampaign/getdashboardusermetadata", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.smartCampaign.validateAdminKeys = function (keys, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/smartcampaign/validateadminkeys", JSON.stringify(keys), doneCallback, failCallback);
    };

    //Database
    dsmx.api.database.getCampaignDatabase = function (parameters, doneCallback, failCallback) {
        /*var parameters = {
        campaignId: 10, //or campaign name
        campaignName: "",//or campaign id
        }*/

        dsmx.api.core.postJson("/api/database/getcampaigndatabase", JSON.stringify(parameters), doneCallback, failCallback);
    };

    dsmx.api.database.getAllDatabases = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/database/getalldatabases", doneCallback, failCallback);
    };

    dsmx.api.database.changeCampaignDatabase = function (parameters, doneCallback, failCallback) {
        /*var parameters = {
        campaignId: 10, //or campaign name
        campaignName: "",//or campaign id
        newDatabaseId: 10, //or database name
        newDatabaseName: "", //or database id
        }*/

        dsmx.api.core.postJson("/api/database/changecampaigndatabase", JSON.stringify(parameters), doneCallback, failCallback);
    };

    dsmx.api.database.getDatabaseByName = function (databaseName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/database/getdatabase", JSON.stringify({ "databaseName": "" + databaseName }), doneCallback, failCallback);
    };

    dsmx.api.database.getDatabaseById = function (databaseId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/database/getdatabase", JSON.stringify({ "databaseId": parseInt("" + databaseId) }), doneCallback, failCallback);
    };

    dsmx.api.database.createDatabase = function (createSettings, doneCallback, failCallback) {
        //var createSettings = {
        //    "useDefaultColumns": true,
        //    "createDummyRecord": true,
        //    "columnsToCreate": [],
        //    "databaseName": "NameOfTheNewDatabase",
        //    "lpLoginMode": "Randomize",//Default,IncludePwd,Randomize,Hash,ColumnsPlusRandomNumber
        //    "loginFieldPart1": "",
        //    "loginFieldSeperator": "",
        //    "loginFieldPart2": "",
        //    "passwordDBFieldName": ""
        //};

        dsmx.api.core.postJson("/api/database/createdatabase", JSON.stringify(createSettings), doneCallback, failCallback);
    };

    dsmx.api.database.exportDatabase = function (exportSettings, doneCallback, failCallback) {
        //var exportSettings =
        //{
        //    databaseId: null,
        //    databaseName: "",
        //    campaignId: null,
        //    campaignName: "",
        //    eventGroup: "",
        //    lqfXml: null,
        //    showSubmitters: false,
        //    showVisitors: false,
        //    showEMailUnsubscribers: false,
        //    showLpLogin: false,
        //    exportEvents: false,
        //    csvSeparator: ";",
        //    exportFirstLogin: false,
        //    exportLastLogin: false,
        //    dateFormat: false,
        //    exportAsCsv: false
        //}

        dsmx.api.core.postJson("/api/database/exportdatabase", JSON.stringify(exportSettings), doneCallback, failCallback);
    };

    dsmx.api.database.getDatabaseExportStatus = function (exportId, doneCallback, failCallback) {
        //var exportSettings =
        //{
        //    id: ""
        //}

        if (typeof exportId == "string") {
            exportId = {
                id: exportId
            };
        }

        dsmx.api.core.postJson("/api/database/exportdatabasestatus", JSON.stringify(exportId), doneCallback, failCallback);
    };

    dsmx.api.database.getEventGroups = function (settings, doneCallback, failCallback) {
        //settings = {
        //    campaignId: null,// One of CampaignId, CampaignName, DatabaseId, DatabaseName
        //    campaignName: null,// ' One of CampaignId, CampaignName, DatabaseId, DatabaseName
        //    databaseId: null, // One of CampaignId, CampaignName, DatabaseId, DatabaseName
        //    databaseName: null,// One of CampaignId, CampaignName, DatabaseId, DatabaseName
        //    eventTypeName: null,// On of EventTypeName or EventTypeNumeric or none of both
        //    eventTypeNumeric: null// On of EventTypeName or EventTypeNumeric or none of both
        //};

        dsmx.api.core.postJson("/api/database/geteventgroups", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.refreshUploadSession = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/database/refreshuploadkey/", doneCallback, failCallback);
    };

    dsmx.api.database.admin.refreshUploadSession = function (accountId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/database/refreshuploadkey/" + parseInt(accountId), doneCallback, failCallback);
    };

    dsmx.api.database.getColumnMappings = function (settings, doneCallback, failCallback) {
        //settings = {
        //mappingName: "",//Optional
        //mappingId: 0//Optional
        //};

        dsmx.api.core.postJson("/api/database/getcolumnmappings", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.exists = function (settings, doneCallback, failCallback) {
        //settings = {
        //databaseName: "",//Wether dbname or databaseid or both
        //databaseId: 0//Wether dbname or databaseid or both
        //};

        dsmx.api.core.postJson("/api/database/exists/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.delete = function (settings, doneCallback, failCallback) {
        //settings = {
        //databaseName: "",//Wether dbname or databaseid or both
        //databaseId: 0//Wether dbname or databaseid or both
        //};

        dsmx.api.core.postJson("/api/database/delete/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.admin.exists = function (settings, doneCallback, failCallback) {
        //settings = {
        //accountId: 0,
        //databaseName: "",//Wether dbname or databaseid or both
        //databaseId: 0//Wether dbname or databaseid or both
        //};

        dsmx.api.core.postJson("/api/database/exists/" + parseInt(settings.accountId), JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.admin.delete = function (settings, doneCallback, failCallback) {
        //settings = {
        //accountId: 0,
        //databaseName: "",//Wether dbname or databaseid or both
        //databaseId: 0//Wether dbname or databaseid or both
        //};

        dsmx.api.core.postJson("/api/database/delete/" + parseInt(settings.accountId), JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.admin.getColumnMappings = function (settings, doneCallback, failCallback) {
        //settings = {
        //mappingName: "",//Optional
        //mappingId: 0,//Optional
        //accountId: 0//Optional
        //};

        var path = "/api/database/getcolumnmappings";
        if (settings.accountId) {
            path += "/" + parseInt(settings.accountId);
            //delete settings.accountId;
        }

        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.createColumnMapping = function (columnMappings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/database/createcolumnmapping", JSON.stringify(columnMappings), doneCallback, failCallback);
    };

    dsmx.api.database.admin.createColumnMapping = function (columnMappings, doneCallback, failCallback) {
        var path = "/api/database/createcolumnmapping";
        if (columnMappings.accountId) {
            path += "/" + parseInt(columnMappings.accountId);
            //delete columnMappings.accountId;
        }

        dsmx.api.core.postJson(path, JSON.stringify(columnMappings), doneCallback, failCallback);
    };

    dsmx.api.database.deleteColumnMapping = function (settings, doneCallback, failCallback) {
        //var settings = {mappingId: 0}
        dsmx.api.core.postJson("/api/database/deletecolumnmapping/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.admin.deleteColumnMapping = function (settings, doneCallback, failCallback) {
        //var settings = {mappingId: 0, accountId}

        var path = "/api/database/deletecolumnmapping/";
        if (settings.accountId) {
            path += parseInt(settings.accountId);
            //delete settings.accountId;
        }

        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.getColumnNames = function (settings, doneCallback, failCallback) {
        //var settings = {
        //Id: 0,//Id or name
        //name: ""//Id or name
        //}
        dsmx.api.core.postJson("/api/database/getcolumnnames/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.admin.getColumnNames = function (settings, doneCallback, failCallback) {
        //var settings = {
        //Id: 0,//Id or name
        //name: ""//Id or name
        //accountId: 0//Optional
        //}

        var path = "/api/database/getcolumnnames/";
        if (settings.accountId) {
            path += parseInt(settings.accountId);
            //delete settings.accountId;
        }

        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.createDatabaseFromFile = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    fileName: "",
        //    newDatabaseName: "",
        //    tableName: "",
        //    lpLoginModus: "",
        //    lpLoginColumn1: "",
        //    lpLoginSeperator: "",
        //    lpLoginColumn2: "",
        //    allowSpecialSigns: false,
        //};

        var path = "/api/database/createdatabasefromfile/";
        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.admin.createDatabaseFromFile = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    fileName: "",
        //    newDatabaseName: "",
        //    tableName: "",
        //    lpLoginModus: "",
        //    lpLoginColumn1: "",
        //    lpLoginSeperator: "",
        //    lpLoginColumn2: "",
        //    allowSpecialSigns: false,
        //    accountId: 0,
        //};

        var path = "/api/database/createdatabasefromfile/";
        if (settings.accountId) {
            path += parseInt(settings.accountId);
        }

        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.importDatabaseFromFile = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    serverKey: "",
        //    db: "",
        //    columnMappings: [
        //      {databaseColumn: "column1", "fileColumn": "fcolumn1"},
        //      {databaseColumn: "column2", "fileColumn": "fcolumn2"},
        //    ],
        //    fileName: "",
        //    tableName: "",
        //    batchName: "",
        //    managerId: ""
        //};

        var path = "/api/database/importdatabasefromfile/";
        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.admin.importDatabaseFromFile = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    serverKey: "",
        //    db: "",
        //    columnMappings: [
        //      {databaseColumn: "column1", "fileColumn": "fcolumn1"},
        //      {databaseColumn: "column2", "fileColumn": "fcolumn2"},
        //    ],
        //    fileName: "",
        //    tableName: "",
        //    batchName: "",
        //    managerId: "",
        //    accountId: 0
        //};

        var path = "/api/database/importdatabasefromfile/";
        if (settings.accountId) {
            path += parseInt(settings.accountId);
        }

        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.databaseUploadStateE = {
        accepted: 1,
        duplicateDatabaseName: 2,
        couldNotReadRequest: 3,
        noDatabaseFileExists: 4,
        tableDoesNotExist: 5,
        noTableNameProvided: 6,
        columnForPart1DoesNotExist: 7,
        columnForPart2DoesNotExist: 8,
        noColumnsProvided: 9,
        managerIdDoesNotExist: 10,
        previewDataMissing: 11,
        failed: 12,
        saasRecordContingentExhausted: 13,
        lpLoginColumnNotAllowed: 14,
        couldNotReadUniqueColumnValues: 15,
        couldNotAddMissingColumns: 16,
        couldNotReadExistingColumns: 17,
        xmediaIDColumnNotAllowed: 18
    };

    dsmx.api.database.databaseImportStateE = {
        managerIdDoesNotExist: 1,
        processing: 2,
        finished: 3,
        couldNotReadRequest: 4,
        noProgressAvailable: 5,
        failed: 6
    };

    dsmx.api.database.getCreationStatus = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    ManagerId: "xyzabc",
        //    StatusType: 0 //0 = DatabaseImport; 1 = RecordUpdates
        //};

        var path = "/api/database/creationstatus/";
        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.getImportStatus = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    ManagerId: "xyzabc",
        //    ThreadId: 0
        //};

        var path = "/api/database/importstatus/";
        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.database.getEnvironmentMetaData = function (parameters, doneCallback, failCallback) {
        /*var parameters = {
        campaignId: 10, //or campaign name
        campaignName: "",//or campaign id
        }*/

        var successCallback = function (result) {
            if (result.state == 0) {
                var environmentData = result.responseObject.environmentData;

                if (environmentData && environmentData.length > 0) {
                    var resultsByLanguage = {};

                    for (var i = 0; i < environmentData.length; ++i) {
                        var item = {};

                        if (!resultsByLanguage.hasOwnProperty(environmentData[i].lang)) {
                            resultsByLanguage[environmentData[i].lang] = item;
                        } else {
                            item = resultsByLanguage[environmentData[i].lang];
                        }

                        item[environmentData[i].name] = environmentData[i].value;
                    }

                    result.responseObject.environmentData = resultsByLanguage;
                }
            }

            doneCallback(result);
        }

        dsmx.api.core.postJson("/api/database/environmentmetadata", JSON.stringify(parameters), successCallback, failCallback);
    };

    dsmx.api.database.admin.getEnvironmentMetaData = function (parameters, doneCallback, failCallback) {
        /*var parameters = {
        campaignId: 10, //or campaign name
        campaignName: "",//or campaign id
        accountId: 0
        }*/

        var successCallback = function (result) {
            if (result.state == 0) {
                var environmentData = result.responseObject.environmentData;

                if (environmentData && environmentData.length > 0) {
                    var resultsByLanguage = {};

                    for (var i = 0; i < environmentData.length; ++i) {
                        var item = {};

                        if (!resultsByLanguage.hasOwnProperty(environmentData[i].lang)) {
                            resultsByLanguage[environmentData[i].lang] = item;
                        } else {
                            item = resultsByLanguage[environmentData[i].lang];
                        }

                        item[environmentData[i].name] = environmentData[i].value;
                    }

                    result.responseObject.environmentData = resultsByLanguage;
                }
            }

            doneCallback(result);
        }

        dsmx.api.core.postJson("/api/database/environmentmetadata/" + encodeURIComponent(parseInt(parameters.accountId)), JSON.stringify(parameters), successCallback, failCallback);
    };

    dsmx.api.database.getInfo = function (request, doneCallback, failCallback) {
        //var request = {
        //    database: {
        //        databaseName: "",//Either this or databaseId
        //        databaseId: 0//Either this or databaseName
        //    },
        //    retrieveSyncCounters: false,
        //    retrieveCustomerIdsWithEvents: true,
        //    customerIds: [1,2,3],//optional
        //    campaignForCustomerIds: {//Optional
        //        campaignName: "",//Either this or campaignId
        //        campaignId: 0//Either this or campaignName
        //    }
        //};

        dsmx.api.core.postJson("/api/database/dbinfo/", JSON.stringify(request), doneCallback, failCallback);
    }

    dsmx.api.database.admin.getInfo = function (request, doneCallback, failCallback) {
        //var request = {
        //    accountId: 0,
        //    database: {
        //        databaseName: "",//Either this or databaseId
        //        databaseId: 0//Either this or databaseName
        //    },
        //    retrieveSyncCounters: false,
        //    retrieveCustomerIdsWithEvents: true,
        //    customerIds: [1,2,3],//optional
        //    campaignForCustomerIds: {//Optional
        //        campaignName: "",//Either this or campaignId
        //        campaignId: 0//Either this or campaignName
        //    }
        //};

        dsmx.api.core.postJson("/api/database/dbinfo/" + encodeURIComponent(parseInt(request.accountId)), JSON.stringify(request), doneCallback, failCallback);
    }

    dsmx.api.database.recreateLpLogins = function (settings, doneCallback, failCallback) {
        var accountId = "";

        if (typeof settings.accountId != "undefined") {
            accountId = parseInt(settings.accountId);
        }

        dsmx.api.core.postJson("/api/database/recreatelplogins/" + accountId, JSON.stringify(settings), doneCallback, failCallback);
    }

    dsmx.api.database.getLpLoginRecreationStatus = function (settings, doneCallback, failCallback) {
        if (typeof settings.serverKey == "undefined") {
            throw "No server key specified";
        } else if (typeof settings.threadId == "undefined") {
            throw "No thread id specified";
        }

        dsmx.api.core.get("/api/database/createlploginstatus/" + encodeURIComponent(settings.serverKey) + "/" + encodeURIComponent(parseInt(settings.threadId)), doneCallback, failCallback);
    }

    dsmx.api.database.getLpLogin = function (database, doneCallback, failCallback) {
        var accountId = "";

        if (typeof database.accountId != "undefined") {
            accountId = parseInt(settings.accountId);
        }

        dsmx.api.core.postJson("/api/database/getlplogin/" + accountId, JSON.stringify(database), doneCallback, failCallback);
    }

    dsmx.api.database.admin.changePasswordField = function (settings, doneCallback, failCallback) {
        //var settings = {
        //accountId: 0,//sysadmin only
        //    database: {
        //        databaseId: "",//Id or Name
        //        databaseName: ""//Id or Name
        //    },
        //    columnName: ""
        //};

        var accountId = "";

        if (typeof settings.accountId != "undefined") {
            accountId = parseInt(settings.accountId);
        }

        dsmx.api.core.postJson("/api/database/changepasswordcolumn/" + accountId, JSON.stringify(settings), doneCallback, failCallback);
    }

    dsmx.api.database.changePasswordField = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    database: {
        //        databaseId: "",//Id or Name
        //        databaseName: ""//Id or Name
        //    },
        //    columnName: ""
        //};

        dsmx.api.core.postJson("/api/database/changepasswordcolumn/", JSON.stringify(settings), doneCallback, failCallback);
    }

    // PORTAL USERS
    dsmx.api.portalUsers.login = function (login, password, doneCallback, failCallback) {
        var json = JSON.stringify({ "login": login, "password": password });

        dsmx.api.core.postJsonNoSigning("/api/portaluser/login", json, doneCallback, failCallback);
    };

    dsmx.api.portalUsers.getAccessLevel = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/portaluser/accesslevel", doneCallback, failCallback);
    };

    dsmx.api.portalUsers.createMaster = function (createMasterModel, doneCallback, failCallback) {
        var json = JSON.stringify(createMasterModel);

        dsmx.api.core.postJson("/api/portaluser/createmaster", json, doneCallback, failCallback);
    };

    dsmx.api.portalUsers.create = function (creationOptions, doneCallback, failCallback) {
        var json = JSON.stringify(creationOptions);

        dsmx.api.core.postJson("/api/portaluser/create", json, doneCallback, failCallback);
    };

    dsmx.api.portalUsers.update = function (updateModel, doneCallback, failCallback) {
        var json = JSON.stringify(updateModel);

        dsmx.api.core.postJson("/api/portaluser/update", json, doneCallback, failCallback);
    };

    dsmx.api.portalUsers.get = function (query, doneCallback, failCallback) {
        var json = JSON.stringify(query);

        dsmx.api.core.postJson("/api/portaluser/get", json, doneCallback, failCallback);
    };

    dsmx.api.portalUsers.getWithQuery = function (queryModel, doneCallback, failCallback) {
        var json = JSON.stringify(queryModel);
        var url = "/api/portaluser/getwithquery";

        if (queryModel.roleName != null) {
            url += "/" + encodeURIComponent(queryModel.roleName);
            delete queryModel.roleName;
        }

        dsmx.api.core.postJson(url, json, doneCallback, failCallback);
    };

    dsmx.api.portalUsers.getCount = function (query, doneCallback, failCallback) {
        var json = JSON.stringify(query);

        dsmx.api.core.postJson("/api/portaluser/getcount", json, doneCallback, failCallback);
    };

    dsmx.api.portalUsers.getCountWithQuery = function (queryModel, doneCallback, failCallback) {
        var json = JSON.stringify(queryModel);
        var url = "/api/portaluser/getwithquery";

        if (queryModel.roleName != null) {
            url += "/" + encodeURIComponent(queryModel.roleName);
            delete queryModel.roleName;
        }

        dsmx.api.core.postJson(url, json, doneCallback, failCallback);
    };

    dsmx.api.portalUsers.delete = function (id, doneCallback, failCallback) {
        dsmx.api.core.get("/api/portaluser/delete/" + parseInt(id), doneCallback, failCallback);
    };

    dsmx.api.portalUsers.getRoles = function (portalUserId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/portaluser/getroles/" + parseInt(portalUserId), doneCallback, failCallback);
    };

    dsmx.api.portalUsers.getUserInfo = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/portaluser/getuserinfo", doneCallback, failCallback);
    };

    dsmx.api.portalUsers.setMasterUser = function (ids, doneCallback, failCallback) {
        if (!ids || !ids.userId) {
            throw "No user id provided";
        }

        var masterUserId = "/";

        if (parseInt(ids.masterUserId) > 0) {
            masterUserId += parseInt(ids.masterUserId);
        }


        dsmx.api.core.get("/api/portaluser/setmasteruser/" + parseInt(ids.userId) + masterUserId, doneCallback, failCallback);
    };

    dsmx.api.portalUsers.assignRole = function (portalUserId, role, doneCallback, failCallback) {
        dsmx.api.core.get("/api/portaluser/assignrole/" + parseInt(portalUserId) + "/" + encodeURIComponent(role), doneCallback, failCallback);
    };

    dsmx.api.portalUsers.removeRole = function (portalUserId, role, doneCallback, failCallback) {
        dsmx.api.core.get("/api/portaluser/removerole/" + parseInt(portalUserId) + "/" + encodeURIComponent(role), doneCallback, failCallback);
    };

    dsmx.api.portalUsers.requestResetPassword = function (config, doneCallback, failCallback) {
        if (!config) {
            throw "No config object given!";
        }

        dsmx.api.core.get("/api/portaluser/requestresetpassword/" + encodeURIComponent(config.loginName) + "/" + encodeURIComponent(config.skinName) + "/", doneCallback, failCallback);
    };

    dsmx.api.portalUsers.resetPassword = function (config, doneCallback, failCallback) {
        if (!config) {
            throw "No config object given!";
        }

        dsmx.api.core.postJson("/api/portaluser/resetpassword/", JSON.stringify(config), doneCallback, failCallback);
    };


    // PORTAL SKINS
    dsmx.api.portalSkins.transformOptionsToJSON = function (portalSkin) {
        if (portalSkin != null) {
            if (!portalSkin.options) {
                portalSkin.options = {};
            } else {
                if (typeof portalSkin.options == "string") {
                    try {
                        portalSkin.options = JSON.parse(portalSkin.options);
                    } catch (e) {
                    }

                    if (!portalSkin.options) {
                        portalSkin.options = {};
                    }
                }
            }
        }
    };

    dsmx.api.portalSkins.transformOptionsToString = function (portalSkin) {
        if (typeof portalSkin != "undefined" && portalSkin != null) {
            if (portalSkin.options && typeof portalSkin.options == "object") {
                try {
                    portalSkin.options = JSON.stringify(portalSkin.options);
                } catch (e) {

                }
            }
        }
    };

    dsmx.api.portalSkins.getAll = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/portal/skins/get/", function (response) {
            var i;

            if (response.state == 0) {
                if (response.responseObject && response.responseObject.length > 0) {
                    for (i = 0; i < response.responseObject.length; i += 1) {
                        dsmx.api.portalSkins.transformOptionsToJSON(response.responseObject[i]);
                    }
                }
            }
            doneCallback(response);
        }, failCallback);
    };

    dsmx.api.portalSkins.getByName = function (skinName, doneCallback, failCallback) {
        if (!skinName) {
            throw "No skin name provided.";
        }

        dsmx.api.core.get("/api/portal/skins/getbyname/" + encodeURIComponent(skinName) + "/", doneCallback, failCallback);
    };

    dsmx.api.portalSkins.delete = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params given";
        }

        if (!params.skinId) {
            throw "No skin id given";
        }

        dsmx.api.core.get("/api/portal/skins/delete/" + parseInt(params.skinId), doneCallback, failCallback);
    };

    dsmx.api.portalSkins.create = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params given";
        }

        if (!params.skin) {
            throw "No skin given";
        }

        dsmx.api.portalSkins.transformOptionsToString(params.skin);

        var json = JSON.stringify(params.skin);
        dsmx.api.core.postJson("/api/portal/skins/create", json, doneCallback, failCallback);
    };

    dsmx.api.portalSkins.copy = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params given";
        }

        if (!params.originalSkinName) {
            throw "No original skin name given";
        }

        if (!params.newSkinName) {
            throw "No new skin name given";
        }

        var json = JSON.stringify(params.skin);
        dsmx.api.core.get("/api/portal/skins/copy/" + encodeURIComponent(params.originalSkinName) + "/" + encodeURIComponent(params.newSkinName) + "/", doneCallback, failCallback);
    };

    dsmx.api.portalSkins.save = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params given";
        }

        if (!params.skin) {
            throw "No skin given";
        }

        dsmx.api.portalSkins.transformOptionsToString(params.skin);

        var json = JSON.stringify(params.skin);
        dsmx.api.core.postJson("/api/portal/skins/save", json, doneCallback, failCallback);
    };

    dsmx.api.portalSkins.loadSettings = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params given";
        }

        if (!params.skinId) {
            throw "No skin id given";
        }

        dsmx.api.core.get("/api/portal/skins/settings/load/" + parseInt(params.skinId), function (response) {
            if (response.state == 0) {
                if (response.responseObject && response.responseObject.length > 0) {
                    try {
                        response.responseObject = JSON.parse(response.responseObject);
                    } catch (e) {

                    }
                } else {
                    response.responseObject = {};
                }
            }

            doneCallback(response);
        }, failCallback);
    };

    dsmx.api.portalSkins.saveSettings = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params given";
        }

        if (!params.skinId) {
            throw "No skin id given";
        }

        if (!params.settings) {
            throw "No settings given";
        }

        if (typeof params.settings != "object") {
            throw "Settings has to be an object.";
        }

        var settings = {
            "skinId": params.skinId,
            "options": JSON.stringify(params.settings)
        };

        var json = JSON.stringify(settings);
        dsmx.api.core.postJson("/api/portal/skins/settings/save", json, doneCallback, failCallback);
    };

    dsmx.api.portalSkins.getResources = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params given";
        }

        if (!params.skinId) {
            throw "No skin id given";
        }

        dsmx.api.core.get("/api/portal/skins/resources/get/" + parseInt(params.skinId), doneCallback, failCallback);
    };

    dsmx.api.portalSkins.deleteResource = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params given";
        }

        if (!params.skinId) {
            throw "No skin id given";
        }

        if (typeof params.fileName == "undefined" || params.fileName === null || param.fieldName === "") {
            throw "No file name given";
        }


        dsmx.api.core.get("/api/portal/skins/resources/delete/" + parseInt(params.skinId) + "/" + encodeURIComponent(params.fileName) + "/", doneCallback, failCallback);
    };

    dsmx.api.portalSkins.exportByName = function (skinName, doneCallback, failCallback) {
        if (!skinName) {
            throw "No skin name provided";
        }

        dsmx.api.core.get("/api/portal/skins/exportbyname/" + encodeURIComponent(skinName) + "/", doneCallback, failCallback);
    };

    dsmx.api.portalSkins.exportById = function (skinId, doneCallback, failCallback) {
        if (!skinId) {
            throw "No skin id provided";
        }

        if (parseInt(skinId) <= 0) {
            throw "Invalid skin id provided";
        }

        dsmx.api.core.get("/api/portal/skins/exportbyid/" + encodeURIComponent("" + skinId) + "/", doneCallback, failCallback);
    };

    dsmx.api.portalSkins.statusE = {
        failed: 0,
        queued: 1,
        running: 2,
        completed: 3
    };

    dsmx.api.portalSkins.getStatus = function (statusId, doneCallback, failCallback) {
        if (!statusId) {
            throw "No status id provided";
        }

        dsmx.api.core.get("/api/portal/skins/status/" + encodeURIComponent(statusId) + "/", doneCallback, failCallback);
    };

    // PORTAL USER ROLES

    dsmx.api.portalUserRoles.get = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/portaluserrole/get", doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getWithQuery = function (query, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getwithquery", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getModelsWithQuery = function (query, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getmodelswithquery", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getCountWithQuery = function (query, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getcountwithquery", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getByUser = function (query, userId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getbyuser/" + parseInt("" + userId), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getModelsByUser = function (query, userId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getmodelsbyuser/" + parseInt("" + userId), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getCountByUser = function (query, userId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getcountbyuser/" + parseInt("" + userId), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getByCategory = function (query, categoryName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getbycategory/" + encodeURIComponent(categoryName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getModelsByCategory = function (query, categoryName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getmodelsbycategory/" + encodeURIComponent(categoryName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getCountByCategory = function (query, categoryName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getcountbycategory/" + encodeURIComponent(categoryName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getByCampaignTemplate = function (query, campaignTemplateId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getbycampaigntemplate/" + parseInt("" + campaignTemplateId), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getCountByCampaignTemplate = function (query, campaignTemplateId, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getcountbycampaigntemplate/" + parseInt("" + campaignTemplateId), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getByDocumentTemplate = function (query, documentTemplateName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getbydocumenttemplate/" + encodeURIComponent(documentTemplateName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.getCountByDocumentTemplate = function (query, documentTemplateName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/portaluserrole/getcountbydocumenttemplate/" + encodeURIComponent(documentTemplateName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.add = function (userRole, doneCallback, failCallback) {
        dsmx.api.core.get("/api/portaluserrole/add/" + encodeURIComponent(userRole), doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.addReturnModel = function (userRole, doneCallback, failCallback) {
        dsmx.api.core.get("/api/portaluserrole/add/" + encodeURIComponent(userRole) + "/returnmodel", doneCallback, failCallback);
    };

    dsmx.api.portalUserRoles.delete = function (userRole, doneCallback, failCallback) {
        dsmx.api.core.get("/api/portaluserrole/delete/" + encodeURIComponent(userRole), doneCallback, failCallback);
    };


    // DATARELATIONS
    //              Admin
    dsmx.api.dataRelations.admin.getMetaData = function (doneCallback, failCallback) {
        //returns a list of all available data relations
        dsmx.api.core.get("/api/datarelations/admin/metadata", doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.getMetaDataForVersion = function (version, doneCallback, failCallback) {
        //returns a list of all available data relations
        dsmx.api.core.get("/api/datarelations/admin/metadata/version/" + encodeURIComponent("" + version), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.getCampaignRelations = function (campaignName, doneCallback, failCallback) {
        //returns a list of all available data relations
        dsmx.api.core.get("/api/datarelations/admin/campaignrelations/" + encodeURIComponent(campaignName), doneCallback, failCallback);
    };

    // DATARELATIONS
    //              Admin
    dsmx.api.dataRelations.admin.getMetaDataForType = function (dataRelationType, doneCallback, failCallback) {
        //returns a list of all available data relations
        dsmx.api.core.get("/api/datarelations/admin/metadata/" + encodeURIComponent("" + dataRelationType), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.getTables = function (dataRelationSettings, doneCallback, failCallback) {
        //returns a list of all available tables and their columns for the data relation that is specified inside the settings object
        dsmx.api.core.postJson("/api/datarelations/admin/tables", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.getTableNames = function (dataRelationSettings, doneCallback, failCallback) {
        //returns a list of all available tables and their columns for the data relation that is specified inside the settings object
        dsmx.api.core.postJson("/api/datarelations/admin/tablenames", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.getColumns = function (dataRelationSettings, doneCallback, failCallback) {
        //returns a list of all available tables and their columns for the data relation that is specified inside the settings object
        dsmx.api.core.postJson("/api/datarelations/admin/columns", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.campaign.getColumns = function (dataRelationSettings, doneCallback, failCallback) {
        //returns a list of all available tables and their columns for the data relation that is specified inside the settings object
        dsmx.api.core.postJson("/api/datarelations/admin/campaign/columns", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.get = function (dataRelationSettings, doneCallback, failCallback) {
        //returns a list of all records that are specified inside the query property of the given settings object.
        dsmx.api.core.postJson("/api/datarelations/admin/list", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.campaign.get = function (dataRelationSettings, doneCallback, failCallback) {
        //returns a list of all records that are specified inside the query property of the given settings object.
        dsmx.api.core.postJson("/api/datarelations/admin/campaign/list", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.count = function (dataRelationSettings, doneCallback, failCallback) {
        //returns te count of all records that are specified inside the query property of the given settings object.
        dsmx.api.core.postJson("/api/datarelations/admin/count", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.campaign.count = function (dataRelationSettings, doneCallback, failCallback) {
        //returns te count of all records that are specified inside the query property of the given settings object.
        dsmx.api.core.postJson("/api/datarelations/admin/campaign/count", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.update = function (dataRelationSettingsAndTable, doneCallback, failCallback) {
        //updates one or more records that are given inside the records object of the provided settings object
        dsmx.api.core.postJson("/api/datarelations/admin/update", JSON.stringify(dataRelationSettingsAndTable), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.campaign.update = function (dataRelationSettingsAndTable, doneCallback, failCallback) {
        //updates one or more records that are given inside the records object of the provided settings object
        dsmx.api.core.postJson("/api/datarelations/admin/campaign/update", JSON.stringify(dataRelationSettingsAndTable), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.updateConvert = function (dataRelationSettingsAndTable, doneCallback, failCallback) {
        //updates one or more records that are given inside the records object of the provided settings object
        dsmx.api.core.postJson("/api/datarelations/admin/update/convert", JSON.stringify(dataRelationSettingsAndTable), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.create = function (dataRelationSettingsAndTable, doneCallback, failCallback) {
        //creates one or more records that are given inside the records object of the provided settings object
        dsmx.api.core.postJson("/api/datarelations/admin/create", JSON.stringify(dataRelationSettingsAndTable), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.campaign.create = function (dataRelationSettingsAndTable, doneCallback, failCallback) {
        //creates one or more records that are given inside the records object of the provided settings object
        dsmx.api.core.postJson("/api/datarelations/admin/campaign/create", JSON.stringify(dataRelationSettingsAndTable), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.delete = function (dataRelationSettings, recordId, doneCallback, failCallback) {
        //updates one or more records that are given inside the records object of the provided settings object
        if (Object.prototype.toString.call(recordId) === "[object Array]") {
            var settings = JSON.parse(JSON.stringify(dataRelationSettings));
            settings.recordIds = recordId;
            dsmx.api.core.postJson("/api/datarelations/admin/deletemultiple/", JSON.stringify(settings), doneCallback, failCallback);
        } else {
            dsmx.api.core.postJson("/api/datarelations/admin/delete/" + encodeURIComponent(recordId) + "/", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
        }
    };

    dsmx.api.dataRelations.admin.campaign.delete = function (dataRelationSettings, recordId, doneCallback, failCallback) {
        //updates one or more records that are given inside the records object of the provided settings object
        if (Object.prototype.toString.call(recordId) === "[object Array]") {
            var settings = JSON.parse(JSON.stringify(dataRelationSettings));
            settings.recordIds = recordId;
            dsmx.api.core.postJson("/api/datarelations/admin/campaign/deletemultiple/", JSON.stringify(settings), doneCallback, failCallback);
        } else {
            dsmx.api.core.postJson("/api/datarelations/admin/campaign/delete/" + encodeURIComponent(recordId) + "/", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
        }
    };

    dsmx.api.dataRelations.admin.delete2 = function (dataRelationSettings, doneCallback, failCallback) {
        //Same as delete, but expects only one parameter, so we can use it inside the easy wrappers
        dsmx.api.dataRelations.admin.delete(dataRelationSettings, dataRelationSettings.recordId, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.campaign.delete2 = function (dataRelationSettings, doneCallback, failCallback) {
        //Same as delete, but expects only one parameter, so we can use it inside the easy wrappers
        dsmx.api.dataRelations.admin.campaign.delete(dataRelationSettings, dataRelationSettings.recordId, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.event = function (dataRelationSettingsAndEvent, doneCallback, failCallback) {
        //updates one or more records that are given inside the records object of the provided settings object
        dsmx.api.core.postJson("/api/datarelations/admin/event", JSON.stringify(dataRelationSettingsAndEvent), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.campaign.event = function (dataRelationSettingsAndEvent, doneCallback, failCallback) {
        //updates one or more records that are given inside the records object of the provided settings object
        dsmx.api.core.postJson("/api/datarelations/admin/campaign/event", JSON.stringify(dataRelationSettingsAndEvent), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.execute = function (dataRelationSettingsAndButtonAction, doneCallback, failCallback) {
        //updates one or more records that are given inside the records object of the provided settings object
        dsmx.api.core.postJson("/api/datarelations/admin/execute", JSON.stringify(dataRelationSettingsAndButtonAction), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.campaign.execute = function (dataRelationSettingsAndButtonAction, doneCallback, failCallback) {
        //updates one or more records that are given inside the records object of the provided settings object
        dsmx.api.core.postJson("/api/datarelations/admin/campaign/execute", JSON.stringify(dataRelationSettingsAndButtonAction), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.getAvailableDataTypesForColumnCreation = function (dataRelationSettings, doneCallback, failCallback) {
        //Retrieves the list of available data types that are valid for column creation, if this list is empty, the underlying table does not support column creation
        dsmx.api.core.postJson("/api/datarelations/admin/datatypes4columncreation", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.getScriptingRelationMetaData = function (dataRelationSettings, doneCallback, failCallback) {
        //Retrieves the list of available data types that are valid for column creation, if this list is empty, the underlying table does not support column creation
        dsmx.api.core.postJson("/api/datarelations/admin/scriptingrelationmetadata", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.getScriptingRelationLog = function (logSettings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/datarelations/admin/scriptingrelation/log/", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.createColumn = function (dataRelationSettings, columnName, dataType, length, doneCallback, failCallback) {
        //Creates a new column

        var escapeValue = function (val) {
            if (val != "undefined" && val != null) {
                val = "" + val;
                return val.replace(/_/g, "__").replace(/\[/g, "_[").replace(/\]/g, "_]").replace(/;/g, "_;").replace(/,/g, "_,");
            } else {
                return "";
            }
        };

        var internalDataType = dataType;
        var i;
        var value;

        if (internalDataType != null && Object.prototype.toString.call(internalDataType) !== "[object String]") {
            if (Object.prototype.toString.call(internalDataType) === "[object Array]") {
                value = "select[";

                for (i = 0; i < internalDataType.length; i += 1) {
                    value += escapeValue(internalDataType[i]);

                    if (i < internalDataType.length - 1) {
                        value += ",";
                    }
                }

                value += "]";

                internalDataType = value;
            } else {
                value = "select[";

                Object.keys(internalDataType).forEach(function (property) {
                    if (internalDataType.hasOwnProperty(property)) {
                        value += escapeValue(property) + ";" + escapeValue(internalDataType[property]) + ",";
                    }
                });

                value = value.substr(0, value.length - 1);
                value += "]";

                internalDataType = value;
            }
        }

        dsmx.api.core.postJson("/api/datarelations/admin/createcolumn/" + encodeURIComponent(columnName) + "/" + encodeURIComponent(internalDataType) + "/" + encodeURIComponent(length), JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.createColumn2 = function (dataRelationSettings, doneCallback, failCallback) {
        //Same as dsmx.api.dataRelations.admin.createColumn but with obnly one parameter so we can use it with our easy wrappers
        dsmx.api.dataRelations.admin.createColumn(dataRelationSettings, dataRelationSettings.columnName, dataRelationSettings.dataType, dataRelationSettings.length, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.getDeleteableColumns = function (dataRelationSettings, doneCallback, failCallback) {
        //Creates a new column
        dsmx.api.core.postJson("/api/datarelations/admin/deleteablecolumns", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.deleteColumn = function (dataRelationSettings, columnName, doneCallback, failCallback) {
        //Creates a new column
        dsmx.api.core.postJson("/api/datarelations/admin/deletecolumn/" + encodeURIComponent(columnName), JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.deleteColumn2 = function (dataRelationSettings, doneCallback, failCallback) {
        //Same as dsmx.api.dataRelations.admin.deleteColumn but with only one paramater to be used with the easy wrappers
        dsmx.api.core.postJson("/api/datarelations/admin/deletecolumn/" + encodeURIComponent(dataRelationSettings.columnName), JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.supportsColumnCreation = function (dataRelationSettings, doneCallback, failCallback) {
        //Creates a new column
        dsmx.api.core.postJson("/api/datarelations/admin/supportscolumncreation", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.getFieldsInfo = function (dataRelationSettings, doneCallback, failCallback) {
        //Creates a new column
        dsmx.api.core.postJson("/api/datarelations/admin/fieldsinfo", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.admin.executeColumnAction = function (dataRelationSettings, doneCallback, failCallback) {
        //Creates a new column
        dsmx.api.core.postJson("/api/datarelations/admin/columnaction", JSON.stringify(dataRelationSettings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.getAvailableDataTypesForColumnCreation = function (dataRelationName, doneCallback, failCallback) {
        //Retrieves the list of available data types that are valid for column creation, if this list is empty, the underlying table does not support column creation
        dsmx.api.core.get("/api/datarelations/datatypes4columncreation/" + encodeURIComponent(dataRelationName), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.createColumn = function (dataRelationName, columnName, dataType, length, doneCallback, failCallback) {
        var value;
        //Creates a new column

        var escapeValue = function (val) {
            if (val != "undefined" && val != null) {
                val = "" + val;
                return val.replace(/_/g, "__").replace(/\[/g, "_[").replace(/\]/g, "_]").replace(/;/g, "_;").replace(/,/g, "_,");
            } else {
                return "";
            }
        };


        var internalDataType = dataType;
        var i;

        if (internalDataType != null && Object.prototype.toString.call(internalDataType) !== "[object String]") {
            if (Object.prototype.toString.call(internalDataType) === "[object Array]") {
                value = "select[";

                for (i = 0; i < internalDataType.length; i += 1) {
                    value += escapeValue(internalDataType[i]);

                    if (i < internalDataType.length - 1) {
                        value += ",";
                    }
                }

                value += "]";

                internalDataType = value;
            } else {
                value = "select[";

                Object.keys(internalDataType).forEach(function (property) {
                    if (internalDataType.hasOwnProperty(property)) {
                        value += escapeValue(property) + ";" + escapeValue(internalDataType[property]) + ",";
                    }
                });

                value = value.substr(0, value.length - 1);

                value += "]";

                internalDataType = value;
            }
        }
        dsmx.api.core.get("/api/datarelations/createcolumn/" + encodeURIComponent(dataRelationName) + "/" + encodeURIComponent(columnName) + "/" + encodeURIComponent(internalDataType) + "/" + encodeURIComponent(length), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.createColumn2 = function (settings, doneCallback, failCallback) {
        //Same as dsmx.api.dataRelations.createColumn buit with only one parameter so that we can use the easy wrappers
        dsmx.api.dataRelations.createColumn(settings.dataRelationName, settings.columnName, settings.dataType, settings.length, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.getDeleteableColumns = function (dataRelationName, doneCallback, failCallback) {
        //Creates a new column on the specified data relation
        dsmx.api.core.get("/api/datarelations/deleteablecolumns/" + encodeURIComponent(dataRelationName), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.deleteColumn = function (dataRelationName, columnName, doneCallback, failCallback) {
        //Creates a new column on the specified data relation
        dsmx.api.core.get("/api/datarelations/deletecolumn/" + encodeURIComponent(dataRelationName) + "/" + encodeURIComponent(columnName), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.deleteColumn2 = function (settings, doneCallback, failCallback) {
        dsmx.api.dataRelations.deleteColumn(settings.dataRelationName, settings.columnName, doneCallback, failCallback);
    };

    //              Purl visitors
    dsmx.api.dataRelations.getMetaData = function (doneCallback, failCallback) {
        //returns a list of all data relation instances that are available inside the given campaign
        dsmx.api.core.get("/api/datarelations/metadata/", doneCallback, failCallback);
    };

    dsmx.api.dataRelations.getColumns = function (dataRelationName, doneCallback, failCallback) {
        //returns a list of all data relation instances that are available inside the given campaign
        dsmx.api.core.get("/api/datarelations/columns/" + encodeURIComponent(dataRelationName), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.get = function (dataRelationName, dataRelationQuery, doneCallback, failCallback) {
        var json = "";

        if (dataRelationQuery) {
            json = JSON.stringify(dataRelationQuery);
        }
        //returns a list of all records that are selected via the given query
        dsmx.api.core.postJson("/api/datarelations/list/" + encodeURIComponent(dataRelationName), json, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.get2 = function (query, doneCallback, failCallback) {
        dsmx.api.dataRelations.get(query.dataRelationName, query, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.count = function (dataRelationName, dataRelationQuery, doneCallback, failCallback) {
        //returns the record count of all records specified by the provided query
        dsmx.api.core.postJson("/api/datarelations/count/" + encodeURIComponent(dataRelationName), JSON.stringify(dataRelationQuery), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.count2 = function (query, doneCallback, failCallback) {
        dsmx.api.dataRelations.count(query.dataRelationName, query, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.update = function (dataRelationName, dataRelationTable, doneCallback, failCallback) {
        //Updates all records that are specified inside the provided table object
        dsmx.api.core.postJson("/api/datarelations/update/" + encodeURIComponent(dataRelationName), JSON.stringify(dataRelationTable), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.update2 = function (table, doneCallback, failCallback) {
        dsmx.api.dataRelations.update(table.dataRelationName, table, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.create = function (dataRelationName, dataRelationTable, doneCallback, failCallback) {
        //Updates all records that are specified inside the provided table object
        dsmx.api.core.postJson("/api/datarelations/create/" + encodeURIComponent(dataRelationName), JSON.stringify(dataRelationTable), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.create2 = function (table, doneCallback, failCallback) {
        dsmx.api.dataRelations.create(table.dataRelationName, table, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.delete = function (dataRelationName, recordID, doneCallback, failCallback) {
        if (Object.prototype.toString.call(recordID) === "[object Array]" && recordID != null) {
            dsmx.api.core.postJson("/api/datarelations/delete/" + encodeURIComponent(dataRelationName) + "/", JSON.stringify(recordID), doneCallback, failCallback);
        } else {
            //Deletes the record with the given record id
            dsmx.api.core.get("/api/datarelations/delete/" + encodeURIComponent(dataRelationName) + "/" + encodeURIComponent(recordID), doneCallback, failCallback);
        }
    };

    dsmx.api.dataRelations.delete2 = function (settings, doneCallback, failCallback) {
        dsmx.api.dataRelations.delete(settings.dataRelationName, settings.recordId, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.event = function (dataRelationName, dataRelationEvent, doneCallback, failCallback) {
        //Writes an event to the specified record
        dsmx.api.core.postJson("/api/datarelations/event/" + encodeURIComponent(dataRelationName), JSON.stringify(dataRelationEvent), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.event2 = function (settings, doneCallback, failCallback) {
        dsmx.api.dataRelations.event(settings.dataRelationName, settings.event, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.execute = function (dataRelationName, buttonActionName, parameters, doneCallback, failCallback) {
        //Executes a button action
        dsmx.api.core.postJson("/api/datarelations/execute/" + encodeURIComponent(dataRelationName) + "/" + encodeURIComponent(buttonActionName), JSON.stringify(parameters), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.execute2 = function (settings, doneCallback, failCallback) {
        dsmx.api.dataRelations.execute(settings.dataRelationName, settings.buttonActionName, settings.parameters, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.getImportStatus = function (importkey, doneCallback, failCallback) {
        dsmx.api.core.get("/api/datarelations/import/status/" + encodeURIComponent(importkey), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.getImportColumnMappings = function (importkey, doneCallback, failCallback) {
        dsmx.api.core.get("/api/datarelations/import/mappings/" + encodeURIComponent(importkey), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.getImportResult = function (importkey, doneCallback, failCallback) {
        dsmx.api.core.get("/api/datarelations/import/result/" + encodeURIComponent(importkey), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.startImport = function (importkey, columnMappings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/datarelations/import/start/" + encodeURIComponent(importkey), JSON.stringify(columnMappings), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.startImport2 = function (settings, doneCallback, failCallback) {
        dsmx.api.dataRelations.startImport(settings.importkey, settings.columnMappings, doneCallback, failCallback);
    };

    dsmx.api.dataRelations.getUserRights = function (dataRelationName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/datarelations/userrights/" + encodeURIComponent(dataRelationName), doneCallback, failCallback);
    };

    dsmx.api.dataRelations.extensionItems = {
        isAdmin: function () {
            return window && window.parent && window.parent.iframeBridge && window.parent.iframeBridge.dataRelations;
        },
        hasIframeBridge: function () {
            return dsmx.api.dataRelations.extensionItems.isAdmin() && window.parent.iframeBridge.dataRelations.purlMethods;
        },
        getMetaData: function (callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.purlMethods.getMetaData(callback);
            } else {
                dsmx.api.dataRelations.e.getMetaData(function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        getColumns: function (dataRelationName, callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.purlMethods.getColumns(dataRelationName, callback);
            } else {
                dsmx.api.dataRelations.e.getColumns(dataRelationName, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        get: function (query, callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.purlMethods.get(query, callback);
            } else {
                dsmx.api.dataRelations.e.get2(query, function (result) {
                    callback(true, dsmx.model.dataRelations.convertTableToObjectArray(result));
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        count: function (query, callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.purlMethods.count(query, callback);
            } else {
                dsmx.api.dataRelations.e.count2(query, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        update: function (settings, callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.notifyDataChange();
                window.parent.iframeBridge.dataRelations.purlMethods.update(settings, callback);
            } else {
                var table = dsmx.model.dataRelations.convertObjectArrayToTable(settings.records);
                table.dataRelationName = settings.dataRelationName;

                dsmx.api.dataRelations.e.update2(table, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        create: function (settings, callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.notifyDataChange();
                window.parent.iframeBridge.dataRelations.purlMethods.create(settings, callback);
            } else {
                var table = dsmx.model.dataRelations.convertObjectArrayToTable(settings.records);
                table.dataRelationName = settings.dataRelationName;

                dsmx.api.dataRelations.e.create2(table, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        delete: function (settings, callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.notifyDataChange();
                window.parent.iframeBridge.dataRelations.purlMethods.delete(settings, callback);
            } else {
                dsmx.api.dataRelations.e.delete2(settings, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        getAvailableDataTypesForColumnCreation: function (dataRelationName, callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.purlMethods.getAvailableDataTypesForColumnCreation(settings, callback);
            } else {
                dsmx.api.dataRelations.e.getAvailableDataTypesForColumnCreation(dataRelationName, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        createColumn: function (settings, callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.notifyDataChange();
                window.parent.iframeBridge.dataRelations.purlMethods.createColumn(settings, callback);
            } else {
                dsmx.api.dataRelations.e.createColumn2(settings, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        deleteColumn: function (settings, callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.notifyDataChange();
                window.parent.iframeBridge.dataRelations.purlMethods.deleteColumn(settings, callback);
            } else {
                dsmx.api.dataRelations.e.deleteColumn2(settings, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        getUserRights: function (dataRelationName, callback) {
            if (dsmx.api.dataRelations.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.purlMethods.getUserRights(dataRelationName, callback);
            } else {
                dsmx.api.dataRelations.e.getUserRights(dataRelationName, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        }
    };

    dsmx.api.dr = dsmx.api.dataRelations.extensionItems;//Shorter alias for data relation api


    //              Campaign database
    dsmx.api.campaignDatabase.get = function (columns, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/datarelations/campaignDatabase/get", JSON.stringify(columns), function (result) {
            if (result.state == 0 && typeof result.responseObject == "string") {
                result.responseObject = JSON.parse(result.responseObject);
            }

            doneCallback(result);
        }, failCallback);
    };

    dsmx.api.campaignDatabase.update = function (data, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/datarelations/campaignDatabase/update", JSON.stringify(data), doneCallback, failCallback);
    };

    dsmx.api.campaignDatabase.extensionItems = {
        isAdmin: function () {
            return window && window.parent && window.parent.iframeBridge;
        },
        hasIframeBridge: function () {
            return dsmx.api.campaignDatabase.extensionItems.isAdmin() && window.parent.iframeBridge.campaignDatabase;
        },
        get: function (columns, callback) {
            if (dsmx.api.campaignDatabase.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.campaignDatabase.get(columns, callback);
            } else {
                dsmx.api.campaignDatabase.e.get(columns, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        },
        update: function (data, callback) {
            if (dsmx.api.campaignDatabase.extensionItems.hasIframeBridge()) {
                window.parent.iframeBridge.dataRelations.notifyDataChange();
                window.parent.iframeBridge.campaignDatabase.update(data, callback);
            } else {
                dsmx.api.campaignDatabase.e.update(data, function (result) {
                    callback(true, result);
                }, function (e) {
                    callback(false, e.message);
                });
            }
        }
    };

    dsmx.api.db = dsmx.api.campaignDatabase.extensionItems;//Shorter alias for data relation api


    //              Resources
    dsmx.api.resources.get = function (campaignName, resourceType, filter, pageNr, perPage, orderBys, oderByDescending, doneCallback, failCallback) {
        //Retrieves a list of resources
        var settings = {
        };
        settings.campaignName = campaignName;
        settings.resourceType = resourceType;
        settings.pageNr = pageNr;
        settings.perPage = perPage;
        settings.orderBys = orderBys;
        settings.filter = filter;
        settings.oderByDescending = oderByDescending;

        dsmx.api.core.postJson("/api/resources/get", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.resources.getWithQuery = function (query, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/resources/get", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.resources.count = function (campaignName, resourceType, filter, doneCallback, failCallback) {
        //Retrieves a list of resources
        var settings = {
        };
        settings.campaignName = campaignName;
        settings.resourceType = resourceType;
        settings.filter = filter;

        dsmx.api.core.postJson("/api/resources/getcount", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.resources.countWithQuery = function (query, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/resources/getcount", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.resources.getConversionStatus = function (fileName, resourceType, campaignName, doneCallback, failCallback) {
        if (!fileName) {
            fileName = "";
        }

        if (Object.prototype.toString.call(fileName) === "[object Array]") {
            //We got a list of file names, so use better method that queries the status of all files at once
            if (campaignName == null || campaignName.length == 0) {
                dsmx.api.core.postJson("/api/resources/getstatus/" + encodeURIComponent(resourceType) + "/", JSON.stringify(fileName), doneCallback, failCallback);
            } else {
                dsmx.api.core.postJson("/api/resources/getstatus/" + encodeURIComponent(resourceType) + "/" + encodeURIComponent(campaignName) + "/", JSON.stringify(fileName), doneCallback, failCallback);
            }
        } else {
            //Issues fith file names at end of uri, so replace points inside the file name
            fileName = fileName.replace(/\./g, "[ptrt]");

            if (campaignName == null || campaignName.length == 0) {
                dsmx.api.core.get("/api/resources/getstatus/" + encodeURIComponent(resourceType) + "/" + encodeURIComponent(fileName), doneCallback, failCallback);
            } else {
                dsmx.api.core.get("/api/resources/getstatus/" + encodeURIComponent(resourceType) + "/" + encodeURIComponent(campaignName) + "/" + encodeURIComponent(fileName), doneCallback, failCallback);
            }
        }
    };

    dsmx.api.resources.getConversionStatusByAccount = function (accountId, fileName, resourceType, campaignName, doneCallback, failCallback) {
        if (!fileName) {
            fileName = "";
        }

        if (Object.prototype.toString.call(fileName) === "[object Array]") {
            if (campaignName == null || campaignName.length == 0) {
                dsmx.api.core.postJson("/api/resources/getaccountstatus/" + encodeURIComponent(resourceType) + "/" + encodeURIComponent(accountId), JSON.stringify(fileName), doneCallback, failCallback);
            } else {
                dsmx.api.core.postJson("/api/resources/getaccountstatus/" + encodeURIComponent(resourceType) + "/" + encodeURIComponent(campaignName) + "/" + encodeURIComponent(accountId), JSON.stringify(fileName), doneCallback, failCallback);
            }
        } else {
            //Issues fith file names at end of uri, so replace points inside the file name
            fileName = fileName.replace(/\./g, "[ptrt]");

            if (campaignName == null || campaignName.length == 0) {
                dsmx.api.core.get("/api/resources/getaccountstatus/" + encodeURIComponent(resourceType) + "/" + encodeURIComponent(fileName) + "/" + encodeURIComponent(accountId), doneCallback, failCallback);
            } else {
                dsmx.api.core.get("/api/resources/getaccountstatus/" + encodeURIComponent(resourceType) + "/" + encodeURIComponent(campaignName) + "/" + encodeURIComponent(fileName) + "/" + encodeURIComponent(accountId), doneCallback, failCallback);
            }
        }
    };

    dsmx.api.resources.getConversionStatusByAccountParams = function (params, doneCallback, failCallback) {
        dsmx.api.resources.getConversionStatusByAccount(params.accountId, params.fileName, params.resourceType, params.campaignName, doneCallback, failCallback);
    };

    dsmx.api.resources.delete = function (campaignName, resourceType, fileName, doneCallback, failCallback) {
        if (fileName == null) {
            fileName = "";
        }
        //Issues fith file names at end of uri, so replace points inside the file name
        fileName = fileName.replace(/\./g, "[ptrt]");
        fileName = fileName.replace(/#/g, "[hash]");

        if (campaignName == null || campaignName.length == 0) {
            dsmx.api.core.get("/api/resources/delete/" + encodeURIComponent(resourceType) + "/" + encodeURIComponent(fileName), doneCallback, failCallback);
        } else {
            dsmx.api.core.get("/api/resources/delete/" + encodeURIComponent(resourceType) + "/" + encodeURIComponent(campaignName) + "/" + encodeURIComponent(fileName), doneCallback, failCallback);
        }
    };

    dsmx.api.resources.importFromURL = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/resources/importurl", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.resources.renameGroup = function (model, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/resources/renamegroup", JSON.stringify(model), doneCallback, failCallback);
    };

    dsmx.api.resources.changeGroup = function (settings, doneCallback, failCallback) {
        var multipleFiles = false;

        //settings:
        //{
        //  resourceType: 1,
        //  groupName: 'The new group name',
        //  resourceName: 'SomeFile.jpg',//fileName for single file, array for more than one files
        //  campaignId: 10; optional, required for campaign images
        //
        //}

        if (!settings) {
            throw "No settings provided";
        }

        if (typeof settings.resourceType == "undefined") {
            throw "No resource type provided";
        }

        if (typeof settings.groupName == "undefined") {
            throw "No group name provided.";
        }

        if (!settings.resourceName) {
            if (!settings.resourceNames || !settings.resourceNames.length) {
                throw "No resource name provided";
            }

            if (settings.resourceNames.length == 1) {
                settings.resourceName = settings.resourceNames[0];
            } else {
                multipleFiles = true;
            }

        } else if (Object.prototype.toString.call(settings.resourceName) === "[object Array]") {
            settings.resourceNames = settings.resourceName;
            multipleFiles = true;
        }

        if (!settings.campaignId) {
            settings.campaignId = -1;
        }

        var path = "/api/resources/changegroup";

        if (multipleFiles) {
            path = "/api/resources/changegroupforseveralfiles";
        }

        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    // User file uploads
    dsmx.api.userUploads.delete = function (deleteKey, doneCallback, failCallback) {
        dsmx.api.core.get("/api/fileupload/delete/" + encodeURIComponent(deleteKey) + "/", doneCallback, failCallback);
    };

    dsmx.api.userUploads.admin.delete = function (options, doneCallback, failCallback) {
        if (!options.campaignName) {
            throw "No campaign name given";
        }

        if (!options.xmediaId) {
            throw "No xmediaId given";
        }

        if (!options.deleteKey) {
            throw "No delete key given";
        }

        dsmx.api.core.get("/api/fileupload/delete/" + encodeURIComponent(options.campaignName) + "/" + encodeURIComponent(options.xmediaId) + "/" + encodeURIComponent(options.deleteKey) + "/", doneCallback, failCallback);
    };

    dsmx.api.userUploads.get = function (query, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/fileupload/get", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.userUploads.admin.get = function (options, doneCallback, failCallback) {
        if (!options.campaignName) {
            throw "No campaign name given";
        }

        var path = "/api/fileupload/get/" + encodeURIComponent(options.campaignName) + "/";

        if (typeof options.xmediaId != "undefined") {
            path += encodeURIComponent(parseInt(options.xmediaId)) + "/";
        }

        var query = options.query;

        if (!query) {
            query = null;
        }

        dsmx.api.core.postJson(path, JSON.stringify(query), doneCallback, failCallback);
    };

    /* api end */

    /* models start */

    dsmx.model.contact = {
    };
    dsmx.model.api = {
    };
    dsmx.model.api.createAccount = {
    };
    dsmx.model.api.query = {
    };
    dsmx.model.api.importFromUrl = {
    };
    dsmx.model.api.importStatus = {
    };
    dsmx.model.api.import = {
    };
    dsmx.model.api.campaignTemplates = {
    };
    dsmx.model.api.campaignTemplates.decision = {
    };
    dsmx.model.codeContract.language = {
    };
    dsmx.model.codeContract.country = {
    };
    dsmx.model.codeContract.mailAddress = {
    };
    dsmx.model.codeContract.pictureUrl = {
    };


    dsmx.model.eventTypeE = {
        login: 1,
        link: 3,
        eMailLink: 4,
        eMailOpen: 5,
        eMailSend: 6,
        submit: 7,
        newRecord: 9,
        eMailUnsubscribe: 10,
        eMailHardBounce: 11,
        eMailSmtpError: 12,
        smsSend: 14,
        smsError: 15,
        eMailSoftBounce: 16,
        eMailBlacklisted: 17,
        eMailUserAnswer: 18,
        visited: 20,
        printed: 21,
        shipped: 26,
        sentToWorkflow: 27,
        paymentReceived: 28,
        writeToDatabaseField: 29,
        fileUploaded: 30,
        sentToCloudDrive: 31,
        sentRenderRequest: 32,
        sentToCloudDriveError: 33,
        eMailError: 34,
        duplicateRegistration: 35,
        customEvent: 36,
        smsAnswer: 37,
        campaignCompleted: 39,
        partOfBatch: 40,
        partOfCampaign: 41,
        fulfillmentCompleted: 44,
        eMailDelivered: 45,
        PdfDownloaded: 46,
        LeadSource: 47
    };

    dsmx.model.taskTypeE = {
        unknown: 0,
        mailing: 1,
        mail: 2,
        renderDocument: 3,
        executeTask: 4,
        fulfillment: 5,
        databaseWriter: 6,
        sms: 7
    };

    dsmx.model.utility = {
        isNullableColumn: function (column) {
            if (column.type === "gender") {
                return true;
            }

            if (column.type === "nullableint") {
                return true;
            }

            if (column.type === "nullablebool") {
                return true;
            }

            if (column.type === "nullabledate") {
                return true;
            }

            return false;
        }
    };

    dsmx.model.getDisplayValueCore = function (column, value) {
        if (column && column.type && column.name) {
            if (column.type === "string") {
                if (value === null) {
                    return "";
                }

                return value;
            }

            if (column.type === "gender") {
                if (value === null || value === "") {
                    return "unknown";
                } else if (value === true || value === "true" || value === "True") {
                    return "female";
                } else {
                    return "male";
                }
            }

            if (column.type === "bool") {
                if (value) {
                    return "Yes";
                } else {
                    return "No";
                }
            }

            if (column.type === "select") {
                if (column.possibleValues.hasOwnProperty(value)) {
                    return column.possibleValues[value];
                }

                return value;
            }

            if (column.type === "nullableint") {
                if (value === null) {
                    return "";
                }

                return value;
            }

            if (column.type === "nullablebool") {
                if (value === null) {
                    return "Unknown";
                }

                return value;
            }

            if (column.type === "country") {
                return dsmx.model.codeContract.country.getValue(value);
            }

            if (column.type === "language") {
                return dsmx.model.codeContract.language.getValue(value);
            }

            if (column.type === "mailAddress") {
                return dsmx.model.codeContract.mailAddress.getValue(value);
            }

            if (column.type === "pictureUrl") {
                return dsmx.model.codeContract.pictureUrl.getValue(value);
            }
        }

        return value;
    };

    dsmx.model.getDisplayValue = function (column, model) {
        var value;

        var getValue = function (record, columnName) {
            if (record.hasOwnProperty(columnName)) {
                return record[columnName];
            } else {
                var lowerColumnName = columnName.toLowerCase();

                for (var property in record) {
                    if (record.hasOwnProperty(property) && lowerColumnName == property.toLowerCase()) {
                        return record[property];
                    }
                }

                return "";
            }
        }

        var getBoolValue = function (value) {
            if (value) {
                if (value === true) {
                    return "Yes";
                } else {
                    var lowerCase = ("" + value).toLowerCase();

                    if (lowerCase == "1" || lowerCase == "true" || lowerCase == "yes" || lowerCase == "ja") {
                        return "Yes";
                    }
                }
            }

            return "No";
        };

        if (column && column.type && column.name) {
            if (column.type == "string") {
                value = getValue(model, column.name);

                if (value == null) {
                    return "";
                }

                return value;
            }

            if (column.type == "gender") {
                value = getValue(model, column.name);

                if (value == null) {
                    return "unknown";
                } else if (value) {
                    return "female";
                } else {
                    return "male";
                }
            }

            if (column.type == "bool") {
                return getBoolValue(getValue(model, column.name));
            }

            if (column.type == "select") {
                value = getValue(model, column.name);

                if (column.possibleValues.hasOwnProperty(value)) {
                    return column.possibleValues[value];
                }

                return value;
            }

            if (column.type == "nullableint") {
                value = getValue(model, column.name);

                if (value == null) {
                    return "";
                }

                return value;
            }

            if (column.type == "nullablebool") {
                value = getValue(model, column.name);

                if (value == null) {
                    return "Unknown";
                }

                return getBoolValue(value);
            }

            if (column.type == "country") {
                return dsmx.model.codeContract.country.getValue(getValue(model, column.name));

            }

            if (column.type == "language") {
                return dsmx.model.codeContract.language.getValue(getValue(model, column.name));

            }

            if (column.type == "mailAddress") {
                return dsmx.model.codeContract.mailAddress.getValue(getValue(model, column.name));

            }

            if (column.type == "pictureUrl") {
                return dsmx.model.codeContract.pictureUrl.getValue(getValue(model, column.name));
            }

            value = getValue(model, column.name);
        }

        return value;
    };

    dsmx.model.contact.columns = [
        {
            name: "dsm_CustomerId", displayName: "Id", type: "int", isEditable: false
        },
        {
            name: "lpLogin", displayName: "LpLogin", type: "string", isEditable: false
        },
        {
            name: "eMail", displayName: "E-Mail", type: "mailAddress", isEditable: true
        },
        {
            name: "salutation", displayName: "Salutation", type: "string", isEditable: true
        },
        {
            name: "firstName", displayName: "First Name", type: "string", isEditable: true
        },
        {
            name: "lastName", displayName: "Last Name", type: "string", isEditable: true
        },
        {
            name: "gender", displayName: "Gender", type: "gender", isEditable: true
        },
        {
            name: "birthday", displayName: "Birthday", type: "nullabledate", isEditable: true
        },
        {
            name: "renewalDate", displayName: "RenewalDate", type: "nullabledate", isEditable: true
        },
        {
            name: "companyName", displayName: "Company Name", type: "string", isEditable: true
        },
        {
            name: "companyEmployees", displayName: "Company Employees", type: "select", possibleValues: { "0": "Unknown", "1": "Micro (1 - 10)", "2": "Small (11 - 50)", "3": "Medium (51 - 250)", "4": "Large (251 - 1000)", "5": "Enterprise (>1000)" }, isEditable: true
        },
        {
            name: "country", displayName: "Country", type: "country", isEditable: true
        },
        {
            name: "language", displayName: "Language", type: "language", isEditable: true
        },
        {
            name: "phone", displayName: "Phone", type: "string", isEditable: true
        },
        {
            name: "mobilePhone", displayName: "MobilePhone", type: "string", isEditable: true
        },
        {
            name: "fax", displayName: "Fax", type: "string", isEditable: true
        },
        {
            name: "pictureUrl", displayName: "Picture Url", type: "pictureUrl", isEditable: true
        },
        {
            name: "street1", displayName: "Street1", type: "string", isEditable: true
        },
        {
            name: "street2", displayName: "Street2", type: "string", isEditable: true
        },
        {
            name: "zipCode", displayName: "ZipCode", type: "string", isEditable: true
        },
        {
            name: "city", displayName: "City", type: "string", isEditable: true
        },
        {
            name: "stateProvince", displayName: "StateProvince", type: "string", isEditable: true
        },
        {
            name: "state", displayName: "State", type: "select", possibleValues: { "0": "Unknown", "1": "Lead", "2": "Contact", "3": "Customer" }, isEditable: true
        },
        {
            name: "rating", displayName: "Rating", type: "select", possibleValues: { "0": "Cold", "1": "Warm", "2": "Hot" }, isEditable: true
        },
        {
            name: "preferredChannel", displayName: "Preferred Channel", type: "select", possibleValues: { "0": "None", "1": "Print", "2": "EMail", "3": "Phone", "4": "Sms" }, isEditable: true
        },
        {
            name: "optIn", displayName: "OptIn", type: "nullablebool", isEditable: true
        },
        {
            name: "optOut", displayName: "OptOut", type: "nullablebool", isEditable: true
        },
        {
            name: "doubleOptIn", displayName: "DoubleOptIn", type: "bool", isEditable: true
        },
        {
            name: "optInDate", displayName: "OptIn Date", type: "nullabledate", isEditable: true
        },
        {
            name: "optInSource", displayName: "OptIn Source", type: "string", isEditable: true
        },
        {
            name: "jobTitle", displayName: "Job Title", type: "string", isEditable: true
        },
        {
            name: "jobLevel", displayName: "Job Level", type: "nullableint", isEditable: true
        },
        {
            name: "jobCategory", displayName: "Job Category", type: "select", possibleValues: { "0": "Unknown", "1": "HumanResources", "2": "IT", "3": "R&D", "4": "Sales", "5": "Finance", "6": "Production", "7": "Logistic", "8": "Marketing", "9": "Management" }, isEditable: true
        },
        {
            name: "dsm_BatchId", displayName: "BatchId", type: "int", isEditable: false
        },
        {
            name: "ownerUserGroupId", displayName: "OwnerUserGroupId", type: "nullableint", isEditable: true
        },
        {
            name: "creationSource", displayName: "Creation Source", type: "select", possibleValues: { "0": "Unknown", "1": "Campaign Registration", "2": "Database Import" }, isEditable: true
        },
        {
            name: "internal1", displayName: "Internal1", type: "string", isEditable: true
        },
        {
            name: "internal2", displayName: "Internal2", type: "string", isEditable: true
        },
        {
            name: "internal3", displayName: "Internal3", type: "string", isEditable: true
        },
        {
            name: "createdOn", displayName: "Created On", type: "date", isEditable: false
        },
        { name: "lastUpdate", displayName: "Last Update", type: "date", isEditable: false }
    ];



    dsmx.model.contact.additionalColumns = [];

    dsmx.model.contact.getColumns = function () {
        var allColumns = [];
        var i;

        //add the main columns
        for (i = 0; i < dsmx.model.contact.columns.length; i += 1) {
            allColumns.push(dsmx.model.contact.columns[i]);
        }

        //add the additional columns
        for (i = 0; i < dsmx.model.contact.additionalColumns.length; i += 1) {
            allColumns.push(dsmx.model.contact.additionalColumns[i]);
        }

        return allColumns;
    };

    dsmx.model.contact.getColumn = function (name) {
        var currentColumn;
        var allColumns = dsmx.model.contact.getColumns();
        var i;

        for (i = 0; i < allColumns.length; i += 1) {
            currentColumn = allColumns[i];

            if (currentColumn.name === name) {
                return currentColumn;
            }
        }

        return null;
    };

    dsmx.model.contact.getColumnLowerCase = function (name) {
        var currentColumn;
        var allColumns = dsmx.model.contact.getColumns();
        var lower = name.toLowerCase();
        var i;

        for (i = 0; i < allColumns.length; i += 1) {
            currentColumn = allColumns[i];

            if (currentColumn.name.toLowerCase() === lower) {
                return currentColumn;
            }
        }

        return null;
    };

    dsmx.model.contact.getDisplayValue = dsmx.model.getDisplayValue;
    dsmx.model.contact.getPrimaryColumName = function () {
        return "dsm_CustomerId";
    };

    dsmx.model.contact.getValue = function (column, model) {
        return model[column.name];
    };

    dsmx.model.contact.saveValue = function (column, model, newValue, saveFinishedCallBack) {
        var originalValue = model[column.name];
        var updateModel = {
            customerId: model["dsm_CustomerId"], fieldName: column.name, value: newValue
        };

        model[column.name] = newValue;

        dsmx.api.contacts.updateField(updateModel, function (result) {
            if (result.state != 0) {
                model[column.name] = originalValue;
                alert("Failed to save contact: [" + result.failureDetail + "]" + result.failureMessage);
                saveFinishedCallBack();
            } else {
                saveFinishedCallBack();
            }
        }, function (result) {
            alert("Failed to save contact."); saveFinishedCallBack();
        });
    };

    dsmx.model.contact.insert = function (record, successCallBack, failedCallBack) {
        dsmx.api.contacts.insert(record, successCallBack, failedCallBack);
    };

    dsmx.model.contact.update = function (record, successCallBack, failedCallBack) {
        dsmx.api.contacts.update(record, successCallBack, failedCallBack);
    };

    dsmx.model.contact.deleteRecords = function (records, deleteFinishedCallBack) {
        if (typeof records != "undefined" && records != null && Object.prototype.toString.call(records) === "[object Array]" && records.length > 0) {
            var ids = [];
            var i;

            for (i = 0; i < records.length; i += 1) {
                ids.push(records[i].dsm_CustomerId);
            }

            dsmx.api.contacts.delete(ids, function (result) {
                var getRecordWithId = function (id) {
                    var n;

                    for (n = 0; n < records.length; n += 1) {
                        if (records[n].id == id) {
                            return records[n];
                        }
                    }

                    return null;
                };

                var notDeletedRecords = [];
                var n;
                var record;

                for (n = 0; n < result.responseObject.length; n += 1) {
                    record = getRecordWithId(result.responseObject[n]);

                    if (record != null) {
                        notDeletedRecords.push(record);
                    }
                }

                deleteFinishedCallBack(notDeletedRecords);

                if (result.state != 0) {
                    alert("Unable to delete records: " + result.failureMessage);
                }
            }, function () {
                deleteFinishedCallBack(ids); alert("Unable to delete records.");
            });
        }
    };

    dsmx.model.contact.create = function () {
        var r = {
        };

        r.dsm_CustomerId = 0;
        r.dsm_BatchId = 2;
        r.lpLogin = "";
        r.ownerUserGroupId = null;
        r.salutation = null;
        r.firstName = null;
        r.lastName = null;
        r.gender = null;
        r.birthday = null;
        r.country = null;
        r.language = null;
        r.eMail = null;
        r.phone = null;
        r.mobilePhone = null;
        r.fax = null;
        r.pictureUrl = null;
        r.street1 = null;
        r.street2 = null;
        r.zipCode = null;
        r.city = null;
        r.stateProvince = null;
        r.state = 0;
        r.rating = 0;
        r.preferredChannel = 0;
        r.optIn = null;
        r.optOut = null;
        r.doubleOptIn = false;
        r.optInDate = null;
        r.optInSource = null;
        r.renewalDate = null;
        r.companyName = null;
        r.companyEmployees = 0;
        r.jobTitle = null;
        r.jobLevel = null;
        r.jobCategory = 0;
        r.creationSource = 0;
        r.internal1 = null;
        r.internal2 = null;
        r.internal3 = null;

        return r;
    };

    dsmx.model.api.createAccount.columns = [
        {
            name: "accountName", displayName: "Account Name", type: "string", isEditable: true
        },
        {
            name: "password", displayName: "Password", type: "string", isEditable: true
        },
        {
            name: "description", displayName: "Description", type: "string", isEditable: true
        },
        {
            name: "maxUsers", displayName: "Max Users", type: "int", isEditable: true
        },
        {
            name: "salutation", displayName: "Salutation", type: "string", isEditable: true
        },
        {
            name: "firstName", displayName: "First Name", type: "string", isEditable: true
        },
        {
            name: "lastName", displayName: "Last Name", type: "string", isEditable: true
        },
        {
            name: "eMail", displayName: "E-Mail", type: "mailAddress", isEditable: true
        },
        {
            name: "gender", displayName: "Gender", type: "gender", isEditable: true
        },
        {
            name: "companyName", displayName: "Company Name", type: "string", isEditable: true
        },
        {
            name: "onHoldCallbackUrl", displayName: "OnHold Callback Url", type: "string", isEditable: true
        },
        {
            name: "additionalOptionsJson", displayName: "Additional Options Json", type: "string", isEditable: true
        },
        { name: "lpLoginMode", displayName: "LpLogin Mode", type: "select", possibleValues: { "0": "Default", "2": "Randomize", "3": "Secure Hash", "4": "Columns Plus Random Number" }, isEditable: true }
    ];

    dsmx.model.api.createAccount.getDisplayValue = dsmx.model.getDisplayValue;

    dsmx.model.api.createAccount.create = function () {
        var r = {
        };

        r.accountName = null;
        r.password = null;
        r.description = null;
        r.maxUsers = 10;
        r.salutation = null;
        r.firstName = null;
        r.lastName = null;
        r.gender = null;
        r.eMail = null;
        r.companyName = null;
        r.onHoldCallbackUrl = null;
        r.additionalOptionsJson = null;
        r.lpLoginMode = 0;

        return r;
    };

    dsmx.model.api.query.orderModeE = {
        ascending: 0,
        descending: 1
    };

    dsmx.model.api.query.comparerE = {
        equals: 0,
        equalsNot: 1,
        startsWith: 2,
        endsWith: 3,
        contains: 4,
        greaterThan: 5,
        lowerThan: 6,
        greaterThanOrEquals: 7,
        lowerThanOrEquals: 8
    };

    dsmx.model.api.query.comparerToDisplay = function (comparer) {
        var comparers = dsmx.model.api.query.comparerE;

        switch (comparer) {
            case comparers.equals:
                return "Equals";

            case comparers.equalsNot:
                return "Equals Not";

            case comparers.startsWith:
                return "Starts With";

            case comparers.endsWith:
                return "Ends With";

            case comparers.contains:
                return "Contains";

            case comparers.greaterThan:
                return "Is Greater Than";

            case comparers.greaterThanOrEquals:
                return "Is Greater Than Or Equals";

            case comparers.lowerThan:
                return "Is Lower Than";

            case comparers.lowerThanOrEquals:
                return "Is Lower Than Or Equals";

        }

        throw "Invalid comparer.";
    };

    dsmx.model.api.query.logicComparerE = {
        and: 0,
        or: 1
    };

    dsmx.model.api.query.createEmpty = function () {
        var r = {
        };

        r.size = 50;
        r.start = 0;
        r.columns = [];
        r.orders = [];
        r.wheres = [];

        return r;
    };

    dsmx.model.api.query.createStandard = function () {
        var r = {
        };

        r.size = 50;
        r.start = 0;
        r.columns = [
            { columnName: "*" }
        ];
        r.orders = [
            { columnName: "dsm_CustomerID", orderMode: dsmx.model.api.query.orderModeE.ascending }
        ];
        r.wheres = [];

        return r;
    };

    dsmx.model.api.query.createWithOrderColumns = function (orders) {
        var r = {
        };

        r.size = 50;
        r.start = 0;
        r.columns = [
            { columnName: "*" }
        ];
        r.wheres = [];
        r.orders = orders;

        return r;
    };

    dsmx.model.api.query.where = {
        predefinedE: {
            registered: 10,
            visitor: 11,
            submitter: 12,
            mailReceiver: 13,
            smsReceiver: 14,
            campaignCompleter: 15,
            responder: 16,
            databaseImport: 17,
            renewalDueNextMonth: 18,
            unsubscriber: 19,
            bounced: 20,
            registeredCampaign: 1010,
            visitorCampaign: 1011,
            submitterCampaign: 1012,
            mailReceiverCampaign: 1013,
            smsReceiverCampaign: 1014,
            campaignCompleterCampaign: 1015,
            responderCampaign: 1016
        },
        predefinedAsText: function (predefined) {
            var pre = dsmx.model.api.query.where.predefinedE;

            if (predefined === pre.registered) {
                return "Registered within any campaign.";

            } else if (predefined === pre.visitor) {
                return "Visited any campaign.";

            } else if (predefined === pre.submitter) {
                return "Submitted on any campaign.";

            } else if (predefined === pre.mailReceiver) {
                return "Received an e-mail from any campaign.";

            } else if (predefined === pre.smsReceiver) {
                return "Received an sms from any campaign.";

            } else if (predefined === pre.campaignCompleter) {
                return "Completed any campaign.";

            } else if (predefined === pre.responder) {
                return "Responded to any campaign.";

            } else if (predefined === pre.databaseImport) {
                return "Part of database import.";

            } else if (predefined === pre.renewalDueNextMonth) {
                return "Renewal due next month.";

            } else if (predefined === pre.unsubscriber) {
                return "Unsubscriber.";

            } else if (predefined === pre.bounced) {
                return "Bounced on any e-mailing.";


            } else if (predefined === 1010) {
                return "Registered within campaign.";

            } else if (predefined === 1011) {
                return "Visited campaign.";

            } else if (predefined === 1012) {
                return "Submitted on campaign.";

            } else if (predefined === 1013) {
                return "Received an e-mail from campaign.";

            } else if (predefined === 1014) {
                return "Received an sms from campaign.";

            } else if (predefined === 1015) {
                return "Completed campaign.";

            } else if (predefined === 1016) {
                return "Responded to campaign.";
            }

            return "Unknown predefined filter.";
        },
        create: function () {
            var r = {
            };

            r.columnName = "firstName";
            r.comparer = dsmx.model.api.query.comparerE.equals;
            r.logicComparer = dsmx.model.api.query.logicComparerE.and;
            r.predefined = 0;
            r.value = "";

            return r;
        }
    };

    dsmx.model.codeContract.language.create = function () {
        var r = {
        };

        r.nativeName = null;
        r.englishName = null;
        r.name = null;
        r.alpha2 = null;
        r.alpha3 = null;
        r.value = "";
        r.isEmpty = true;
        r.isValid = false;

        return r;
    };

    dsmx.model.codeContract.language.getValue = function (language) {
        if (typeof language == "string") {
            return language;
        }

        if (language) {
            if (language.isValid) {
                return language[dsmx.settings.preferredLanguageProperty];
            } else if (language.value) {
                return language.value;
            }
        }

        return "";
    };

    dsmx.model.codeContract.country.create = function () {
        var r = {
        };

        r.englishName = null;
        r.number = 0;
        r.alpha2 = null;
        r.alpha3 = null;
        r.value = "";
        r.isEmpty = true;
        r.isValid = false;

        return r;
    };

    dsmx.model.codeContract.country.getValue = function (country) {
        if (typeof country == "string") {
            return country;
        }

        if (country) {
            if (country.isValid) {
                return country[dsmx.settings.preferredCountryProperty];
            } else if (country.value) {
                return country.value;
            }
        }

        return "";
    };

    dsmx.model.codeContract.mailAddress.errorE = {
        none: 0,
        noAtSign: 1,
        tooManyAtSigns: 2,
        noLocalPart: 3,
        noDomainPart: 4
    };

    dsmx.model.codeContract.mailAddress.create = function () {
        var r = {
        };

        r.localPart = null;
        r.domainPart = null;
        r.errorType = dsmx.model.codeContract.mailAddress.errorE.none;
        r.value = "";
        r.isEmpty = true;
        r.isValid = false;

        return r;
    };

    dsmx.model.codeContract.mailAddress.getValue = function (mailAddress) {
        if (mailAddress) {
            if (typeof mailAddress === "string") {
                return mailAddress;
            } else if (typeof mailAddress.value != "undefined") {
                return mailAddress.value;
            }
        }

        return "";
    };

    dsmx.model.codeContract.pictureUrl.getValue = function (pictureUrl) {
        if (pictureUrl) {
            if (typeof pictureUrl.url !== "undefined") {
                if (pictureUrl.url) { //gibt es, aber keinen wert vorhanden
                    return pictureUrl.url;
                }

                return "";
            }

            return pictureUrl;
        }

        return "";
    };


    dsmx.model.api.importFromUrl.columns = [
        {
            name: "url", displayName: "Url", type: "string", isEditable: true
        },
        { name: "batchName", displayName: "Batch Name", type: "string", isEditable: true }
    ];

    dsmx.model.api.importFromUrl.getDisplayValue = dsmx.model.getDisplayValue;

    dsmx.model.api.importFromUrl.create = function () {
        var r = {
        };

        r.url = null;
        r.batchName = null;

        return r;
    };

    dsmx.model.api.importFromUrl.errorE = {
        urlEmpty: 1,
        invalidProtocol: 2,
        invalidExtension: 3
    };

    dsmx.model.api.importFromUrl.assert = function (model) {
        if (model.Url == null) {
            throw dsmx.model.api.importFromUrl.errorE.urlEmpty;
        }

        if (model.Url.match(/^(http|https|ftp):\/\//) == null) {
            throw dsmx.model.api.importFromUrl.errorE.invalidProtocol;
        }

        if (model.Url.match(/\.csv$/) == null) {
            throw dsmx.model.api.importFromUrl.errorE.invalidExtension;
        }
    };

    dsmx.model.api.importFromUrl.errorE.translate = function (errorE) {
        switch (errorE) {
            case dsmx.model.api.importFromUrl.errorE.urlEmpty:
                return "Please provide an url where to download the database file.";

            case dsmx.model.api.importFromUrl.errorE.invalidProtocol:
                return "Please specifiy the protocol (http, https, ftp).";

            case dsmx.model.api.importFromUrl.errorE.invalidExtension:
                return "Only csv files are supported right now. Please save the database file as csv.";

            default:
                return "Unknown error. Please contact the support.";
        }
    };


    dsmx.model.api.importStatus.stateE = {
        queued: 0,
        running: 1,
        completed: 2
    };

    dsmx.model.api.importStatus.stateE.translate = function (code) {
        switch (code) {
            case dsmx.model.api.importStatus.stateE.queued:
                return "Import request is queued. Waiting to start the import.";

            case dsmx.model.api.importStatus.stateE.running:
                return "Import is running. Waiting for completion.";

            case dsmx.model.api.importStatus.stateE.completed:
                return "Import is completed.";

            default:
                return "Unknown state. Please contact the support.";
        }
    };

    dsmx.model.api.importStatus.progressDetailE = {
        none: 0,
        downloadingFile: 1,
        readingContacts: 2,
        importingContacts: 3
    };

    dsmx.model.api.importStatus.progressDetailE.translate = function (code) {
        switch (code) {
            case dsmx.model.api.importStatus.progressDetailE.none:
                return "Preparing import job.";

            case dsmx.model.api.importStatus.progressDetailE.downloadingFile:
                return "Downloading data file.";

            case dsmx.model.api.importStatus.progressDetailE.readingContacts:
                return "Reading contacts from data file.";

            case dsmx.model.api.importStatus.progressDetailE.importingContacts:
                return "Importing contacts.";

            default:
                return "Unknown progress. Please contact the support.";
        }
    };

    dsmx.model.api.importStatus.errorE = {
        none: 0,
        unknown: 1,
        couldNotFindStatus: 2,
        couldNotDownloadFile: 3,
        couldNotImportContacts: 4,
        couldNotLoadStatus: 5
    };

    dsmx.model.api.importStatus.errorE.translate = function (code, errorDetails) {
        switch (code) {
            case dsmx.model.api.importStatus.stateE.none:
                return "No error. All fine.";

            case dsmx.model.api.importStatus.stateE.unknown:
                return "Unknown error. Please contact the support.";

            case dsmx.model.api.importStatus.stateE.couldNotFindStatus:
                return "Could not find any status information about this import request. Please try again or contact the support.";

            case dsmx.model.api.importStatus.stateE.couldNotDownloadFile:
                return dsmx.algorithm.arrayReplace("Could not download the data file: {0}", [errorDetails]);

            case dsmx.model.api.importStatus.stateE.couldNotImportContacts:
                return dsmx.algorithm.arrayReplace("Could not import contacts: {0}", [errorDetails]);

            case dsmx.model.api.importStatus.stateE.couldNotLoadStatus:
                return "Could not load the status.";

            default:
                return "Unknown error. Please contact the support.";
        }
    };

    dsmx.model.api.importStatus.create = function () {
        var r = {
        };

        r.state = dsmx.model.api.importStatus.stateE.queued;
        r.progressDetail = dsmx.model.api.importStatus.progressDetailE.none;
        r.errorCode = dsmx.model.api.importStatus.errorE.none;
        r.max = 0;
        r.current = 0;
        r.errorDetails = [];

        return r;
    };


    dsmx.model.api.import.create = function () {
        var r = {
        };

        r.batchName = null;
        r.contacts = [];

        return r;
    };

    dsmx.model.api.campaignTemplate = {
        columns: [
            {
                name: "id", displayName: "Id", type: "int", isEditable: false
            },
            {
                name: "name", displayName: "Name", type: "string", isEditable: false
            },
            {
                name: "displayName", displayName: "Display Name", type: "string", isEditable: true
            },
            {
                name: "description", displayName: "Description", type: "string", isEditable: true
            },
            {
                name: "campaignImage", displayName: "Campaign Image", type: "pictureUrl", isEditable: true
            },
            {
                name: "random", displayName: "Random Key", type: "string", isEditable: false
            },
            { name: "isApproved", displayName: "Is Approved", type: "bool", isEditable: true }
        ],
        getDisplayValue: dsmx.model.getDisplayValue,
        getValue: dsmx.model.getDisplayValue,
        saveValue: function (column, model, newValue, saveFinishedCallBack) {
            var oldValue = model[column.name];
            model[column.name] = newValue;

            dsmx.api.campaignTemplates.update(model,
                function (response) {
                    if (response.state !== 0) {
                        model[column.name] = oldValue;
                        alert("Could not save value.");
                    }

                    saveFinishedCallBack();
                },
                function (response) {
                    model[column.name] = oldValue;
                    alert("Could not save value.");
                    saveFinishedCallBack();
                });
        }

    };



    dsmx.model.api.campaignTemplates.category = {
    };

    dsmx.model.api.campaignTemplates.category = [
        {
            name: "id", displayName: "Id", type: "int", isEditable: false
        },
        { name: "name", displayName: "Category", type: "string", isEditable: true }
    ];

    dsmx.model.api.campaignTemplates.category.create = function () {
        var r = {
        };

        r.id = 0;
        r.name = null;

        return r;
    };

    dsmx.model.api.campaignTemplates.connectTemplateToCategory = {
    };

    dsmx.model.api.campaignTemplates.connectTemplateToCategory.create = function () {
        var r = {
        };

        r.campaignTemplateId = 0;
        r.categoryId = 0;

        return r;
    };


    dsmx.model.api.campaignTemplates.outboundChannel = {
    };

    dsmx.model.api.campaignTemplates.outboundChannel = [
        {
            name: "id", displayName: "Id", type: "int", isEditable: false
        },
        { name: "name", displayName: "Outbound Channel", type: "string", isEditable: true }
    ];

    dsmx.model.api.campaignTemplates.outboundChannel.create = function () {
        var r = {
        };

        r.id = 0;
        r.name = null;

        return r;
    };

    dsmx.model.api.campaignTemplates.connectTemplateToOutboundChannel = {
    };

    dsmx.model.api.campaignTemplates.connectTemplateToOutboundChannel.create = function () {
        var r = {
        };

        r.campaignTemplateId = 0;
        r.outboundChannelId = 0;

        return r;
    };


    dsmx.model.api.campaignTemplates.targetAudience = {
    };

    dsmx.model.api.campaignTemplates.targetAudience = [
        {
            name: "id", displayName: "Id", type: "int", isEditable: false
        },
        { name: "name", displayName: "Target Audience", type: "string", isEditable: true }
    ];

    dsmx.model.api.campaignTemplates.targetAudience.create = function () {
        var r = {
        };

        r.id = 0;
        r.name = null;

        return r;
    };

    dsmx.model.api.campaignTemplates.connectTemplateToTargetAudience = {
    };

    dsmx.model.api.campaignTemplates.connectTemplateToTargetAudience.create = function () {
        var r = {
        };

        r.campaignTemplateId = 0;
        r.targetAudienceId = 0;

        return r;
    };

    // START campaign template import

    dsmx.model.api.campaignTemplates.importStatus = {
        stateE: {
            queued: 0,
            running: 1,
            completed: 2
        },
        progressDetailE: {
            none: 0,
            extractingFile: 1,
            extractedFile: 2,
            extractingCampaignInformation: 3,
            insertingCampaignTemplate: 4,
            readingInfoBin: 5,
            readInfoBin: 6,
            checkingFileSystemForCampaignTemplate: 7,
            movingCampaignTemplateFiles: 8
        },
        errorE: {
            none: 0,
            unknown: 1,
            couldNotFindStatus: 2,
            couldNotLoadStatus: 3,
            couldNotCreateTemporaryDirectory: 4,
            couldNotExtractTemplateZipFile: 5,
            couldNotFindInfoBin: 6,
            couldNotCheckForInfoBin: 7,
            couldNotReadInfoBin: 8,
            needUserInputOverwriteOrCreateNew: 9,
            couldNotCheckDirectoryExistence: 10,
            couldNotMoveDirectory: 11,
            couldNotStoreTemplateInformation: 12

        },
        toMessage: function (responseObject) {
            var s = dsmx.model.api.campaignTemplates.importStatus;
            var format = dsmx.algorithm.arrayReplace;

            if (responseObject.state === s.stateE.queued) {
                return "Queued. Waiting to start.";
            } else {
                if (responseObject.errorCode === s.errorE.none) {
                    if (responseObject.progressDetail === s.progressDetailE.none) {
                        return "Import started.";

                    } else if (responseObject.progressDetail === s.progressDetailE.extractingFile) {
                        return "Extracting zip file.";

                    } else if (responseObject.progressDetail === s.progressDetailE.extractedFile) {
                        return "Extracted zip file.";

                    } else if (responseObject.progressDetail === s.progressDetailE.extractingCampaignInformation) {
                        return "Extracting campaign information.";

                    } else if (responseObject.progressDetail === s.progressDetailE.insertingCampaignTemplate) {
                        return "Inserting campaign template.";

                    } else if (responseObject.progressDetail === s.progressDetailE.readingInfoBin) {
                        return "Reading info.bin file.";

                    } else if (responseObject.progressDetail === s.progressDetailE.readInfoBin) {
                        return "loaded info.bin file.";

                    } else if (responseObject.progressDetail === s.progressDetailE.checkingFileSystemForCampaignTemplate) {
                        return "Checking for existing campaign template.";

                    } else if (responseObject.progressDetail === s.progressDetailE.movingCampaignTemplateFiles) {
                        return "Processing campaign template files.";
                    } else {
                        return "progress: " + responseObject.progressDetail;
                    }
                } else { //got error
                    if (responseObject.errorCode === s.errorE.unknown) {
                        return "Unknown error occurred";

                    } else if (responseObject.errorCode === s.errorE.couldNotFindStatus) {
                        return "Could not find status. Please try to upload again.";

                    } else if (responseObject.errorCode === s.errorE.couldNotLoadStatus) {
                        return format("Could not get import status: {0}", responseObject.errorDetails);

                    } else if (responseObject.errorCode === s.errorE.couldNotCreateTemporaryDirectory) {
                        return format("Could not create temporary directory: {0}", responseObject.errorDetails);

                    } else if (responseObject.errorCode === s.errorE.couldNotExtractTemplateZipFile) {
                        return format("Could not extract zip file: {0}", responseObject.errorDetails);

                    } else if (responseObject.errorCode === s.errorE.couldNotFindInfoBin) {
                        return "Could not find info.bin file. Maybe this is not a campaign template.";

                    } else if (responseObject.errorCode === s.errorE.couldNotCheckForInfoBin) {
                        return format("Could not check for info.bin existence: {0}", responseObject.errorDetails);

                    } else if (responseObject.errorCode === s.errorE.couldNotReadInfoBin) {
                        return format("Could not read info.bin file: {0}", responseObject.errorDetails);

                    } else if (responseObject.errorCode === s.errorE.couldNotCheckDirectoryExistence) {
                        return format("Could not check directory existence: {0}", responseObject.errorDetails);

                    } else if (responseObject.errorCode === s.errorE.couldNotMoveDirectory) {
                        return format("Could not check directory existence: {0}", responseObject.errorDetails);

                    } else if (responseObject.errorCode === s.errorE.couldNotStoreTemplateInformation) {
                        return format("Could not save template information: {0}", responseObject.errorDetails);

                    } else if (responseObject.errorCode === s.errorE.couldNotLoadCampaignTemplateXmlFile) {
                        return format("Could not load campaign template xml file: {0}", responseObject.errorDetails);
                    } else {
                        return "error: " + responseObject.errorCode;
                    }
                }
            }
        }
    };


    dsmx.model.api.campaignTemplates.decision.getDisplayValue = dsmx.model.getDisplayValue;

    dsmx.model.api.campaignTemplates.decision.columns = [
        {
            name: "importId", displayName: "Import Id", type: "string", isEditable: false
        },
        {
            name: "overwrite", displayName: "Overwrite", type: "bool", isEditable: true
        },
        {
            name: "newName", displayName: "New Name", type: "string", isEditable: true
        }];

    dsmx.model.api.campaignTemplates.decision.create = function () {
        var r = {
        };

        r.importId = null;
        r.overwrite = false;
        r.newName = null;

        return r;
    };

    // END campaign template import


    /* Start Document Templates */
    dsmx.model.api.documentTemplate = {
        columns: [
            {
                name: "id", displayName: "Id", type: "int", isEditable: false
            },
            {
                name: "name", displayName: "Name", type: "string", isEditable: false
            },
            {
                name: "displayName", displayName: "Display Name", type: "string", isEditable: true
            },
            {
                name: "placeholderName", displayName: "Placeholder Name", type: "string", isEditable: false
            },
            {
                name: "sourceCampaignName", displayName: "Source Campaign Name", type: "string", isEditable: false
            },
            {
                name: "description", displayName: "Description", type: "string", isEditable: true
            },
            {
                name: "pageCount", displayName: "Page Count", type: "int", isEditable: false
            },
            {
                name: "dimensionX", displayName: "Dimension X", type: "string", isEditable: false
            },
            {
                name: "dimensionY", displayName: "Dimension Y", type: "string", isEditable: false
            },
            {
                name: "isApproved", displayName: "Is Approved", type: "bool", isEditable: true
            },
            { name: "lastUpdate", displayName: "Last Update", type: "date", isEditable: false }
        ],
        getDisplayValue: dsmx.model.getDisplayValue,
        getValue: dsmx.model.getDisplayValue,
        saveValue: function (column, model, newValue, saveFinishedCallBack) {
            var oldValue = model[column.name];
            model[column.name] = newValue;

            dsmx.api.documentTemplates.update(model,
                function (response) {
                    if (response.state !== 0) {
                        model[column.name] = oldValue;
                        alert("Could not save value.");
                    }

                    saveFinishedCallBack();
                },
                function (response) {
                    model[column.name] = oldValue;
                    alert("Could not save value.");
                    saveFinishedCallBack();
                });
        }

    };

    /* End Document Templates */


    dsmx.model.api.campaigns = {
        createCampaign: {
            columns: [
                {
                    name: "campaignTemplateId", displayName: "Campaign Template Id", type: "int", isEditable: true
                },
                {
                    name: "campaignName", displayName: "Campaign Name", type: "string", isEditable: true
                },
                {
                    name: "campaignDisplayName", displayName: "Campaign Display Name", type: "string", isEditable: true
                },
                { name: "campaignFilterName", displayName: "Campaign Filter Name", type: "string", isEditable: true }
            ],
            create: function () {
                var r = {
                };

                r.campaignTemplateId = 0;
                r.campaignName = null;
                r.campaignDisplayName = null;
                r.campaignFilterName = null;

                return r;
            },
            getDisplayValue: dsmx.model.getDisplayValue,
            messageE: {
                started: 0,
                unzipping: 1,
                checkingForValidExport: 2,
                readingInfo: 3,
                checkingForConflicts: 4,
                readingDatabases: 5,
                copyingAccountResources: 6,
                copyingSystemResources: 7,
                checkingInAccountResources: 8,
                checkingInSystemResources: 9,
                importingDatabases: 10,
                copyingDesigns: 11,
                adjustingDesignProperties: 12,
                waitingForCheckinCompletion: 13,
                writingjQueryThemes: 14,
                importingSets: 15,

                finished: 19,

                unknownException: 20,
                couldNotUnzipFile: 21,
                infoFileMissing: 22,
                databaseFileMissing: 23,
                couldNotCheckinFile: 24,
                couldNotReadInfo: 25,
                destinationNameEmpty: 26,
                destinationNameAlreadyTaken: 27,
                destinationNameOkButDesignAlreadyTaken: 28,
                sourceCampaignInfoNotFound: 29,
                invalidCampaignName: 30
            },
            convertMessageToText: function (message, messageDetail) {
                var format = dsmx.algorithm.arrayReplace;
                var messageE = dsmx.model.api.campaigns.createCampaign.messageE;

                if (message === messageE.started) {
                    return "Started.";

                } else if (message === messageE.unzipping) {
                    return "Extracting archive file.";

                } else if (message === messageE.checkingForValidExport) {
                    return "Checking for valid export file.";

                } else if (message === messageE.readingInfo) {
                    return "Reading database information file.";

                } else if (message === messageE.checkingForConflicts) {
                    return "Checking for file conflicts.";

                } else if (message === messageE.readingDatabases) {
                    return "Reading databases.";

                } else if (message === messageE.copyingAccountResources) {
                    return "Copying account resources.";

                } else if (message === messageE.copyingSystemResources) {
                    return "Copying system resources.";

                } else if (message === messageE.checkingInAccountResources) {
                    return "Registering system resources.";

                } else if (message === messageE.checkingInSystemResources) {
                    return "Registering account resources.";

                } else if (message === messageE.importingDatabases) {
                    return "Importing database files.";

                } else if (message === messageE.copyingDesigns) {
                    return "Copying designs.";

                } else if (message === messageE.adjustingDesignProperties) {
                    return "Rewriting design specific properties.";

                } else if (message === messageE.writingjQueryThemes) {
                    return "Writing jQuery themes.";

                } else if (message === messageE.waitingForCheckinCompletion) {
                    return format("Waiting for resource checkins: {0}%", [messageDetail]);

                } else if (message === messageE.importingSets) {
                    return format("Importing sets: {0}%", [messageDetail]);

                } else if (message === messageE.finished) {
                    return "Completed.";

                } else if (message === messageE.unknownException) {
                    return format("Unkown exception: {0}", [messageDetail]);

                } else if (message === messageE.couldNotUnzipFile) {
                    return format("Could not unzip file. Exception: {0}", [messageDetail]);

                } else if (message === messageE.infoFileMissing) {
                    return "Could not find info file. Maybe this is not a valid template.";

                } else if (message === messageE.databaseFileMissing) {
                    return "Could not find database file. Maybe this is not a valid template.";

                } else if (message === messageE.couldNotCheckinFile) {
                    return format("Could not register file '{0}'.", [messageDetail]);

                } else if (message === messageE.couldNotReadInfo) {
                    return "Could not read info file. Please contact the support.";

                } else if (message === messageE.destinationNameEmpty) {
                    return "Please set a valid campaign name. You cannot use an empty value.";

                } else if (message === messageE.destinationNameAlreadyTaken) {
                    return format("The campaign name '{0}' is already taken. Please choose another name.", [messageDetail]);

                } else if (message === messageE.destinationNameOkButDesignAlreadyTaken) {
                    return format("The design name '{0}' is already taken. Please choose another name.", [messageDetail]);

                } else if (message === messageE.sourceCampaignInfoNotFound) {
                    return "Could not find source campaign name. Please contact the support.";

                } else if (message === messageE.invalidCampaignName) {
                    return format("The campaign name '{0}' contains invalid characters (like spaces or special signs). Please choose another one.", [messageDetail]);
                } else {
                    return "Unknown message: " + message;
                }
            }
        },
        automatedTask: {
            activityTypeE: {
                mail: 0,
                document: 1,
                sms: 2,
                writeToDatabase: 3,
                pageVisit: 4,
                databaseExport: 5
            },
            audienceE: {
                all: 0,
                responder: 1,
                nonResponder: 2
            },
            exportEventE: {
                exported: 0,
                printed: 1,
                shipped: 2
            }
        },
        campaignMedia: {
            mediaTypeE: {
                unknown: 0,
                purl: 1,
                personalPage: 2,
                mail: 3,
                document: 4,
                sms: 5,
                staticPage: 6,
                staticHomePage: 7,
                mobileWebPage: 8,
                mobileHomePage: 9,
                mobilePersonalPage: 10,
                mobilePURL: 11,
                dashBoard: 12
            }
        },
        campaignAdditionalMedia: {
            additionalTypeE: {
                unknown: 0,
                image: 1,
                text: 2,
                purlLink: 3,
                database: 4,
                sms: 5,
                qrCode: 6
            }
        }
    };

    dsmx.api.failOrThrow = function (failCallback, errorMessage) {
        if (failCallback) {
            failCallback({
                statusText: errorMessage
            });

            return true;
        }

        throw errorMessage;
    };

    dsmx.api.isNotInteger = function (value, errorMessage, failCallback) {
        if (!dsmx.api.isInteger(value)) {
            return dsmx.api.failOrThrow(failCallback, errorMessage);
        }
    };

    dsmx.api.isNotSet = function (value, errorMessage, failCallback) {
        if (!value) {
            return dsmx.api.failOrThrow(failCallback, errorMessage);
        }
    };

    dsmx.api.isNotDefined = function (value, errorMessage, failCallback) {
        if (!dsmx.api.isDefined(value)) {
            return dsmx.api.failOrThrow(failCallback, errorMessage);
        }
    };

    dsmx.api.isNotArray = function (value, errorMessage, failCallback) {
        if (!dsmx.api.isArray(value)) {
            return dsmx.api.failOrThrow(failCallback, errorMessage);
        }
    };

    dsmx.api.isNotValidAccountId = function (value, errorMessage, failCallback) {
        if (value + 0 <= 0) {
            return dsmx.api.failOrThrow(failCallback, errorMessage);
        }
    };

    // hier muss ich definitiv zurückgeben, ob ich gethrowd habe oder nicht
    dsmx.api.handleError = function (params, errorMessage) {
        if (params.failCallback) {
            params.failCallback({
                statusText: errorMessage
            });

            return true;
        } else {
            throw errorMessage;
        }
    };

    dsmx.api.handleValidationError = function (params) {
        if (params.failCallback) {
            params.failCallback({
                statusText: params.errorMessage
            });
        } else {
            throw params.errorMessage;
        }
    };

    dsmx.api.assertDoneCallback = function (params) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.doneCallback) {
            return dsmx.api.handleError(params, "No 'doneCallback' parameter provided.");
        }

        return false;
    };

    dsmx.api.isArray = function (obj) {
        if (Array.isArray) {
            return Array.isArray(obj);
        } else {
            return Object.prototype.toString.call(obj) === "[object Array]";
        }
    };

    dsmx.api.isDefined = function (obj) {
        return typeof obj != "undefined";
    };

    dsmx.api.isInteger = function (obj) {
        if (isNaN(obj)) {
            return false;
        }

        var x = parseFloat(obj);

        return (x | 0) === x;
    };



    dsmx.api.campaigns = {
        deleteEventsModeE: {
            none: 0,
            all: 1,
            allButContactsDatabase: 2
        },
        e: {
        },
        internal: {
            getCreateStatusUntilFinalState: function () {
                dsmx.api.campaigns.getCreateStatus(dsmx.api.internal.params, function (response) {
                    var params = dsmx.api.internal.params;
                    var convertMessageToText = dsmx.model.api.campaigns.createCampaign.convertMessageToText;

                    if (response.state == 0) {
                        if (response.responseObject.state === 2) { //finished
                            if (params.doneCallback) {
                                params.doneCallback(response);
                            }
                        } else if (response.responseObject.state === 3) { //failed
                            if (params.failCallback) {
                                params.failCallback({
                                    statusText: convertMessageToText(response.responseObject.message, response.responseObject.messageDetail)
                                });
                            }
                        } else {
                            if (params.updateCallback) {
                                params.updateCallback(convertMessageToText(response.responseObject.message, response.responseObject.messageDetail));
                            }

                            setTimeout(dsmx.api.campaigns.internal.getCreateStatusUntilFinalState, 500); //query the status again
                        }
                    } else {
                        if (params.failCallback) {
                            params.failCallback(response);
                        }
                    }
                }, dsmx.api.internal.params.failCallback);
            },
            loadSimpleStatisticsUntilFinalState: function () {
                dsmx.api.campaigns.loadSimpleStatistics(dsmx.api.internal.params, function (response) {
                    var params = dsmx.api.internal.params;

                    if (response.state == 0) {
                        if (response.responseObject.isFinished === true) {
                            if (params.doneCallback) {
                                params.doneCallback(response);
                            }
                        } else {
                            if (params.updateCallback) {
                                params.updateCallback(response.responseObject);
                            }

                            setTimeout(dsmx.api.campaigns.internal.loadSimpleStatisticsUntilFinalState, 250); //query the status again
                        }
                    } else {
                        if (params.failCallback) {
                            params.failCallback(response);
                        }
                    }
                }, dsmx.api.internal.params.failCallback);
            }
        },
        create: function (createCampaignModel, doneCallback, failCallback) { //create a campaign from a campaign template, receive status id
            var json = JSON.stringify(createCampaignModel);

            dsmx.api.core.postJson("/api/campaign/create", json, doneCallback, failCallback);
        },
        copy: function (copyCampaignModel, doneCallback, failCallback) { //create a campaign from a campaign template and copies the campaign meta data, receive status id
            var json = JSON.stringify(copyCampaignModel);

            dsmx.api.core.postJson("/api/campaign/copy", json, doneCallback, failCallback);
        },
        getCreateStatus: function (params, doneCallback, failCallback) { //get creation status
            if (!params) {
                throw "No params provided.";
            }

            if (!params.statusId) {
                dsmx.api.handleError(params, "No 'statusId' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaign/getcreatestatus/" + params.statusId, doneCallback, failCallback);
        },
        createUntilFinalState: function (params) { //create a campaign and get update message, finished callback is only invoked once every work has been done
            if (!params) {
                throw "No params provided.";
            }

            if (!params.createCampaignModel) {
                dsmx.api.handleError(params, "No 'createCampaignModel' parameter provided.");
                return;
            }

            dsmx.api.campaigns.create(params.createCampaignModel,
                function (response) {
                    if (response.state == 0) {
                        params.statusId = response.responseObject;
                        dsmx.api.internal.params = params;
                        dsmx.api.campaigns.internal.getCreateStatusUntilFinalState();
                    } else {
                        if (params.failCallback) {
                            params.failCallback({
                                responseJSON: response
                            });
                        }
                    }
                }, params.failCallback);
        },
        copyUntilFinalState: function (params) { //copy a campaign and get update message, finished callback is only invoked once every work has been done
            if (!params) {
                throw "No params provided.";
            }

            if (!params.copyCampaignModel) {
                dsmx.api.handleError(params, "No 'createCampaignModel' parameter provided.");
                return;
            }

            dsmx.api.campaigns.copy(params.copyCampaignModel,
                function (response) {
                    if (response.state == 0) {
                        params.statusId = response.responseObject;
                        dsmx.api.internal.params = params;
                        dsmx.api.campaigns.internal.getCreateStatusUntilFinalState();
                    } else {
                        if (params.failCallback) {
                            params.failCallback({
                                responseJSON: response
                            });
                        }
                    }
                }, params.failCallback);
        },
        getAll: function (doneCallback, failCallback) { //loads all existing campaigns
            dsmx.api.core.get("/api/campaign/getall", doneCallback, failCallback);
        },
        getAllWithStatistics: function (doneCallback, failCallback) { //loads all existing campaigns
            dsmx.api.core.get("/api/campaign/getallwithstatistics", doneCallback, failCallback);
        },
        getWithStatistics: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaign/" + params.campaignId + "/withstatistics", doneCallback, failCallback);
        },
        getAutomatedTaskStates: function (params, doneCallback, failCallback) {
            if (dsmx.api.isNotSet(params, "You need to provide at least a campaignId. E.g. { 'campaignId': '1' }", failCallback)) {
                return;
            }

            if (dsmx.api.isNotSet(params.campaignId, "You need to set the 'campaignId' property.", failCallback)) {
                return;
            }

            dsmx.api.core.get("/api/campaign/" + params.campaignId + "/automatedtaskstates", doneCallback, failCallback);
        },
        getAutomatedTasks: function (params, doneCallback, failCallback) { //load all automated tasks from a campaign
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaign/" + params.campaignId + "/getautomatedtasks", doneCallback, failCallback);
        },
        getRunningAutomatedTasks: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaign/" + params.campaignId + "/getrunningautomatedtasks", doneCallback, failCallback);
        },
        startAllAutomatedTasks: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/startallautomatedtasks", json, doneCallback, failCallback);
        },
        stopAllAutomatedTasks: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/stopallautomatedtasks", json, doneCallback, failCallback);
        },
        setAutomatedTaskExecutionDates: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.activityExecutionDates) {
                dsmx.api.handleError(params, "No 'executionDates' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId, activityExecutionDates: params.activityExecutionDates
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/setautomatedtaskexecutiondates", json, doneCallback, failCallback);
        },
        executeTasksOnExecutionDates: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.activityExecutionDates) {
                dsmx.api.handleError(params, "No 'executionDates' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId, activityExecutionDates: params.activityExecutionDates
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/executetasksonexecutiondates", json, doneCallback, failCallback);
        },
        getStructure: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId
            };
            var json = JSON.stringify(model);

            dsmx.api.core.get("/api/campaign/" + params.campaignId + "/structure", doneCallback, failCallback);
        },
        sendTestMail: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.mailId) {
                dsmx.api.handleError(params, "No 'mailId' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId, mailId: params.mailId
            };

            if (typeof params.useApproverEMailAddress != "undefined") {
                model.useApproverEMailAddress = params.useApproverEMailAddress === true;
            }

            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/sendtestmail", json, doneCallback, failCallback);
        },
        sendMailing: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.mailId) {
                dsmx.api.handleError(params, "No 'mailId' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId, mailId: params.mailId
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/sendmailing", json, doneCallback, failCallback);
        },
        deleteCampaign: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.deleteEventsMode) {
                params.deleteEventsMode = dsmx.api.campaigns.deleteEventsModeE.none;
            }

            var model = {
                deleteEventsMode: params.deleteEventsMode
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/" + params.campaignId + "/delete", json, doneCallback, failCallback);
        },
        createSimpleStatistics: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaign/" + params.campaignId + "/createsimplestatistics", doneCallback, failCallback);
        },
        loadSimpleStatistics: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.progressId) {
                dsmx.api.handleError(params, "No 'progressId' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaign/" + params.progressId + "/loadsimplestatistics", doneCallback, failCallback);
        },
        loadSimpleStatisticsUntilFinalState: function (params) {
            if (!params) {
                throw "No params provided.";
            }

            dsmx.api.campaigns.createSimpleStatistics(params, function (response) {
                if (response.state === 0) {
                    params.progressId = response.responseObject.progressId;
                    dsmx.api.internal.params = params;
                    dsmx.api.campaigns.internal.loadSimpleStatisticsUntilFinalState();
                } else {
                    if (params.failCallback) {
                        params.failCallback(response);
                    }
                }
            }, params.failCallback);
        },
        changeCampaignDayDay: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.campaignDayId) {
                dsmx.api.handleError(params, "No 'campaignDayId' parameter provided.");
                return;
            }

            if (!params.day) {
                dsmx.api.handleError(params, "No 'day' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId, campaignDayId: params.campaignDayId, day: params.day
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/changecampaigndayday", json, doneCallback, failCallback);
        },
        changeCampaignDayStartDate: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.campaignDayId) {
                dsmx.api.handleError(params, "No 'campaignDayId' parameter provided.");
                return;
            }

            if (!params.startDate) {
                dsmx.api.handleError(params, "No 'startDate' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId, campaignDayId: params.campaignDayId, startDate: params.startDate
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/changecampaigndaystartdate", json, doneCallback, failCallback);
        },
        startAutomatedTask: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.activityId) {
                dsmx.api.handleError(params, "No 'activityId' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId, activityId: params.activityId
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/startautomatedtask", json, doneCallback, failCallback);
        },
        stopAutomatedTask: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.activityId) {
                dsmx.api.handleError(params, "No 'activityId' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId, activityId: params.activityId
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/stopautomatedtask", json, doneCallback, failCallback);
        },
        getImpositions: function (doneCallback, failCallback) {
            dsmx.api.core.get("/api/campaign/impositions", doneCallback, failCallback);
        },
        getPdfPresets: function (doneCallback, failCallback) {
            dsmx.api.core.get("/api/campaign/pdfpresets", doneCallback, failCallback);
        },
        renderDocument: function (params) {
            var model;

            if (!params) {
                throw "No params provided.";
            }

            if (!params.doneCallback) {
                dsmx.api.handleError(params, "No 'doneCallback' parameter provided.");
                return;
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.documentId) {
                dsmx.api.handleError(params, "No 'documentId' parameter provided.");
                return;
            }

            model = {
                campaignId: params.campaignId,
                documentId: params.documentId,
                enableCache: true,
                presetId: "B76C5F80-C35E-44EE-90DF-17D63FB4A7AB", //preview preset id
                blockSize: 50,
                lpLogin: params.lpLogin,
                watermark: params.watermark
            };

            if (params.enableCache === false) {
                model.enableCache = false;
            }

            if (params.presetId) {
                model.presetId = params.presetId;
            }

            if (params.impositionName) {
                model.impositionName = params.impositionName;
            }

            if (dsmx.api.isInteger(params.blockSize)) {
                model.blockSize = parseInt(params.blockSize);
            }

            if (dsmx.api.isInteger(params.fromBlock)) {
                model.fromBlock = parseInt(params.fromBlock);
            }

            if (dsmx.api.isInteger(params.toBlock)) {
                model.toBlock = parseInt(params.toBlock);
            }

            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/renderdocument", json, params.doneCallback, params.failCallback);
        },
        getRenderDocumentStatus: function (params) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.doneCallback) {
                dsmx.api.handleError(params, "No 'doneCallback' parameter provided.");
                return;
            }

            if (!params.ids) {
                dsmx.api.handleError(params, "No 'ids' parameter provided.");
                return;
            }

            var model = {
                ids: params.ids
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/getrenderdocumentstatus", json, params.doneCallback, params.failCallback);
        },
        getRenderDocumentStatusUntilFinalState: function (params) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.doneCallback) {
                dsmx.api.handleError(params, "No 'doneCallback' parameter provided.");
                return;
            }

            if (!params.ids) {
                dsmx.api.handleError(params, "No 'ids' parameter provided.");
                return;
            }

            if (!dsmx.api.isArray(params.ids)) {
                dsmx.api.handleError(params, "Parameter 'ids' is not an array.");
                return;
            }

            (function (params) {
                var maxErrors = 5;
                var theParams = params;

                var invokeIfExists = function (method, param) {
                    if (method) {
                        method(param);
                    }
                };

                var allFinished = function (states) {
                    var completed = 0;
                    var current;
                    var key;

                    for (key in states) {
                        current = states[key];

                        if (current.state === 2 || current.state === 3 || current.state === 4) {
                            completed++;
                        }
                    }

                    return completed === theParams.ids.length;
                };

                var queryStatus = function () {
                    dsmx.api.campaigns.getRenderDocumentStatus({
                        ids: theParams.ids,
                        doneCallback: function (response) {
                            if (response.state == 0) {
                                if (allFinished(response.responseObject)) {
                                    theParams.doneCallback(response);
                                } else {
                                    invokeIfExists(theParams.progressCallback, response);
                                    setTimeout(queryStatus, 500);
                                }
                            } else {
                                if (maxErrors > 0) {
                                    setTimeout(queryStatus, 500);
                                } else {
                                    invokeIfExists(theParams.failCallback, response);
                                }

                                maxErrors--;
                            }
                        },
                        failCallback: function (response) {
                            if (maxErrors > 0) {
                                setTimeout(queryStatus, 500);
                            } else {
                                invokeIfExists(theParams.failCallback, response);
                            }

                            maxErrors--;
                        }
                    });
                };

                queryStatus();

            })(params);
        },
        setDomain: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (dsmx.api.isNotDefined(params.domain, "No 'domain' parameter provided.", failCallback)) {
                return;
            }

            var model = {
                campaignId: params.campaignId, domain: params.domain
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/setdomain", json, doneCallback, failCallback);
        },
        getFilter: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/campaign/" + params.campaignId + "/getfilter", doneCallback, failCallback);
        },
        setFilter: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            if (!params.filterName) {
                dsmx.api.handleError(params, "No 'filterName' parameter provided.");
                return;
            }

            var model = {
                campaignId: params.campaignId,
                filterName: params.filterName
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/setfilter", json, doneCallback, failCallback);
        },
        deleteFilter: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.campaignId) {
                dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                return;
            }

            var model = {
                id: params.campaignId
            };
            var json = JSON.stringify(model);

            dsmx.api.core.postJson("/api/campaign/deletefilter", json, doneCallback, failCallback);
        },
        statistics: {
            e: {
            },
            getDailyVisitorsCurrentMonth: function (params, doneCallback, failCallback) {
                if (!params) {
                    throw "No params provided.";
                }

                if (!params.campaignId) {
                    dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                    return;
                }

                dsmx.api.core.get("/api/campaign/" + params.campaignId + "/statistics/daily/currentmonth", doneCallback, failCallback);
            },
            getDailyVisitorsPreviousMonth: function (params, doneCallback, failCallback) {
                if (!params) {
                    throw "No params provided.";
                }

                if (!params.campaignId) {
                    dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                    return;
                }

                dsmx.api.core.get("/api/campaign/" + params.campaignId + "/statistics/daily/previousmonth", doneCallback, failCallback);
            },
            getDailyMailOpenerCurrentMonth: function (params, doneCallback, failCallback) {
                if (!params) {
                    throw "No params provided.";
                }

                if (!params.campaignId) {
                    dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                    return;
                }

                dsmx.api.core.get("/api/campaign/" + params.campaignId + "/statistics/daily/mailopen/currentmonth", doneCallback, failCallback);
            },
            getDailyMailOpenerPreviousMonth: function (params, doneCallback, failCallback) {
                if (!params) {
                    throw "No params provided.";
                }

                if (!params.campaignId) {
                    dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                    return;
                }

                dsmx.api.core.get("/api/campaign/" + params.campaignId + "/statistics/daily/mailopen/previousmonth", doneCallback, failCallback);
            },
            getHourlyVisitors: function (params, doneCallback, failCallback) {
                if (!params) {
                    throw "No params provided.";
                }

                if (!params.campaignId) {
                    dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                    return;
                }

                dsmx.api.core.get("/api/campaign/" + params.campaignId + "/statistics/hourly", doneCallback, failCallback);
            },
            getHourlyMailOpener: function (params, doneCallback, failCallback) {
                if (!params) {
                    throw "No params provided.";
                }

                if (!params.campaignId) {
                    dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                    return;
                }

                dsmx.api.core.get("/api/campaign/" + params.campaignId + "/statistics/mailopen/hourly", doneCallback, failCallback);
            },
            getResponse: function (params, doneCallback, failCallback) {
                if (!params) {
                    throw "No params provided.";
                }

                if (!params.campaignId) {
                    dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                    return;
                }

                dsmx.api.core.get("/api/campaign/" + params.campaignId + "/statistics/response", doneCallback, failCallback);
            },
            getPagesOverview: function (params, doneCallback, failCallback) {
                if (!params) {
                    throw "No params provided.";
                }

                if (!params.campaignId) {
                    dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                    return;
                }

                dsmx.api.core.get("/api/campaign/" + params.campaignId + "/statistics/pages/overview", doneCallback, failCallback);
            },
            getColumnsCount: function (params, doneCallback, failCallback) {
                if (!params) {
                    throw "No params provided.";
                }

                if (!params.campaignId) {
                    dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                    return;
                }

                dsmx.api.core.get("/api/campaign/" + params.campaignId + "/statistics/count/columns", doneCallback, failCallback);
            },
            getMailsOverview: function (params, doneCallback, failCallback) {
                if (!params) {
                    throw "No params provided.";
                }

                if (!params.campaignId) {
                    dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
                    return;
                }

                dsmx.api.core.get("/api/campaign/" + params.campaignId + "/statistics/mails/overview", doneCallback, failCallback);
            }
        }
    };

    dsmx.api.campaigns.getActivityAffectedRecordCount = function (params, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaign/" + params.campaignId + "/" + params.activityGuid + "/getaffectedrecordcount", doneCallback, failCallback);
    };

    dsmx.api.campaigns.replaceDocument = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.campaignId) {
            dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
            return;
        }

        if (!dsmx.api.isInteger(params.campaignId)) {
            dsmx.api.handleError(params, "Invalid 'campaignId' parameter. Must be an integer.");
            return;
        }

        if (!params.documentId) {
            dsmx.api.handleError(params, "No 'documentId' parameter provided.");
            return;
        }

        if (!params.documentTemplateId) {
            dsmx.api.handleError(params, "No 'documentTemplateId' parameter provided.");
            return;
        }

        if (!dsmx.api.isInteger(params.documentTemplateId)) {
            dsmx.api.handleError(params, "Invalid 'documentTemplateId' parameter. Must be an integer.");
            return;
        }

        var model = {
            campaignId: params.campaignId, documentId: params.documentId, documentTemplateId: params.documentTemplateId
        };
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/campaign/replacedocument", json, doneCallback, failCallback);
    };

    dsmx.api.campaigns.getDocumentReplaceStatus = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.statusId) {
            dsmx.api.handleError(params, "No 'statusId' parameter provided.");
            return;
        }

        dsmx.api.core.get("/api/campaign/getdocumentreplacestatus/" + params.statusId, doneCallback, failCallback);
    };

    dsmx.api.campaigns.changeSettings = function (settings, doneCallback, failCallback) {
        if (!settings) {
            throw "No params provided.";
        }

        //Except campaign, all properties are optional and can be disabled by setting to null or by not adding
        //var settings = {
        //    campaign: {
        //        campaignName: "",//Campaign name or campaign id
        //        campaignId: 0,//Campaign name or campaign id
        //    },
        //    redirectURLs: ["url1", "url2"],
        //    expirationDate: "2017-01-01",
        //    disableExpirationDate: false,
        //    p3pCompactHeader: "",
        //    p3pCompactHeaderEnabled: false,
        //    forceHttps: false,
        //    urlRewritingMode: 0,
        //    maxFileUploadStoragePerCustomerInMB: 200,
        //    language: ""
        //};

        dsmx.api.core.postJson("/api/campaign/changesettings/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.campaigns.getSettings = function (campaign, doneCallback, failCallback) {
        if (!campaign) {
            throw "No params provided.";
        }

        //var campaign: {
        //  campaignName: "",//Campaign name or campaign id
        //  campaignId: 0,//Campaign name or campaign id
        //};

        dsmx.api.core.postJson("/api/campaign/getsettings/", JSON.stringify(campaign), doneCallback, failCallback);
    };

    dsmx.api.campaigns.setLanguage = function (settings, doneCallback, failCallback) {
        if (!settings) {
            throw "No params provided.";
        }

        //var settings = {
        //    campaign: {
        //        campaignName: "",//Campaign name or campaign id
        //        campaignId: 0,//Campaign name or campaign id
        //    },
        //    language: ""
        //};

        dsmx.api.core.postJson("/api/campaign/setlanguage/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.campaigns.e.getDocumentReplaceStatusUntilFinalState = function (params, doneCallback, failCallback, progressCallback) {
        var state = {
        };

        state.allowedErrors = 5;
        state.params = params;
        state.doneCallback = doneCallback;
        state.failCallback = failCallback;
        state.progressCallback = progressCallback;

        var invokeIfExists = function (method, param) {
            if (method) {
                method(param);
            }
        };

        var queryStatus = function () {
            dsmx.api.campaigns.e.getDocumentReplaceStatus(state.params,
                function (responseObject) {
                    if (responseObject.state >= dsmx.api.campaigns.documentReplaceStateE.finished) {
                        invokeIfExists(state.doneCallback, responseObject);

                    } else {
                        invokeIfExists(state.progressCallback, responseObject);
                        setTimeout(queryStatus, 500);
                    }
                },
                function (errorObject) {
                    if (state.allowedErrors > 0) {
                        setTimeout(queryStatus, 500);
                    } else {
                        invokeIfExists(state.failCallback, errorObject);
                    }

                    state.allowedErrors--;
                }
            );
        };

        queryStatus();
    };

    dsmx.api.campaigns.documentReplaceStateE = {
        waitingToStart: 0,
        started: 1,
        readingCampaign: 2,
        readingDocumentTemplate: 3,
        readingTemplateXml: 4,
        readingDocumentTemplateXml: 5,
        replacingDocument: 6,
        regeneratingIds: 7,
        checkingInImages: 8,
        checkingInFonts: 9,
        writingTemplateXml: 10,
        checkingInContent: 11,
        readingInfoFile: 12,

        waitingForCheckInCompletion: 200,
        writingDocumentTemplateMetaData: 201,

        finished: 500,

        couldNotFindStatus: 1000,
        couldNotFindCampaign: 1001,
        couldNotFindDocumentTemplate: 1002,
        couldNotFindDocumentToReplace: 1003,
        couldNotFindInfoFile: 1004,
        couldNotFindDocumentXmlId: 1005,
        couldNotFindDocumentInfo: 1006,

        couldNotReplaceDocument: 2000,
        couldNotCheckInImage: 2001,
        couldNotCheckInFont: 2002,
        couldNotCheckInContent: 2003
    };

    dsmx.api.campaigns.documentReplaceStateToMessage = function (responseObject) {
        var stateE = dsmx.api.campaigns.documentReplaceStateE;
        var state = responseObject.state;
        var detail = responseObject.detail;

        if (state === stateE.waitingToStart) {
            return "Replace request queued. Waiting for start.";

        } else if (state === stateE.started) {
            return "Document replacement started.";

        } else if (state === stateE.readingCampaign) {
            return "Reading campaign information.";

        } else if (state === stateE.readingDocumentTemplate) {
            return "Reading document template information.";

        } else if (state === stateE.readingTemplateXml) {
            return "Reading campaign definition.";

        } else if (state === stateE.readingDocumentTemplateXml) {
            return "Reading document template definition.";

        } else if (state === stateE.replacingDocument) {
            return "Replacing document.";

        } else if (state === stateE.regeneratingIds) {
            return "Regenerating document ids.";

        } else if (state === stateE.checkingInImages) {
            return "Checking in document template images.";

        } else if (state === stateE.checkingInFonts) {
            return "Checking in document template fonts.";

        } else if (state === stateE.writingTemplateXml) {
            return "Writing campaign definition.";

        } else if (state === stateE.checkingInContent) {
            return "Checking in content files.";

        } else if (state === stateE.readingInfoFile) {
            return "Reading document info file.";

        } else if (state === stateE.waitingForCheckInCompletion) {
            //return dsmx.algorithm.arrayReplace("Checking in resources. {0}% done. Currently working on '{1}'", [Math.round(responseObject.checkInPercentage * 100.0), detail]);
            return dsmx.algorithm.arrayReplace("Checking in resources. {0}% done. Currently working on '{1}'", [Math.round(responseObject.checkInPercentage), detail]);

        } else if (state === stateE.writingDocumentTemplateMetaData) {
            return "Writing template meta data.";

        } else if (state === stateE.finished) {
            return "Document replacement completed.";

        } else if (state === stateE.couldNotReplaceDocument) {
            return dsmx.algorithm.arrayReplace("Could not replace the document: {0}", [detail]);

        } else if (state === stateE.couldNotFindStatus) {
            return "Could not find status. Please retry.";

        } else if (state === stateE.couldNotFindCampaign) {
            return "Could not find campaign.";

        } else if (state === stateE.couldNotFindDocumentTemplate) {
            return "Could not find document template.";

        } else if (state === stateE.couldNotFindDocumentToReplace) {
            return "Could not find document to replace within campaign definition.";

        } else if (state === stateE.couldNotFindInfoFile) {
            return "Could not find info file.";

        } else if (state === stateE.couldNotFindDocumentXmlId) {
            return "Could not find document xml id.";

        } else if (state === stateE.couldNotFindDocumentInfo) {
            return "Could not find document info.";

        } else if (state === stateE.couldNotCheckInImage) {
            return dsmx.algorithm.arrayReplace("Could not checkin image: {0}", [detail]);

        } else if (state === stateE.couldNotCheckInFont) {
            return dsmx.algorithm.arrayReplace("Could not checkin font: {0}", [detail]);

        } else if (state === stateE.couldNotCheckInContent) {
            return dsmx.algorithm.arrayReplace("Could not checkin content: {0}", [detail]);

        } else {
            return "Unknown state.";
        }
    };


    dsmx.api.campaigns.getDocumentImportStatus = function (statusId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/campaign/getdocumentimportstatus/" + statusId, doneCallback, failCallback);
    };

    dsmx.api.campaigns.e.getDocumentImportStatusUntilFinalState = function (params, doneCallback, failCallback, progressCallback) {
        var state = {
        };

        state.allowedErrors = 5;
        state.params = params;
        state.doneCallback = doneCallback;
        state.failCallback = failCallback;
        state.progressCallback = progressCallback;

        var invokeIfExists = function (method, param) {
            if (method) {
                method(param);
            }
        };

        var queryStatus = function () {
            dsmx.api.campaigns.e.getDocumentImportStatus(state.params,
                function (responseObject) {
                    if (responseObject.state >= dsmx.api.campaigns.documentImportStateE.completed) {
                        invokeIfExists(state.doneCallback, responseObject);

                    } else {
                        invokeIfExists(state.progressCallback, responseObject);
                        setTimeout(queryStatus, 500);
                    }
                },
                function (errorObject) {
                    if (state.allowedErrors > 0) {
                        setTimeout(queryStatus, 500);
                    } else {
                        invokeIfExists(state.failCallback, errorObject);
                    }

                    state.allowedErrors--;
                }
            );
        };

        queryStatus();
    };

    dsmx.api.campaigns.documentImportStateE = {
        queued: 0,
        extractingZipFile: 1,
        checkingImportFileValidity: 2,
        creatingCampaign: 3,

        completed: 100,
        couldNotFindStatus: 101,
        couldNotFindDocumentXml: 102,
        campaignAlreadyExists: 103,
        couldNotCreateCampaign: 104,
        couldNotFindContactsDatabase: 105,
        unknownError: 106,
        couldNotCheckinImage: 107,
        couldNotRegisterDocument: 108
    };

    dsmx.api.campaigns.documentImportStateToMessage = function (responseObject) {
        var stateE = dsmx.api.campaigns.documentImportStateE;
        var state = responseObject.state;
        var detail = responseObject.errorDetails;

        if (state === stateE.queued) {
            return "Import request queued. Waiting for start.";

        } else if (state === stateE.extractingZipFile) {
            return "Document replacement started. Extracting zip file.";

        } else if (state === stateE.checkingImportFileValidity) {
            return "Checking import file validity.";

        } else if (state === stateE.creatingCampaign) {
            return "Creating campaign.";

        } else if (state === stateE.completed) {
            return "Completed.";

        } else if (state === stateE.couldNotFindStatus) {
            return "Could not find status. Please restart.";

        } else if (state === stateE.couldNotFindDocumentXml) {
            return "Could not find document xml. The docml file name must be 'document.xml'.";

        } else if (state === stateE.campaignAlreadyExists) {
            return "Could not create campaign. A campaign with the provided name already exists.";

        } else if (state === stateE.couldNotCreateCampaign) {
            return "Could not create campaign. Message: " + detail;

        } else if (state === stateE.couldNotFindContactsDatabase) {
            return "Could not find contacts database. Please contact the support.";

        } else if (state === stateE.unknownError) {
            return "Unknown error. Details: " + detail;

        } else if (state === stateE.couldNotCheckinImage) {
            return "Could not checking image. Details: " + detail;

        } else if (state === stateE.couldNotRegisterDocument) {
            return "Could not register document. Details: " + detail;

        } else {
            return "Unknown state: " + state;
        }
    };

    dsmx.api.campaigns.setThumbnailFromDocumentTemplate = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.campaignId) {
            dsmx.api.handleError(params, "No 'campaignId' parameter provided.");
            return;
        }

        if (!dsmx.api.isInteger(params.campaignId)) {
            dsmx.api.handleError(params, "Invalid 'campaignId' parameter. Must be an integer.");
            return;
        }

        if (!params.documentTemplateId) {
            dsmx.api.handleError(params, "No 'documentTemplateId' parameter provided.");
            return;
        }

        if (!dsmx.api.isInteger(params.documentTemplateId)) {
            dsmx.api.handleError(params, "Invalid 'documentTemplateId' parameter. Must be an integer.");
            return;
        }

        dsmx.api.core.postJson("/api/campaign/" + params.campaignId + "/fromdocumenttemplate/" + params.documentTemplateId, "", doneCallback, failCallback);
    };

    dsmx.api.campaigns.getStreamImageUrl = function (model, doneCallback, failCallback) {
        var json;

        if (!model) {
            throw "No model provided.";
        }

        json = JSON.stringify(model);
        dsmx.api.core.postJson("/api/campaign/getstreamimageurl", json, doneCallback, failCallback);
    };

    dsmx.api.campaigns.writeNotes = function (model, doneCallback, failCallback) {
        var json;

        if (!model) {
            throw "No model provided.";
        }

        json = JSON.stringify(model);
        dsmx.api.core.postJson("/api/campaign/writenotes", json, doneCallback, failCallback);
    };

    dsmx.api.campaigns.getFirstContact = function (campaign, doneCallback, failCallback) {
        var json;

        if (!campaign || (!campaign.campaignId && !campaign.campaignName)) {
            throw "No campaign provided.";
        }

        json = JSON.stringify(campaign);
        dsmx.api.core.postJson("/api/campaign/firstcontact", json, doneCallback, failCallback);
    };


    //#region "dsmx.api.emails"
    dsmx.api.emails.smtpServers.get = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/email/smtpservers/get", doneCallback, failCallback);
    };

    dsmx.api.emails.smtpServers.getForAccount = function (accountId, doneCallback, failCallback) {//Only server admin
        dsmx.api.core.get("/api/email/smtpservers/get/" + parseInt(accountId), doneCallback, failCallback);
    };

    dsmx.api.emails.smtpServers.delete = function (serverId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/email/smtpservers/delete/" + parseInt(serverId), doneCallback, failCallback);
    };

    dsmx.api.emails.smtpServers.deleteInAccount = function (settings, doneCallback, failCallback) {//Only server admin
        //settings: {
        //    serverId: serverId,
        //    accountId: accountId
        //}
        dsmx.api.core.get("/api/email/smtpservers/delete/" + parseInt(settings.serverId) + "/" + parseInt(settings.accountId), doneCallback, failCallback);
    };

    dsmx.api.emails.smtpServers.setDefault = function (serverId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/email/smtpservers/default/" + parseInt(serverId), doneCallback, failCallback);
    };

    dsmx.api.emails.smtpServers.setDefaultForAccount = function (settings, doneCallback, failCallback) {//Only server admin
        //settings: {
        //    serverId: serverId,
        //    accountId: accountId
        //}
        dsmx.api.core.get("/api/email/smtpservers/default/" + parseInt(settings.serverId) + "/" + parseInt(settings.accountId), doneCallback, failCallback);
    };

    dsmx.api.emails.smtpServers.create = function (smtpServer, doneCallback, failCallback) {
        //smtpServer = {
        //    id: 0,
        //    name: "",
        //    heloDomain: "localhost",
        //    timeout: 120,
        //    port: 25,
        //    serverUrl: "",
        //    serverUser: "",
        //    serverPwd: "",
        //    protocol: "ssl",
        //    maxConnections: 0;
        //    isOptivoSmtp: false,
        //    optivoMailingId: false,
        //    optivoSendingDomain: "",
        //    shutdownAfterSend: false,
        //    serverKey: ""
        //};

        var account = "";

        if (smtpServer.accountId) {
            account = "/" + parseInt(smtpServer.accountId);
        }

        dsmx.api.core.postJson("/api/email/smtpservers/create" + account, JSON.stringify(smtpServer), doneCallback, failCallback);
    };

    dsmx.api.emails.smtpServers.update = function (smtpServer, doneCallback, failCallback) {
        //smtpServer = {
        //    id: 0,
        //    name: "",
        //    heloDomain: "localhost",
        //    timeout: 120,
        //    port: 25,
        //    serverUrl: "",
        //    serverUser: "",
        //    serverPwd: "",
        //    protocol: "ssl",
        //    maxConnections: 0;
        //    isOptivoSmtp: false,
        //    optivoMailingId: false,
        //    optivoSendingDomain: "",
        //    shutdownAfterSend: false,
        //    serverKey: ""
        //};

        var account = "";

        if (smtpServer.accountId) {
            account = "/" + parseInt(smtpServer.accountId);
        }

        dsmx.api.core.postJson("/api/email/smtpservers/update" + account, JSON.stringify(smtpServer), doneCallback, failCallback);
    };

    dsmx.api.emails.smtpServers.rename = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    serverId: 0,
        //    newName: ""
        //}

        var account = "";

        if (settings.accountId) {
            account = "/" + parseInt(settings.accountId);
        }

        dsmx.api.core.postJson("/api/email/smtpservers/rename" + account, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.emails.smtpServers.updateProperty = function (settings, doneCallback, failCallback) {
        //settings: {
        //    serverId: 0,
        //    propertyName: "",
        //    propertyValue: ""
        //}

        var account = "";

        if (settings.accountId) {
            account = "/" + parseInt(settings.accountId);
        }

        dsmx.api.core.postJson("/api/email/smtpservers/updateproperty" + account, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.emails.sendSingle = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    campaign: {
        //        campaignName: "",//CampaignName or CampaignId
        //        campaignId: 0//CampaignName or CampaignId
        //    },
        //    customer: {
        //        customerId: 0,//CustomerId or lplogin
        //        lplogin: ""//CustomerId or lplogin
        //    },
        //    pageName: "emailpage.html",
        //    sendSync: true,//we want to see the result, so send out the email sync
        //    accountId: 0//required only by server admin to specifiy the account id himself
        //};

        var path = "/api/email/sendsingle/";

        if (typeof settings.accountId != "undefined") {
            path += parseInt(settings.accountId);
        }

        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.emails.getUnsubscriberImportStatus = function (settings, doneCallback, failCallback) {
        var url = "/api/email/importunsubscriberstatus/";

        if (typeof settings == "string") {
            url += encodeURIComponent(settings) + "/";
        } else {
            url += encodeURIComponent("" + settings.importId) + "/";

            if (settings.accountId) {
                url += parseInt(settings.accountId) + "/";
            }
        }

        dsmx.api.core.get(url, doneCallback, failCallback);
    };

    dsmx.api.emails.addUnsubscribers = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    unsubscribers: ["email1@example.com", "email2@example.com"],
        //    importSync: false,
        //    accountId: 0//Only for admin keys
        //};

        var path = "/api/email/addunsubscribers/";

        if (typeof settings.accountId != "undefined") {
            path += parseInt(settings.accountId);
        }

        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.emails.removeUnsubscribers = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    emailAddresses: ["email1@example.com", "email2@example.com"],
        //    ids: [1,2,3,4,5,6,7],
        //    accountId: 0//Only for admin keys
        //};

        var path = "/api/email/removeunsubscribers/";

        if (typeof settings.accountId != "undefined") {
            path += parseInt(settings.accountId);
        }

        dsmx.api.core.postJson(path, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.emails.exportUnsubscribers = function (settings, doneCallback, failCallback) {
        var accountId = "";

        if (typeof settings.accountId != "undefined") {
            accountId = parseInt(settings.accountId);
        }

        dsmx.api.core.postJson("/api/email/exportunsubscribers/" + accountId, JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.emails.getUnsubscriberExportStatus = function (exportId, doneCallback, failCallback) {
        var url = "/api/email/exportunsubscriberstatus/" + encodeURIComponent(exportId);

        dsmx.api.core.get(url, doneCallback, failCallback);
    };

    dsmx.api.emails.getUnsubscriberMetaData = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/email/unsubscribermetadata", doneCallback, failCallback);
    };

    dsmx.api.emails.getUnsubscriberMetaDataForAccount = function (accountId, doneCallback, failCallback) {//Only server admin
        dsmx.api.core.get("/api/email/unsubscribermetadata/" + parseInt(accountId), doneCallback, failCallback);
    };

    //#endregion "dsmx.api.emails"






    //#region "dsmx.api.images"



    dsmx.api.images = {
    };
    dsmx.api.images.e = {
    };
    dsmx.api.images.importStatus = {
    };

    dsmx.api.images.importStateE = {
        waitingToStart: 0,
        started: 1,
        extractingZipFile: 2,
        insertingCategories: 3,
        creatingCategoryDirectories: 4,
        movingFiles: 5,
        writingImageInformation: 6,
        creatingThumbnails: 100,
        convertingFiles: 101,
        finished: 500,
        couldNotFindStatus: 1000,
        userInteractionNeeded: 1001,
        couldNotImportTemplate: 2000,
        couldNotExtractZipFile: 2001
    };

    dsmx.api.images.thumbnailType = {
        category: 1,
        campaignTemplate: 2,
        documentTemplate: 3,
        image: 4
    };



    dsmx.api.images.importStateToMessage = function (responseObject) {
        var state = responseObject.state;
        var detail = responseObject.detail;

        if (state === dsmx.api.documentTemplates.importStateE.waitingToStart) {
            return "Import request queued. Waiting for start."; //dsmx.algorithm.arrayReplace("Could not download the data file: {0}", [errorDetails]);

        } else if (state === dsmx.api.images.importStateE.started) {
            return "Import started.";

        } else if (state === dsmx.api.images.importStateE.extractingZipFile) {
            return "Extracting zip file.";

        } else if (state === dsmx.api.images.importStateE.insertingCategories) {
            return "Inserting categories.";

        } else if (state === dsmx.api.images.importStateE.creatingCategoryDirectories) {
            return "Creating category directories.";

        } else if (state === dsmx.api.images.importStateE.movingFiles) {
            return "Processing files.";

        } else if (state === dsmx.api.images.importStateE.writingImageInformation) {
            return "Writing information to database.";

        } else if (state === dsmx.api.images.importStateE.finished) {
            return "Import finished.";

        } else if (state === dsmx.api.images.importStateE.couldNotFindStatus) {
            return "Could not find import status. Please retry.";

        } else if (state === dsmx.api.images.importStateE.userInteractionNeeded) {
            return "User interaction needed. Please send your decisions.";

        } else if (state === dsmx.api.images.importStateE.creatingThumbnails) {
            return dsmx.algorithm.arrayReplace("Creating thumbnail for '{0}'.", [detail]);

        } else if (state === dsmx.api.images.importStateE.convertingFiles) {
            return dsmx.algorithm.arrayReplace("Converting '{0}'.", [detail]);

        } else if (state === dsmx.api.images.importStateE.couldNotImportTemplate) {
            return dsmx.algorithm.arrayReplace("Could not import images. Details: {0}", [detail]);

        } else if (state === dsmx.api.images.importStateE.couldNotExtractZipFile) {
            return dsmx.algorithm.arrayReplace("Could not extract zip file. Details: {0}", [detail]);

        } else {
            return "Unknown state.";
        }
    };

    dsmx.api.images.importStatus.isFinalState = function (responseObject) {
        if (responseObject.state >= dsmx.api.images.importStateE.finished) {
            return true;
        }

        return false;
    };

    dsmx.api.images.importStatus.isDecisionState = function (responseObject) {
        if (responseObject.state === dsmx.api.images.importStateE.userInteractionNeeded) {
            return true;
        }

        return false;
    };

    dsmx.api.images.importStatus.isErrorState = function (responseObject) {
        if (responseObject.state >= dsmx.api.images.importStateE.couldNotFindStatus) {
            return true;
        }

        return false;
    };

    dsmx.api.images.getImportStatus = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.importId) {
            dsmx.api.handleError(params, "No 'importId' parameter provided.");
            return;
        }

        dsmx.api.core.get("/api/images/getimportstatus/" + params.importId, doneCallback, failCallback);
    };

    dsmx.api.images.e.getImportStatusUntilFinalState = function (params, doneCallback, failCallback, progressCallback, decisionCallback) {
        var state = {
        };

        state.allowedErrors = 5;
        state.params = params;
        state.doneCallback = doneCallback;
        state.failCallback = failCallback;
        state.progressCallback = progressCallback;
        state.decisionCallback = decisionCallback;

        var invokeIfExists = function (method, param) {
            if (method) {
                method(param);
            }
        };

        var queryStatus = function () {
            dsmx.api.images.e.getImportStatus(state.params,
                function (responseObject) {
                    if (dsmx.api.images.importStatus.isDecisionState(responseObject)) {
                        invokeIfExists(state.decisionCallback, responseObject);

                    } else if (dsmx.api.images.importStatus.isFinalState(responseObject)) {
                        invokeIfExists(state.doneCallback, responseObject);

                    } else {
                        invokeIfExists(state.progressCallback, responseObject);
                        setTimeout(queryStatus, 500);
                    }
                },
                function (errorObject) {
                    if (state.allowedErrors > 0) {
                        setTimeout(queryStatus, 500);
                    } else {
                        invokeIfExists(state.failCallback, errorObject);
                    }

                    state.allowedErrors--;
                }
            );
        };

        queryStatus();
    };

    dsmx.api.images.getImportStatus = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.importId) {
            dsmx.api.handleError(params, "No 'importId' parameter provided.");
            return;
        }

        dsmx.api.core.get("/api/images/getimportstatus/" + params.importId, doneCallback, failCallback);
    };

    dsmx.api.images.getWithQuery = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.query) {
            throw "No query provided";
        }

        dsmx.api.core.postJson("/api/images/getwithquery", JSON.stringify(params.query), doneCallback, failCallback);
    };

    dsmx.api.images.countWithQuery = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.query) {
            throw "No query provided";
        }

        dsmx.api.core.postJson("/api/images/countwithquery", JSON.stringify(params.query), doneCallback, failCallback);
    };

    dsmx.api.images.update = function (image, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/images/update", JSON.stringify(image), doneCallback, failCallback);
    };

    dsmx.api.images.delete = function (imageName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/images/delete/" + encodeURIComponent(imageName) + "/", doneCallback, failCallback);
    };

    dsmx.api.images.deleteById = function (imageId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/images/deletebyid/" + encodeURIComponent(imageId) + "/", doneCallback, failCallback);
    };

    dsmx.api.images.getThumbnail = function (settings, doneCallback, failCallback) {
        dsmx.api.core.get("/api/images/getthumbnail/" + encodeURIComponent(parseInt(settings.type)) + "/" + encodeURIComponent(parseInt(settings.id)), doneCallback, failCallback);
    };

    dsmx.api.images.getThumbnailByName = function (settings, doneCallback, failCallback) {
        dsmx.api.core.get("/api/images/getthumbnailbyname/" + encodeURIComponent(parseInt(settings.type)) + "/" + encodeURIComponent(settings.name), doneCallback, failCallback);
    };

    dsmx.api.images.portal = {
        e: {
        },
        getApprovedByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/images/portal/bycategory/" + encodeURIComponent(params.categoryName) + "/approved", doneCallback, failCallback);
        },
        getNotApprovedByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/images/portal/bycategory/" + encodeURIComponent(params.categoryName) + "/notapproved", doneCallback, failCallback);
        },
        getAllByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/images/portal/bycategory/" + encodeURIComponent(params.categoryName) + "/all", doneCallback, failCallback);
        },
        getByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            if (dsmx.api.isDefined(params.isApproved) && params.isApproved != null) {
                if (params.isApproved) {
                    dsmx.api.images.portal.getApprovedByCategory(params, doneCallback, failCallback);
                } else {
                    dsmx.api.images.portal.getNotApprovedByCategory(params, doneCallback, failCallback);
                }
            } else {
                dsmx.api.images.portal.getAllByCategory(params, doneCallback, failCallback);
            }
        },
        getWithQueryByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.query) {
                throw "No query provided";
            }

            var category = "";

            if (params.categoryName) {
                category = params.categoryName;
            }

            dsmx.api.core.postJson("/api/images/portal/getbycategory/" + encodeURIComponent(category), JSON.stringify(params.query), doneCallback, failCallback);
        },
        countWithQueryByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.query) {
                throw "No query provided";
            }

            var category = "";

            if (params.categoryName) {
                category = params.categoryName;
            }

            dsmx.api.core.postJson("/api/images/portal/countbycategory/" + encodeURIComponent(category), JSON.stringify(params.query), doneCallback, failCallback);
        },
        connectToCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.imageName || ("" + params.imageName).length == 0) {
                throw "No category name provided";
            }

            if (!params.categoryName || ("" + params.categoryName).length == 0) {
                throw "No category name provided";
            }

            dsmx.api.core.get("/api/images/portal/connecttocategory/" + encodeURIComponent(params.imageName) + "/" + encodeURIComponent(params.categoryName), doneCallback, failCallback);
        },
        disconnectFromCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.imageName || ("" + params.imageName).length == 0) {
                throw "No category name provided";
            }

            if (!params.categoryName || ("" + params.categoryName).length == 0) {
                throw "No category name provided";
            }

            dsmx.api.core.get("/api/images/portal/disconnectfromcategory/" + encodeURIComponent(params.imageName) + "/" + encodeURIComponent(params.categoryName), doneCallback, failCallback);
        }
    };

    //#endregion "dsmx.api.images"


    //#region "dsmx.api.documentTemplates"

    dsmx.api.documentTemplates = {
    };
    dsmx.api.documentTemplates.importStateE = {
        waitingToStart: 0,
        started: 1,
        extractingZipFile: 2,
        readingInfoFile: 3,
        finished: 500,
        couldNotFindStatus: 1000,
        userInteractionNeeded: 1001,
        couldNotFindInfoFile: 1002,
        couldNotImportTemplate: 2000,
        couldNotExtractZipFile: 2001
    };
    dsmx.api.documentTemplates.e = {
    };

    dsmx.api.documentTemplates.importStateToMessage = function (responseObject) {
        var state = responseObject.state;
        var detail = responseObject.detail;

        if (state === dsmx.api.documentTemplates.importStateE.waitingToStart) {
            return "Import request queued. Waiting for start."; //dsmx.algorithm.arrayReplace("Could not download the data file: {0}", [errorDetails]);

        } else if (state === dsmx.api.documentTemplates.importStateE.started) {
            return "Import started.";

        } else if (state === dsmx.api.documentTemplates.importStateE.extractingZipFile) {
            return "Extracting zip file.";

        } else if (state === dsmx.api.documentTemplates.importStateE.readingInfoFile) {
            return "Reading info file.";

        } else if (state === dsmx.api.documentTemplates.importStateE.finished) {
            return "Import finished.";

        } else if (state === dsmx.api.documentTemplates.importStateE.couldNotFindStatus) {
            return "Could not find import status. Please retry.";

        } else if (state === dsmx.api.documentTemplates.importStateE.userInteractionNeeded) {
            return "User interaction needed. Please send your decisions.";

        } else if (state === dsmx.api.documentTemplates.importStateE.couldNotFindInfoFile) {
            return "Could not find info file. Maybe this is not a document template.";

        } else if (state === dsmx.api.documentTemplates.importStateE.couldNotImportTemplate) {
            return dsmx.algorithm.arrayReplace("Could not import template. Details: {0}", [detail]);

        } else if (state === dsmx.api.documentTemplates.importStateE.couldNotExtractZipFile) {
            return dsmx.algorithm.arrayReplace("Could not extract zip file. Details: {0}", [detail]);

        } else {
            return "Unknown state.";
        }
    };

    dsmx.api.documentTemplates.importStatus = {
    };
    dsmx.api.documentTemplates.importStatus.isFinalState = function (responseObject) {
        if (responseObject.state >= dsmx.api.documentTemplates.importStateE.finished) {
            return true;
        }

        return false;
    };

    dsmx.api.documentTemplates.importStatus.isDecisionState = function (responseObject) {
        if (responseObject.state === dsmx.api.documentTemplates.importStateE.userInteractionNeeded) {
            return true;
        }

        return false;
    };

    dsmx.api.documentTemplates.importStatus.isErrorState = function (responseObject) {
        if (responseObject.state >= dsmx.api.documentTemplates.importStateE.couldNotFindStatus) {
            return true;
        }

        return false;
    };


    dsmx.api.documentTemplates.continueImport = function (optionsModel, doneCallback, failCallback) {
        var json = JSON.stringify(optionsModel, function (key, value) {
            if (key === "thumbnail" || key === "categories" || key === "width" || key === "height" || key === "pageCount" || key === "description" || key === "sourceCampaignName" || key === "placeholderName") {
                return undefined;
            }

            return value;
        });

        dsmx.api.core.postJson("/api/documenttemplates/continueimport", json, doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.getAvailableByPlaceholder = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.placeholder) {
            dsmx.api.handleError(params, "No 'placeholder' parameter provided.");
            return;
        }

        dsmx.api.core.get("/api/documenttemplates/getavailable/" + params.placeholder + "/placeholder", doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.getImportStatus = function (params, doneCallback, failCallback) {
        if (!params) {
            throw "No params provided.";
        }

        if (!params.importId) {
            dsmx.api.handleError(params, "No 'importId' parameter provided.");
            return;
        }

        dsmx.api.core.get("/api/documenttemplates/getimportstatus/" + params.importId, doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.e.getImportStatusUntilFinalState = function (params, doneCallback, failCallback, progressCallback, decisionCallback) {
        var state = {
        };

        state.allowedErrors = 5;
        state.params = params;
        state.doneCallback = doneCallback;
        state.failCallback = failCallback;
        state.progressCallback = progressCallback;
        state.decisionCallback = decisionCallback;

        var invokeIfExists = function (method, param) {
            if (method) {
                method(param);
            }
        };

        var queryStatus = function () {
            dsmx.api.documentTemplates.e.getImportStatus(state.params,
                function (responseObject) {
                    if (dsmx.api.documentTemplates.importStatus.isDecisionState(responseObject)) {
                        invokeIfExists(state.decisionCallback, responseObject);

                    } else if (dsmx.api.documentTemplates.importStatus.isFinalState(responseObject)) {
                        invokeIfExists(state.doneCallback, responseObject);

                    } else {
                        invokeIfExists(state.progressCallback, responseObject);
                        setTimeout(queryStatus, 500);
                    }
                },
                function (errorObject) {
                    if (state.allowedErrors > 0) {
                        setTimeout(queryStatus, 500);
                    } else {
                        invokeIfExists(state.failCallback, errorObject);
                    }

                    state.allowedErrors--;
                }
            );
        };

        queryStatus();
    };

    dsmx.api.documentTemplates.getByQuery = function (query, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/documenttemplates/getbyquery/", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.countByQuery = function (query, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/documenttemplates/countbyquery/", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.getByRole = function (query, roleName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/documenttemplates/getbyrole/" + encodeURIComponent(roleName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.countByRole = function (query, roleName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/documenttemplates/countbyrole/" + encodeURIComponent(roleName), JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.getAssignedRoles = function (documentTemplateName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/documenttemplates/getroles/" + encodeURIComponent(documentTemplateName), doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.assignRole = function (documentTemplateName, role, doneCallback, failCallback) {
        dsmx.api.core.get("/api/documenttemplates/assignrole/" + encodeURIComponent(documentTemplateName) + "/" + encodeURIComponent(role), doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.removeRole = function (documentTemplateName, role, doneCallback, failCallback) {
        dsmx.api.core.get("/api/documenttemplates/removerole/" + encodeURIComponent(documentTemplateName) + "/" + encodeURIComponent(role), doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.getByRoles = function (roles, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/documenttemplates/documentsbyroles/", JSON.stringify(roles), doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.update = function (documentTemplate, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/documenttemplates/update/", JSON.stringify(documentTemplate), doneCallback, failCallback);
    };

    dsmx.api.documentTemplates.delete = function (documentTemplateName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/documenttemplates/deleteByName/" + encodeURIComponent(documentTemplateName), doneCallback, failCallback);
    };


    //get document templates [categoryName{,start{,size}}] => 'categoryName' is mandatory, 'start' is optional, additionally you can define 'size' when using 'start'
    dsmx.api.documentTemplates.getByCategory = function (params, doneCallback, failCallback) {
        var finalUrl = "/api/documenttemplates/bycategory/";

        if (!params) {
            throw "No params provided.";
        }

        if (!params.categoryName) {
            dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
            return;
        }

        finalUrl = finalUrl + params.categoryName + "/";

        if (dsmx.api.isInteger(params.start)) {
            finalUrl = finalUrl + params.start;
        }

        if (dsmx.api.isInteger(params.size)) {
            finalUrl = finalUrl + "/" + params.size;
        }

        dsmx.api.core.get(finalUrl, doneCallback, failCallback);
    };

    //retrieves all campaign templates by a given category id, support for queries
    dsmx.api.documentTemplates.getWithQueryByCategory = function (query, categoryName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/documentTemplates/getwithquerybycategory/" + encodeURIComponent(categoryName), JSON.stringify(query), doneCallback, failCallback);
    };

    //retrieves campaign template count by a given category id, support for queries
    dsmx.api.documentTemplates.countWithQueryByCategory = function (query, categoryName, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/documentTemplates/countwithquerybycategory/" + encodeURIComponent(categoryName), JSON.stringify(query), doneCallback, failCallback);
    };

    //connects a document template to a category
    //expects an object containing a documentTemplateName and a categoryName
    dsmx.api.documentTemplates.connectCategory = function (connectModel, doneCallback, failCallback) {
        dsmx.api.core.get("/api/documentTemplates/category/connect/" + encodeURIComponent(connectModel.documentTemplateName) + "/" + encodeURIComponent(connectModel.categoryName), doneCallback, failCallback);
    };

    //disconnects a document template from a category
    //expects an object containing a documentTemplateName and a categoryName
    dsmx.api.documentTemplates.disconnectCategory = function (connectModel, doneCallback, failCallback) {
        dsmx.api.core.get("/api/documentTemplates/category/disconnect/" + encodeURIComponent(connectModel.documentTemplateName) + "/" + encodeURIComponent(connectModel.categoryName), doneCallback, failCallback);
    };

    //retrieves all category names by documenttemplatename
    dsmx.api.documentTemplates.getCategories = function (documentTemplateName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/documentTemplates/category/get/" + encodeURIComponent(documentTemplateName), doneCallback, failCallback);
    };

    //approves a single document template
    dsmx.api.documentTemplates.approve = function (documentTemplateId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/documentTemplates/approve/" + encodeURIComponent(documentTemplateId), doneCallback, failCallback);
    };



    dsmx.api.documentTemplates.portal = {
        e: {
        },
        getApprovedByPlaceholder: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.placeholder) {
                dsmx.api.handleError(params, "No 'placeholder' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/documenttemplates/portal/byplaceholder/" + encodeURIComponent(params.placeholder) + "/approved", doneCallback, failCallback);
        },
        getNotApprovedByPlaceholder: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.placeholder) {
                dsmx.api.handleError(params, "No 'placeholder' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/documenttemplates/portal/byplaceholder/" + encodeURIComponent(params.placeholder) + "/notapproved", doneCallback, failCallback);
        },
        getAllByPlaceholder: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.placeholder) {
                dsmx.api.handleError(params, "No 'placeholder' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/documenttemplates/portal/byplaceholder/" + encodeURIComponent(params.placeholder) + "/all", doneCallback, failCallback);
        },
        getByPlaceholder: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.placeholder) {
                dsmx.api.handleError(params, "No 'placeholder' parameter provided.");
                return;
            }

            if (dsmx.api.isDefined(params.isApproved) && params.isApproved != null) {
                if (params.isApproved) {
                    dsmx.api.documentTemplates.portal.getApprovedByPlaceholder(params, doneCallback, failCallback);

                } else {
                    dsmx.api.documentTemplates.portal.getNotApprovedByPlaceholder(params, doneCallback, failCallback);
                }
            } else {
                dsmx.api.documentTemplates.portal.getAllByPlaceholder(params, doneCallback, failCallback);
            }
        },
        getApprovedByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/documenttemplates/portal/bycategory/" + encodeURIComponent(params.categoryName) + "/approved", doneCallback, failCallback);
        },
        getNotApprovedByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/documenttemplates/portal/bycategory/" + encodeURIComponent(params.categoryName) + "/notapproved", doneCallback, failCallback);
        },
        getAllByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            dsmx.api.core.get("/api/documenttemplates/portal/bycategory/" + encodeURIComponent(params.categoryName) + "/all", doneCallback, failCallback);
        },
        getByCategory: function (params, doneCallback, failCallback) {
            if (!params) {
                throw "No params provided.";
            }

            if (!params.categoryName) {
                dsmx.api.handleError(params, "No 'categoryName' parameter provided.");
                return;
            }

            if (dsmx.api.isDefined(params.isApproved) && params.isApproved != null) {
                if (params.isApproved) {
                    dsmx.api.documentTemplates.portal.getApprovedByCategory(params, doneCallback, failCallback);
                } else {
                    dsmx.api.documentTemplates.portal.getNotApprovedByCategory(params, doneCallback, failCallback);
                }
            } else {
                dsmx.api.documentTemplates.portal.getAllByCategory(params, doneCallback, failCallback);
            }
        }
    };

    //#endregion "dsmx.api.documentTemplates"


    //#region dsmx.api.smartserver
    dsmx.model.smartServer = {
    };
    dsmx.model.smartServer.createModel = {
    };
    dsmx.model.smartServer.createModel.create = function () {
        return {
            name: "",
            displayName: ""
        };
    };

    dsmx.model.smartServer.renderModel = {
        createInstance: function () {
            var r = {
            };

            r.campaignId = 0;
            r.documentName = "Document";
            r.documentXml = null;
            r.watermark = null;
            r.staticFields = {
            };
            r.parameters = {
            };
            r.record = {
            };

            return r;
        },
        validate: function (model, failCallback) {
            if (dsmx.api.isNotSet(model, "You need to provide a create model. You can create one by calling dsmx.model.smartServer.renderModel.createInstance() .", failCallback)) {
                return false;
            }

            if (dsmx.api.isNotSet(model.documentName, "You need to set the 'documentName' property.", failCallback)) {
                return false;
            }

            return true;
        }
    };


    dsmx.model.smartServer.temporaryStorage = {
    };
    dsmx.model.smartServer.temporaryStorage.create = {
        columns: [
            {
                name: "temporaryStorageId", displayName: "Temporary Storage Id", type: "string", isEditable: true
            },
            {
                name: "smartServerTemplateName", displayName: "Smart Server Template Name", type: "string", isEditable: true
            },
            { name: "documentName", displayName: "Document Name", type: "string", isEditable: true }
        ],
        getDisplayValue: dsmx.model.getDisplayValue,
        createInstance: function () {
            var r = {
            };

            r.temporaryStorageId = null;
            r.smartServerTemplateName = null;
            r.documentName = "Document";

            return r;
        },
        validate: function (createModel, failCallback) {
            if (dsmx.api.isNotSet(createModel, "You need to provide a create model. You can create one by calling dsmx.model.smartServer.temporaryStorage.create.createInstance() .", failCallback)) {
                return false;
            }

            if (dsmx.api.isNotSet(createModel.temporaryStorageId, "You need to set the 'temporaryStorageId' property.", failCallback)) {
                return false;
            }

            //name oder id ist zulässig, also später checken
            //if (dsmx.api.isNotSet(createModel.smartServerTemplateName, "You need to set the 'smartServerTemplateName' property.", failCallback)) {
            //    return false;
            //}

            if (dsmx.api.isNotSet(createModel.documentName, "You need to set the 'documentName' property.", failCallback)) {
                return false;
            }

            if (dsmx.api.isNotValidAccountId(createModel.smartServerAccountId, "You need provide a valid 'smartServerAccountId'.", failCallback)) {
                return false;
            }

            return true;
        }
    };

    dsmx.api.smartServer.createDocumentTemplate = function (createModel, doneCallback, failCallback) {
        var json;

        json = JSON.stringify(createModel);
        dsmx.api.core.postJson("/api/smartserver/createDocumentTemplate", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.deleteDocumentTemplate = function (templateName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/smartserver/deleteDocumentTemplate/" + encodeURIComponent(templateName), doneCallback, failCallback);
    };

    dsmx.api.smartServer.createMigrationPackage = function (model, doneCallback, failCallback) {
        var json;

        json = JSON.stringify(model);
        dsmx.api.core.postJson("/api/smartserver/createmigrationpackage", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.exportDesign = function (model, doneCallback, failCallback) {
        var json;

        json = JSON.stringify(model);
        dsmx.api.core.postJson("/api/smartserver/exportdesign", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.getMigrationPackageCreationStatus = function (statusId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/smartserver/getmigrationpackagecreationstatus/" + statusId, doneCallback, failCallback);
    };

    dsmx.api.smartServer.migrate = function (migrateModel, doneCallback, failCallback) {
        var json;

        json = JSON.stringify(migrateModel);
        dsmx.api.core.postJson("/api/smartserver/migrate", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.getMigrationStatus = function (statusId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/smartserver/getmigrationstatus/" + statusId, doneCallback, failCallback);
    };

    dsmx.api.smartServer.loadDocument = function (params, doneCallback, failCallback) {
        var documentName;

        if (params && params.documentName) {
            documentName = params.documentName;
        } else {
            documentName = "Document";
        }

        dsmx.api.core.get("/api/smartserver/document/" + encodeURIComponent(documentName) + "/load", doneCallback, failCallback);
    };

    dsmx.api.smartServer.loadDocumentById = function (params, doneCallback, failCallback) {
        if (dsmx.api.isNotDefined(params, "You need to provide 'params'.", failCallback)) {
            return;
        }

        if (dsmx.api.isNotInteger(params.documentId, "params.documentId must be an integer.", failCallback)) {
            return;
        }

        dsmx.api.core.get("/api/smartserver/document/" + params.documentId + "/load", doneCallback, failCallback);
    };

    dsmx.api.smartServer.loadDocumentByNameAndId = function (params, doneCallback, failCallback) {
        var documentName;

        if (dsmx.api.isNotDefined(params, "You need to provide 'params'.", failCallback)) {
            return;
        }

        if (params && params.documentName) {
            documentName = params.documentName;
        } else {
            documentName = "Document";
        }

        if (dsmx.api.isNotInteger(params.campaignId, "params.campaignId must be an integer.", failCallback)) {
            return;
        }

        dsmx.api.core.get("/api/smartserver/loadsmartcampaigndocument/" + params.campaignId + "/" + encodeURIComponent(documentName) + "/" + params.documentId, doneCallback, failCallback);
    };

    dsmx.api.smartServer.loadThemeDocument = function (params, doneCallback, failCallback) {
        var documentName;

        if (dsmx.api.isNotDefined(params, "You need to provide 'params'.", failCallback)) {
            return;
        }

        if (dsmx.api.isNotInteger(params.campaignId, "params.campaignId must be an integer.", failCallback)) {
            return;
        }

        dsmx.api.core.get("/api/smartserver/loadThemeDocument/" + params.campaignId + "/" + encodeURIComponent(params.themeName) + "/" + encodeURIComponent(params.documentName), doneCallback, failCallback);
    };

    dsmx.api.smartServer.loadVersions = function (params, doneCallback, failCallback) {
        if (dsmx.api.isNotDefined(params, "You need to provide 'params'.", failCallback)) {
            return;
        }

        if (dsmx.api.isNotSet(params.documentName, "params.documentName must be set.", failCallback)) {
            return;
        }

        dsmx.api.core.get("/api/smartserver/document/" + encodeURIComponent(params.documentName) + "/versions", doneCallback, failCallback);
    };

    dsmx.api.smartServer.loadDocumentVersions = function (params, doneCallback, failCallback) {
        if (dsmx.api.isNotDefined(params, "You need to provide 'params'.", failCallback)) {
            return;
        }

        if (dsmx.api.isNotSet(params.campaignName, "params.campaignName must be set.", failCallback)) {
            return;
        }

        if (dsmx.api.isNotSet(params.documentName, "params.documentName must be set.", failCallback)) {
            return;
        }

        dsmx.api.core.get("/api/smartserver/document/" + encodeURIComponent(params.campaignName) + "/" + encodeURIComponent(params.documentName) + "/versions", doneCallback, failCallback);
    };

    dsmx.api.smartServer.loadDocumentVersion = function (params, doneCallback, failCallback) {
        if (dsmx.api.isNotDefined(params, "You need to provide 'params'.", failCallback)) {
            return;
        }

        if (dsmx.api.isNotSet(params.documentName, "params.documentName must be set.", failCallback)) {
            return;
        }

        if (dsmx.api.isNotInteger(params.version, "params.version must be an integer.", failCallback)) {
            return;
        }

        dsmx.api.core.get("/api/smartserver/document/" + encodeURIComponent(params.documentName) + "/load/version/" + params.version, doneCallback, failCallback);
    };

    dsmx.api.smartServer.loadCampaignDocumentVersion = function (params, doneCallback, failCallback) {
        if (dsmx.api.isNotDefined(params, "You need to provide 'params'.", failCallback)) {
            return;
        }

        if (dsmx.api.isNotSet(params.campaignName, "params.campaignName must be set.", failCallback)) {
            return;
        }

        if (dsmx.api.isNotSet(params.documentName, "params.documentName must be set.", failCallback)) {
            return;
        }

        if (dsmx.api.isNotInteger(params.version, "params.version must be an integer.", failCallback)) {
            return;
        }

        dsmx.api.core.get("/api/smartserver/document/" + encodeURIComponent(params.campaignName) + "/" + encodeURIComponent(params.documentName) + "/load/version/" + params.version, doneCallback, failCallback);
    };

    dsmx.api.smartServer.saveDocument = function (saveModel, doneCallback, failCallback) {
        var json;

        //if (!dsmx.model.smartServer.temporaryStorage.create.validate(createModel, failCallback)) {
        //    return;
        //}

        json = JSON.stringify(saveModel);
        dsmx.api.core.postJson("/api/smartserver/document/save", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.renameDocument = function (renameModel, doneCallback, failCallback) {
        var json;

        //if (!dsmx.model.smartServer.temporaryStorage.create.validate(createModel, failCallback)) {
        //    return;
        //}

        json = JSON.stringify(renameModel);
        dsmx.api.core.postJson("/api/smartserver/document/rename", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.saveCampaignDocument = function (saveModel, doneCallback, failCallback) {
        var json;

        //if (!dsmx.model.smartServer.temporaryStorage.create.validate(createModel, failCallback)) {
        //    return;
        //}

        json = JSON.stringify(saveModel);
        dsmx.api.core.postJson("/api/smartserver/document/savedocument", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.saveCampaign = function (saveModel, doneCallback, failCallback) {
        var json;

        //if (!dsmx.model.smartServer.temporaryStorage.create.validate(createModel, failCallback)) {
        //    return;
        //}

        json = JSON.stringify(saveModel);
        dsmx.api.core.postJson("/api/smartserver/campaign/save", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.renderProofPdf = function (model, doneCallback, failCallback) {
        var json;

        json = JSON.stringify(model);
        dsmx.api.core.postJson("/api/smartserver/document/renderproofpdf", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.renderProofPdfReturnStatus = function (model, doneCallback, failCallback) {
        var json;

        json = JSON.stringify(model);
        dsmx.api.core.postJson("/api/smartserver/document/renderproofpdf/returnstatus", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.getRenderDocumentStatus = function (key, doneCallback, failCallback) {
        dsmx.api.core.get("/api/smartserver/document/" + key + "/status", doneCallback, failCallback);
    };

    dsmx.api.smartServer.renderPrintPdf = function (model, doneCallback, failCallback) {
        var json;

        json = JSON.stringify(model);
        dsmx.api.core.postJson("/api/smartserver/document/renderprintpdf", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.loadDirectSmileSets = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/smartserver/loaddirectsmilesets", doneCallback, failCallback);
    };

    dsmx.api.smartServer.temporaryStorage = {
        e: {
        }
    };

    dsmx.api.smartServer.temporaryStorage.create = function (createModel, doneCallback, failCallback) {
        var json;

        if (!dsmx.model.smartServer.temporaryStorage.create.validate(createModel, failCallback)) {
            return;
        }

        json = JSON.stringify(createModel);
        dsmx.api.core.postJson("/api/smartserver/temporarystorage/create", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.temporaryStorage.copy = function (copyModel, doneCallback, failCallback) {
        var json;

        json = JSON.stringify(copyModel);
        dsmx.api.core.postJson("/api/smartserver/temporarystorage/copy", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.temporaryStorage.loadDocument = function (params, doneCallback, failCallback) {
        var documentName;

        if (params && params.documentName) {
            documentName = params.documentName;
        } else {
            documentName = "Document";
        }

        dsmx.api.core.get("/api/smartserver/temporarystorage/document/" + encodeURIComponent(documentName) + "/load", doneCallback, failCallback);
    };

    dsmx.api.smartServer.temporaryStorage.saveDocument = function (saveModel, doneCallback, failCallback) {
        var json;

        //if (!dsmx.model.smartServer.temporaryStorage.create.validate(createModel, failCallback)) {
        //    return;
        //}

        json = JSON.stringify(saveModel);
        dsmx.api.core.postJson("/api/smartserver/temporarystorage/document/save", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.temporaryStorage.saveCampaign = function (saveModel, doneCallback, failCallback) {
        var json;

        json = JSON.stringify(saveModel);
        dsmx.api.core.postJson("/api/smartserver/temporarystorage/campaign/save", json, doneCallback, failCallback);
    };

    dsmx.api.smartServer.convertCmykColors = function (params, doneCallback, failCallback) {
        var json;

        json = JSON.stringify(params);
        dsmx.api.core.postJsonNoSigning("/api/smartserver/convertCmykColors", json, doneCallback, failCallback);
    };

    //#endregion

    //#region dsmx.api.twitter
    dsmx.api.twitter.statusE = {
        succeeded: 1,
        requiresAuth: 2,
        invalidPin: 3,
        invalidImageUrl: 4,
        couldNotPost: 5,
        documentUnknown: 6,
        documentInvalidPage: 7,
        documentInvalidWidth: 8,
        documentNoPDFPreset: 9,
        appHasNoSettings: 10,
        appHasNoConsumerKey: 11,
        appHasNoConsumerSecret: 12,
        tweetTooLong: 13
    };

    dsmx.api.twitter.postImage = function (params, doneCallback, failCallback) {
        //{
        //    twitterPin = "",
        //    imageUrl = ""
        //}

        if (params == null) {
            throw "No params provided";
        } else if (!params.imageUrl) {
            throw "No image url provided.";
        }

        dsmx.api.core.postJson("/api/twitter/image", JSON.stringify(params), doneCallback, failCallback);
    };

    dsmx.api.twitter.postDocument = function (params, doneCallback, failCallback) {
        //{
        //  documentName: 'abc',
        //  pageNumber: 1,
        //  width: 200,
        //  useCache: false,
        //  pdfPresetName: 'Print'
        //};

        if (params == null) {
            throw "No params provided";
        }

        dsmx.api.core.postJson("/api/twitter/document", JSON.stringify(params), doneCallback, failCallback);
    };
    //#endregion

    //#region dsmx.api.applications
    dsmx.api.applications.apiE = {
        twitter: 1,
        googleDrivePicker: 2
    };

    dsmx.api.applications.admin.get = function (settings, doneCallback, failCallback) {
        //settings: {accountID: 0, api = dsmx.api.applications.apiE.twitter, appName: = ""}

        if (typeof settings == "undefined" || settings == null || typeof settings != "object") {
            settings = {
            };
        }

        if (!settings.accountID && !settings.api && !settings.appName) {
            dsmx.api.core.get("/api/applications/admin/get", doneCallback, failCallback);
        } else if (!settings.api && !settings.appName && settings.accountID) {
            dsmx.api.core.get("/api/applications/admin/get/" + parseInt(settings.accountID), doneCallback, failCallback);
        } else if (!settings.accountID && !settings.appName && settings.api) {
            dsmx.api.core.get("/api/applications/admin/get/" + encodeURIComponent(settings.api), doneCallback, failCallback);
        } else if (settings.accountID && !settings.appName && settings.api) {
            dsmx.api.core.get("/api/applications/admin/get/" + encodeURIComponent(settings.api) + "/" + parseInt(settings.accountID), doneCallback, failCallback);
        } else if (settings.accountID && settings.appName && settings.api) {
            dsmx.api.core.get("/api/applications/admin/get/" + encodeURIComponent(settings.api) + "/" + parseInt(settings.accountID) + "/" + encodeURIComponent(settings.appName), doneCallback, failCallback);
        } else {
            throw "Invalid settings object";
        }
    };

    dsmx.api.applications.admin.save = function (app, doneCallback, failCallback) {
        //app: {accountID: 0, api = dsmx.api.applications.apiE.twitter, name: = "", settings = ""}

        if (typeof app == "undefined" || app == null) {
            throw "No app object given";
        }

        dsmx.api.core.postJson("/api/applications/admin/save", JSON.stringify(app), doneCallback, failCallback);
    };

    dsmx.api.applications.admin.delete = function (app, doneCallback, failCallback) {
        //app: {accountID: 0, api = dsmx.api.applications.apiE.twitter, name: = ""}

        if (typeof app == "undefined" || app == null) {
            throw "No app object given.";
        } else if (!app.accountID) {
            throw "No accountID given.";
        } else if (!app.api) {
            throw "No api given.";
        } else if (!app.name) {
            throw "No application name given.";
        }

        dsmx.api.core.get("/api/applications/admin/delete/" + encodeURIComponent(app.api) + "/" + parseInt(app.accountID) + "/" + encodeURIComponent(app.name), doneCallback, failCallback);
    };

    dsmx.api.applications.get = function (settings, doneCallback, failCallback) {
        //settings: {api = dsmx.api.applications.apiE.twitter, appName: = ""}

        if (typeof settings == "undefined" || settings == null || typeof settings != "object") {
            settings = {
            };
        }

        if (!settings.api && !settings.appName) {
            dsmx.api.core.get("/api/applications/get", doneCallback, failCallback);
        } else if (!settings.appName && settings.api) {
            dsmx.api.core.get("/api/applications/get/" + encodeURIComponent(settings.api), doneCallback, failCallback);
        } else if (settings.appName && settings.api) {
            dsmx.api.core.get("/api/applications/get/" + encodeURIComponent(settings.api) + "/" + encodeURIComponent(settings.appName), doneCallback, failCallback);
        } else {
            throw "Invalid settings object";
        }
    };

    dsmx.api.applications.save = function (app, doneCallback, failCallback) {
        //app: {api = dsmx.api.applications.apiE.twitter, name: = "", settings = ""}

        if (typeof app == "undefined" || app == null) {
            throw "No app object given";
        }

        if (!app.api) {
            throw "No api given.";
        } else if (!app.name) {
            throw "No application name given";
        }

        var settings = app.settings;
        if (typeof settings == "object") {
            settings = {
                value: JSON.stringify(settings)
            };
        } else {
            settings = {
                value: "" + settings
            };
        }

        dsmx.api.core.postJson("/api/applications/save/" + encodeURIComponent(app.api) + "/" + encodeURIComponent(app.name), JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.applications.delete = function (app, doneCallback, failCallback) {
        //app: {api = dsmx.api.applications.apiE.twitter, name: = ""}

        if (typeof app == "undefined" || app == null) {
            throw "No app object given.";
        } else if (!app.api) {
            throw "No api given.";
        } else if (!app.accountID) {
            throw "No accountID given.";
        } else if (!app.name) {
            throw "No application name given.";
        }

        dsmx.api.core.get("/api/applications/delete/" + encodeURIComponent(app.api) + "/" + encodeURIComponent(app.name), doneCallback, failCallback);
    };

    //#endregion


    //#region dsmx.api.fonts
    dsmx.api.fonts.admin.importStatus = {
        failed: 0,
        queued: 1,
        conversion: 2,
        finished: 3
    };

    dsmx.api.fonts.admin.fileFormat = {
        unknown: -1,
        ttf: 1,
        otf: 2,
        woff: 3,
        woff2: 4,
        eot: 5
    };

    dsmx.api.fonts.admin.getProgress = function (uploadID, doneCallback, failCallback) {
        dsmx.api.core.get("/api/fonts/admin/progress/" + encodeURIComponent(uploadID), doneCallback, failCallback);
    };

    dsmx.api.fonts.admin.get = function (campaignName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/fonts/getAll/" + encodeURIComponent(campaignName), doneCallback, failCallback);
    };

    dsmx.api.fonts.admin.delete = function (settings, doneCallback, failCallback) {
        if (!settings) {
            throw "No settings object given.";
        } else if (!settings.campaignName) {
            throw "No campaign name given.";
        } else if (!settings.fontName) {
            throw "No font name given.";
        }

        dsmx.api.core.postJson("/api/fonts/admin/delete/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.fonts.get = function (campaignName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/fonts/getAll/" + encodeURIComponent(campaignName) + "/", doneCallback, failCallback);
    };

    //#endregion


    dsmx.api.dashboard.usersOverview = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/dashboard/users/overview", doneCallback, failCallback);
    };

    dsmx.api.dashboard.filteredUsersOverview = function (params, doneCallback, failCallback) {
        var model = {
            "startDate": params.startDate, "endDate": params.endDate
        };
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/dashboard/users/overview/filtered", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.export = function (params, doneCallback, failCallback) {
        var model = {
            "userId": params.userId, "filter": {
                "startDate": params.startDate, "endDate": params.endDate
            }
        };
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/dashboard/export", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.userOverview = function (params, doneCallback, failCallback) {
        dsmx.api.core.get("/api/dashboard/user/" + params.userId + "/overview", doneCallback, failCallback);
    };

    dsmx.api.dashboard.filteredUserOverview = function (params, doneCallback, failCallback) {
        var model = {
            "startDate": params.startDate, "endDate": params.endDate
        };
        var json = JSON.stringify(model);

        dsmx.api.core.postJson("/api/dashboard/user/" + params.userId + "/overview/filtered", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getEventCount = function (settings, doneCallback, failCallback) {
        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/geteventcount", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getUniqueEventCount = function (settings, doneCallback, failCallback) {
        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/getuniqueeventcount", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getEventContextCount = function (settings, doneCallback, failCallback) {
        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/geteventcontextcount", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getStandardEventCounts = function (settings, doneCallback, failCallback) {
        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/getstandardeventcounts", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getColumnCounts = function (settings, doneCallback, failCallback) {
        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/getcolumncounts", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getBucketCounts = function (settings, doneCallback, failCallback) {
        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/getbucketcounts", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getDashboardUserMetaData = function (settings, doneCallback, failCallback) {
        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/getdashboardusermetadata", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getCombined = function (settings, doneCallback, failCallback) {
        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/combined", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getDatabaseCounter = function (settings, doneCallback, failCallback) {
        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/databasecounter", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getSurveyStatistics = function (settings, doneCallback, failCallback) {
        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/surveystatistics", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getColumns = function (columnsRequest, doneCallback, failCallback) {
        //var columnsRequest = {
        //    database: {
        //        databaseName: "",
        //        databaseId: 0
        //    },
        //    chartName: ""
        //};

        var json = JSON.stringify(columnsRequest);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/getcolumns", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getRecords = function (query, doneCallback, failCallback) {
        //var query = {
        //    database: {
        //        databaseName: "",
        //        databaseId: 0
        //    },
        //    chartName: "",
        //    recordsPerPage: 20,
        //    currentPage: 1,
        //    filter: "",
        //    orderBy: [],
        //    orderByDescending: false,
        //    bucketGuid: "",
        //};

        var json = JSON.stringify(query);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/getrecords", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.exportDatabase = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    filter: null,
        //    orderBy: [],
        //    orderByDescending: false,
        //    columns: [],
        //    bucketGuid: null,
        //    fileFormat: "xlsx",
        //    testerMode: 0,
        //    database: {
        //        databaseName: ""
        //    },
        //    chartName: ""
        //};

        var json = JSON.stringify(settings);

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/exportdatabase", json, doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getDatabaseExportStatus = function (exportId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/dashboard/smartcampaign/exportdatabasestatus/" + encodeURIComponent(exportId), doneCallback, failCallback);
    };

    dsmx.api.dashboard.smartCampaign.getDataRelationStatistics = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    dataRelationName: "",//The name of the data relation, shortcut for special statistics:  "DASHBOARD_DEVICE_STATISTICS", "DASHBOARD_BROWSER_STATISTICS"
        //    labelField: "",//The name of the column that should be used as label for each value
        //    valueField: "",//The name of the column that should be used as value
        //    campaign: {//Optional, the campaign that should be given to the data relation
        //        campaignName: "",//Either name or id
        //        campaignId: 0,//Either name or id
        //    },
        //    database: {//The environment that should be used
        //        databaseName: "",//Either name or id
        //        databaseId: 0,//Either name or id
        //    },
        //    maxResults: 20//The maximum nuber of results that should be returned
        //};

        dsmx.api.core.postJson("/api/dashboard/smartcampaign/datarelationvalues", JSON.stringify(settings), doneCallback, failCallback);
    };

    //#region Extension Items
    //dsmx.api.extensionItems = { e: {} };
    //dsmx.api.extensionItems.admin = { e: {} };
    //dsmx.api.extensionItems.admin.categories = { e: {} };
    //dsmx.api.extensionItems.admin.items = { e: {} };
    //dsmx.api.extensionItems.admin.versions = { e: {} };
    //dsmx.api.extensionItems.categories = { e: {} };
    //dsmx.api.extensionItems.items = { e: {} };
    //dsmx.api.extensionItems.versions = { e: {} };

    dsmx.api.extensionItems.admin.categories.write = function (category, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/extensionitems/admin/categories/write", JSON.stringify(category), doneCallback, failCallback);
    };

    dsmx.api.extensionItems.admin.categories.delete = function (deleteModel, doneCallback, failCallback) {
        //var deleteModel =
        //{
        //    accountId: null,
        //    name: "Category1"
        //};

        if (!deleteModel || !deleteModel.name) {
            throw "No category name provided.";
        }

        dsmx.api.core.postJson("/api/extensionitems/admin/categories/delete", JSON.stringify(deleteModel), doneCallback, failCallback);
    };

    dsmx.api.extensionItems.admin.categories.getAll = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/extensionitems/admin/categories/getall", doneCallback, failCallback);
    };

    dsmx.api.extensionItems.admin.items.write = function (item, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/extensionitems/admin/items/write", JSON.stringify(item), doneCallback, failCallback);
    };

    dsmx.api.extensionItems.admin.items.delete = function (deleteModel, doneCallback, failCallback) {
        //var deleteModel =
        //{
        //    accountId: null,
        //    name: "Category1"
        //};

        if (!deleteModel || !deleteModel.name) {
            throw "No category name provided.";
        }

        dsmx.api.core.postJson("/api/extensionitems/admin/items/delete", JSON.stringify(deleteModel), doneCallback, failCallback);
    };

    dsmx.api.extensionItems.admin.items.getAll = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/extensionitems/admin/items/getall", doneCallback, failCallback);
    };

    dsmx.api.extensionItems.admin.versions.write = function (item, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/extensionitems/admin/versions/write", JSON.stringify(item), doneCallback, failCallback);
    };

    dsmx.api.extensionItems.admin.versions.delete = function (versionId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/extensionitems/admin/versions/delete/" + encodeURIComponent(versionId), doneCallback, failCallback);
    };

    dsmx.api.extensionItems.admin.versions.getAll = function (extensionItemId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/extensionitems/admin/versions/getall/" + encodeURIComponent(extensionItemId), doneCallback, failCallback);
    };
    //#endregion

    //#region dsmx.api.dbSync
    dsmx.api.dbSync.admin.getDataRelations = function (accountId, doneCallback, failCallback) {
        if (typeof accountId == "undefined") {
            throw "No account id provided.";
        }

        dsmx.api.core.get("/api/dbsync/datarelations/" + encodeURIComponent(parseInt(accountId)) + "/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.getDataRelationTables = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    type: "dataRelationType",
        //    settings: {
        //        userName: "someUserName",
        //        password: "password"
        //    },
        //    accountId: 3
        //};

        if (!settings || typeof settings.accountId == "undefined") {
            throw "No account id provided.";
        }

        dsmx.api.core.postJson("/api/dbsync/tables/" + encodeURIComponent(parseInt(settings.accountId)) + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.getDataRelationColumns = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    type: "dataRelationType",
        //    settings: {
        //        userName: "someUserName",
        //        password: "password"
        //    },
        //    accountId: 3,
        //    tableName: "someTable"
        //};

        if (!settings || typeof settings.accountId == "undefined") {
            throw "No account id provided.";
        } else if (!settings.tableName) {
            throw "No table name specified.";
        }

        dsmx.api.core.postJson("/api/dbsync/columns/" + encodeURIComponent(settings.tableName) + "/" + encodeURIComponent(parseInt(settings.accountId)) + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.getColumnMappings = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    type: "dataRelationType",
        //    settings: {
        //        userName: "someUserName",
        //        password: "password"
        //    },
        //    accountId: 3,
        //    tableName: "someTable"
        //    databaseName: "Some Database"
        //};

        if (!settings || typeof settings.accountId == "undefined") {
            throw "No account id provided.";
        } else if (!settings.tableName) {
            throw "No table name specified.";
        } else if (!settings.databaseName) {
            throw "No database name specified.";
        }

        dsmx.api.core.postJson("/api/dbsync/columnmappings/" + encodeURIComponent(settings.tableName) + "/" + encodeURIComponent(settings.databaseName) + "/" + encodeURIComponent(parseInt(settings.accountId)) + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.validateSyncSettings = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    type: "dataRelationType",
        //    settings: {
        //            userName: "someUserName",
        //            password: "password"
        //    },
        //    accountId: 3,
        //    tableName: "dataRelationtableName",
        //    databaseName: "databasename"
        //    lpLoginMode: "default",
        //    loginFieldPart1: "FirstName",
        //    loginFieldSeperator: ".",
        //    loginFieldPart2: "LastName",
        //    columnMappings: [
        //        { contactColumnName: "FirstName", dataSourceColumnName: "Firstname"},
        //        { contactColumnName: "Lastname", dataSourceColumnName: "Lastname" },
        //        { contactColumnName: "Birthday", dataSourceColumnName: "Birthdate" },
        //    ]
        //};

        if (!settings || typeof settings.accountId == "undefined") {
            throw "No account id provided.";
        } else if (!settings.tableName) {
            throw "No table name specified.";
        } else if (!settings.databaseName) {
            throw "No database name specified.";
        }

        dsmx.api.core.postJson("/api/dbsync/validatesettings/" + encodeURIComponent(parseInt(settings.accountId)) + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.startImport = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    type: "dataRelationType",
        //    settings: {
        //            userName: "someUserName",
        //            password: "password"
        //    },
        //    accountId: 3,
        //    tableName: "dataRelationtableName",
        //    databaseName: "databaseName"
        //    lpLoginMode: "default",
        //    loginFieldPart1: "FirstName",
        //    loginFieldSeperator: ".",
        //    loginFieldPart2: "LastName",
        //    columnMappings: [
        //        { contactColumnName: "FirstName", dataSourceColumnName: "Firstname"},
        //        { contactColumnName: "Lastname", dataSourceColumnName: "Lastname" },
        //        { contactColumnName: "Birthday", dataSourceColumnName: "Birthdate" },
        //    ]
        //};

        if (!settings || typeof settings.accountId == "undefined") {
            throw "No account id provided.";
        } else if (!settings.tableName) {
            throw "No table name specified.";
        } else if (!settings.databaseName) {
            throw "No database name specified.";
        }

        dsmx.api.core.postJson("/api/dbsync/import/" + encodeURIComponent(parseInt(settings.accountId)) + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.synchronize = function (settings, doneCallback, failCallback) {
        if (!settings || typeof settings.accountId == "undefined") {
            throw "No account id provided.";
        } else if (typeof settings.databaseName == "undefined") {
            throw "No database name provided.";
        }

        dsmx.api.core.get("/api/dbsync/sync/" + encodeURIComponent(settings.databaseName) + "/" + encodeURIComponent(parseInt(settings.accountId)) + "/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.getSyncStatus = function (syncKey, doneCallback, failCallback) {
        dsmx.api.core.get("/api/dbsync/syncstatus/" + encodeURIComponent(syncKey) + "/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.getAvailableSyncLogs = function (accountId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/dbsync/synclogs/" + parseInt(accountId) + "/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.getSyncLogDetail = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    processingKey: "",
        //    fileName: "",
        //    accountId: 10
        //};

        dsmx.api.core.postJson("/api/dbsync/logfiledetail/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.disableSync = function (settings, doneCallback, failCallback) {
        if (!settings || typeof settings.accountId == "undefined") {
            throw "No account id specified.";
        } else if (!settings.databaseName) {
            throw "No database name specified.";
        }

        dsmx.api.core.get("/api/dbsync/disablesync/" + encodeURIComponent(settings.databaseName) + "/" + encodeURIComponent(parseInt(settings.accountId)) + "/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.changeSettings = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    accountId: 0
        //    databaseName: "",
        //    relationFilter: "",
        //    parameters: {"Param1": "ParamValue1","Param2": "ParamValue2"},
        //    synchronizedFields: ["Column1", "Column2"],
        //    columnMappings: [{ "dataSourceColumnName": "SourceColumn1", "databaseColumnName": "DBColumn1" }, { "dataSourceColumnName": "SourceColumn2", "databaseColumnName": "DBColumn2" }],
        //    subscribedEvents: {"EventType1": true, "EventType2": false},
        //    relationDuplicateFilter: "",
        //    relationDuplicateFilterVersion: 0
        //};

        if (!settings || typeof settings.accountId == "undefined") {
            throw "No account id provided.";
        } else if (!settings.databaseName) {
            throw "No table name specified.";
        }

        dsmx.api.core.postJson("/api/dbsync/changesettings/" + encodeURIComponent(parseInt(settings.accountId)) + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.getSyncCounters = function (settings, donecallback, failecallback) {
        dsmx.api.core.postJson("/api/dbsync/synccounters/" + encodeURIComponent(parseInt(settings.accountId)) + "/", JSON.stringify(settings), doneCallback, failCallback);
    }

    dsmx.api.dbSync.admin.repeatFailedTask = function (settings, donecallback, failecallback) {
        var methodName = "repeatfailedtask";

        if (typeof settings.taskIds != "undefined") {
            methodName += "s";
        }

        dsmx.api.core.postJson("/api/dbsync/" + methodName + "/" + encodeURIComponent(parseInt(settings.accountId)) + "/", JSON.stringify(settings), doneCallback, failCallback);
    }

    dsmx.api.dbSync.admin.getFailedTasks = function (settings, donecallback, failecallback) {
        dsmx.api.core.postJson("/api/dbsync/getfailedtasks/" + encodeURIComponent(parseInt(settings.accountId)) + "/", JSON.stringify(settings), doneCallback, failCallback);
    }

    dsmx.api.dbSync.admin.deleteFailedTasks = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/dbsync/deletefailedtasks/" + encodeURIComponent(parseInt(settings.accountId)) + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.statusE = {
        queued: 0,
        processing: 1,
        finished: 2,
        failed: 3
    };
    dsmx.api.dbSync.admin.isSynchronized = function (settings, doneCallback, failCallback) {
        if (!settings || typeof settings.accountId == "undefined") {
            throw "No account id specified.";
        } else if (!settings.databaseName) {
            throw "No database name specified.";
        }

        dsmx.api.core.get("/api/dbsync/synchronized/" + encodeURIComponent(settings.databaseName) + "/" + encodeURIComponent(parseInt(settings.accountId)) + "/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.getDataRelations = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/dbsync/datarelations/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.getDataRelationTables = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    type: "dataRelationType",
        //    settings: {
        //        userName: "someUserName",
        //        password: "password"
        //    }
        //};

        dsmx.api.core.postJson("/api/dbsync/tables/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.getDataRelationColumns = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    type: "dataRelationType",
        //    settings: {
        //        userName: "someUserName",
        //        password: "password"
        //    },
        //    tableName: "someTable"
        //};

        if (!settings || !settings.tableName) {
            throw "No table name specified.";
        }

        dsmx.api.core.postJson("/api/dbsync/columns/" + encodeURIComponent(settings.tableName) + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.getColumnMappings = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    type: "dataRelationType",
        //    settings: {
        //        userName: "someUserName",
        //        password: "password"
        //    },
        //    tableName: "someTable"
        //    databaseName: "someDatabaseName"
        //};

        if (!settings || !settings.tableName) {
            throw "No table name specified.";
        } else if (!settings.databaseName) {
            throw "No database name specified";
        }

        dsmx.api.core.postJson("/api/dbsync/columnmappings/" + encodeURIComponent(settings.tableName) + "/" + encodeURIComponent(settings.databaseName) + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.validateSyncSettings = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    type: "dataRelationType",
        //    settings: {
        //            userName: "someUserName",
        //            password: "password"
        //    },
        //    tableName: "dataRelationtableName",
        //    databaseName: "databaseName"
        //    lpLoginMode: "default",
        //    loginFieldPart1: "FirstName",
        //    loginFieldSeperator: ".",
        //    loginFieldPart2: "LastName",
        //    columnMappings: [
        //        { contactColumnName: "FirstName", dataSourceColumnName: "Firstname"},
        //        { contactColumnName: "Lastname", dataSourceColumnName: "Lastname" },
        //        { contactColumnName: "Birthday", dataSourceColumnName: "Birthdate" },
        //    ]
        //};

        if (!settings || !settings.tableName) {
            throw "No table name specified.";
        } else if (!settings.databaseName) {
            throw "No database name specified.";
        }

        dsmx.api.core.postJson("/api/dbsync/validatesettings/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.startImport = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    type: "dataRelationType",
        //    settings: {
        //            userName: "someUserName",
        //            password: "password"
        //    },
        //    tableName: "dataRelationtableName",
        //    databaseName: "databaseName"
        //    lpLoginMode: "default",
        //    loginFieldPart1: "FirstName",
        //    loginFieldSeperator: ".",
        //    loginFieldPart2: "LastName",
        //    columnMappings: [
        //        { contactColumnName: "FirstName", dataSourceColumnName: "Firstname"},
        //        { contactColumnName: "Lastname", dataSourceColumnName: "Lastname" },
        //        { contactColumnName: "Birthday", dataSourceColumnName: "Birthdate" },
        //    ]
        //};

        if (!settings || !settings.tableName) {
            throw "No table name specified.";
        } else if (!settings.databaseName) {
            throw "No database name specified.";
        }

        dsmx.api.core.postJson("/api/dbsync/import/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.synchronize = function (databaseName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/dbsync/sync/" + encodeURIComponent(databaseName) + "/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.getSyncStatus = function (syncKey, doneCallback, failCallback) {
        dsmx.api.core.get("/api/dbsync/syncstatus/" + encodeURIComponent(syncKey) + "/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.getAvailableSyncLogs = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/dbsync/synclogs/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.isSynchronized = function (databaseName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/dbsync/synchronized/" + encodeURIComponent(databaseName) + "/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.disableSync = function (databaseName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/dbsync/disablesync/" + encodeURIComponent(databaseName) + "/", doneCallback, failCallback);
    };

    dsmx.api.dbSync.admin.getLogFileContent = function (settings, doneCallback, failCallback) {
        //var settings = {
        //  processingKey: "",
        //  accountId: 1
        //};

        dsmx.api.core.postJson("/api/dbsync/logfilecontent/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.getLogFileContent = function (settings, doneCallback, failCallback) {
        //var settings = {
        //  processingKey: "",
        //};

        dsmx.api.core.postJson("/api/dbsync/logfilecontent/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.getSyncLogDetail = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    processingKey: "",
        //    fileName: "",
        //};

        dsmx.api.core.postJson("/api/dbsync/logfiledetail/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.changeSettings = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    databaseName: "",
        //    relationFilter: "",
        //    parameters: {"Param1": "ParamValue1","Param2": "ParamValue2"},
        //    synchronizedFields: ["Column1", "Column2"],
        //    columnMappings: [{ "dataSourceColumnName": "SourceColumn1", "databaseColumnName": "DBColumn1" }, { "dataSourceColumnName": "SourceColumn2", "databaseColumnName": "DBColumn2" }],
        //    subscribedEvents: {"EventType1": true, "EventType2": false},
        //    relationDuplicateFilter: "",
        //    relationDuplicateFilterVersion: 0
        //};

        if (!settings || !settings.databaseName) {
            throw "No database name specified.";
        }

        dsmx.api.core.postJson("/api/dbsync/changesettings/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.getSyncCounters = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/dbsync/synccounters/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.deleteFailedTasks = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/dbsync/deletefailedtasks/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.repeatFailedTask = function (settings, doneCallback, failCallback) {
        var methodName = "repeatfailedtask";

        if (typeof settings.taskIds != "undefined") {
            methodName += "s";
        }

        dsmx.api.core.postJson("/api/dbsync/" + methodName + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.confirmAndRepeatFailedTasks = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/dbsync/confirmandrepeatfailedtask/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.dbSync.getFailedTasks = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/dbsync/getfailedtasks/", JSON.stringify(settings), doneCallback, failCallback);
    };

    //#endregion

    //#region dsmx.api.impositions
    dsmx.api.impositions.impositionType = {
        xml: 0,
        json: 1,
        file: 2
    };

    dsmx.api.impositions.admin.createViewModel = function (createOptions, doneCallback, failCallback) {
        if (!createOptions) {
            throw "No options given.";
        } else if (!createOptions.type) {
            createOptions.type = dsmx.api.impositions.impositionType.json;
        }

        if (createOptions.type != dsmx.api.impositions.impositionType.file || (!createOptions.accountId || parseInt(createOptions.accountId) <= 0)) {
            dsmx.api.impositions.createViewModel(createOptions, doneCallback, failCallback);
        } else {
            if (!createOptions.fileName || createOptions.fileName.length == 0) {
                throw "No imposition file name given.";
            }

            dsmx.api.core.get("/api/impositions/viewmodel/file/" + encodeURIComponent(createOptions.fileName) + "/" + encodeURIComponent(parseInt(createOptions.accountId)) + "/", doneCallback, failCallback);
        }
    };

    dsmx.api.impositions.admin.getAll = function (accountId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/impositions/getall/" + encodeURIComponent(accountId) + "/", doneCallback, failCallback);
    };

    dsmx.api.impositions.admin.create = function (createModel, doneCallback, failCallback) {
        //createmodel: {accountId: accountId} (uses defaults) or
        //{
        //    accountId: accountId,
        //    displayName: "",
        //    description: "",
        //    sheetWidth: "",
        //    sheetHeight: "",
        //    docWidth: "",
        //    docHeight: ""
        //    docPageCountPerRecord: 0
        //}

        if (!createModel || !createModel.accountId) {
            throw "No accountId given.";
        }

        dsmx.api.core.postJSON("/api/impositions/create/" + encodeURIComponent(createModel.accountId) + "/", JSON.stringify(createModel), doneCallback, failCallback);
    };

    dsmx.api.impositions.admin.get = function (options, doneCallback, failCallback) {
        //options: {
        //  fileName: "xyz.xml",
        //  accountId: 10
        //}

        if (!options) {
            throw "No options given.";
        } else if (!options.fileName) {
            throw "No filename given.";
        } else if (!options.accountId) {
            throw "No account id given.";
        }

        dsmx.api.core.get("/api/impositions/get/" + encodeURIComponent(options.fileName) + "/" + encodeURIComponent(options.accountId) + "/", doneCallback, failCallback);
    };

    dsmx.api.impositions.admin.getAllContents = function (accountId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/impositions/getallcontents/" + encodeURIComponent(accountId) + "/", doneCallback, failCallback);
    };

    dsmx.api.impositions.admin.save = function (imposition, doneCallback, failCallback) {
        if (!imposition) {
            throw "No imposition given.";
        } else if (!imposition.fileName) {
            throw "No file name given.";
        } else if (!imposition.accountId) {
            throw "No account id given.";
        }

        dsmx.api.core.postJson("/api/impositions/save/" + encodeURIComponent(imposition.fileName) + "/" + encodeURIComponent(imposition.accountId) + "/", JSON.stringify(imposition), doneCallback, failCallback);
    };

    dsmx.api.impositions.admin.delete = function (options, doneCallback, failCallback) {
        if (!options) {
            throw "No options given.";
        } else if (!options.fileName) {
            throw "No file name given.";
        } else if (!options.accountId) {
            throw "No account id given.";
        }

        dsmx.api.core.get("/api/impositions/delete/" + encodeURIComponent(options.fileName) + "/" + encodeURIComponent(options.accountId) + "/", doneCallback, failCallback);
    };

    dsmx.api.impositions.admin.updateDetails = function (options, doneCallback, failCallback) {
        var settings = {
            fileName: "",
            displayName: null,
            description: null
        };

        if (!options) {
            throw "No options given.";
        } else if (!options.fileName) {
            throw "No file name provided.";
        } else if (!options.accountId) {
            throw "No account id provided.";
        } else {
            if ((typeof options.displayName == "undefined" || options.displayName == null) && (typeof options.description == "undefined" || options.description == null)) {
                throw "Specify at least a display name or a description.";
            } else {
                settings.fileName = options.fileName;

                if (typeof options.displayName != "undefined" && options.displayName != null) {
                    settings.displayName = options.displayName;
                }

                if (typeof options.description != "undefined" && options.description != null) {
                    settings.description = options.description;
                }
            }
        }

        dsmx.api.core.postJson("/api/impositions/updateDetails/" + encodeURIComponent(options.accountId) + "/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.impositions.createViewModel = function (createOptions, doneCallback, failCallback) {
        if (!createOptions) {
            throw "No options given.";
        } else if (!createOptions.type) {
            createOptions.type = dsmx.api.impositions.impositionType.json;
        }

        switch (createOptions.type) {
            case dsmx.api.impositions.impositionType.json:
                if (!createOptions.json) {
                    throw "No json data for imposition given.";
                }

                var model = null;

                if (typeof (createOptions.json) == "object") {
                    model = JSON.stringify(createOptions.json);
                } else {
                    model = "" + createOptions.json;
                }

                dsmx.api.core.postJson("/api/impositions/viewmodel/json", model, doneCallback, failCallback);
                break;

            case dsmx.api.impositions.impositionType.xml:
                if (!createOptions.xml || createOptions.xml.length == 0) {
                    throw "No xml data for imposition given.";
                }

                var model = {
                    imposition: createOptions.xml
                };

                dsmx.api.core.postJson("/api/impositions/viewmodel/xml", model, doneCallback, failCallback);
                break;

            case dsmx.api.impositions.impositionType.file:
                if (!createOptions.fileName || createOptions.fileName.length == 0) {
                    throw "No imposition file name given.";
                }

                dsmx.api.core.get("/api/impositions/viewmodel/file/" + encodeURIComponent(createOptions.fileName) + "/", doneCallback, failCallback);
                break;

            default:
                throw "Unknown imposition representation type.";
        }
    };

    dsmx.api.impositions.getAll = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/impositions/getall/", doneCallback, failCallback);
    };

    dsmx.api.impositions.create = function (createModel, doneCallback, failCallback) {
        //createmodel: null (uses defaults) or
        //{
        //    displayName: "",
        //    description: "",
        //    sheetWidth: "",
        //    sheetHeight: "",
        //    docWidth: "",
        //    docHeight: ""
        //    docPageCountPerRecord: 0
        //}

        dsmx.api.core.postJson("/api/impositions/create/", JSON.stringify(createModel), doneCallback, failCallback);
    };

    dsmx.api.impositions.get = function (fileName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/impositions/get/" + encodeURIComponent(fileName) + "/", doneCallback, failCallback);
    };

    dsmx.api.impositions.getAllContents = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/impositions/getallcontents/", doneCallback, failCallback);
    };

    dsmx.api.impositions.save = function (imposition, doneCallback, failCallback) {
        if (!imposition) {
            throw "No imposition given.";
        } else if (!imposition.fileName) {
            throw "No file name given";
        }

        dsmx.api.core.postJson("/api/impositions/save/" + encodeURIComponent(imposition.fileName) + "/", JSON.stringify(imposition), doneCallback, failCallback);
    };

    dsmx.api.impositions.delete = function (fileName, doneCallback, failCallback) {
        dsmx.api.core.get("/api/impositions/delete/" + encodeURIComponent(fileName) + "/", doneCallback, failCallback);
    };

    dsmx.api.impositions.updateDetails = function (options, doneCallback, failCallback) {
        var settings = {
            fileName: "",
            displayName: null,
            description: null
        };

        if (!options) {
            throw "No options given.";
        } else if (!options.fileName) {
            throw "No file name provided.";
        } else {
            if ((typeof options.displayName == "undefined" || options.displayName == null) && (typeof options.description == "undefined" || options.description == null)) {
                throw "Specify at least a display name or a description.";
            } else {
                settings.fileName = options.fileName;

                if (typeof options.displayName != "undefined" && options.displayName != null) {
                    settings.displayName = options.displayName;
                }

                if (typeof options.description != "undefined" && options.description != null) {
                    settings.description = options.description;
                }
            }
        }

        dsmx.api.core.postJson("/api/impositions/updateDetails/", JSON.stringify(settings), doneCallback, failCallback);
    };

    //#endregion

    //#region dsmx.api.serverSettings
    dsmx.api.serverSettings.getMailServers = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/serversettings/getmailservers/", doneCallback, failCallback);
    };

    dsmx.api.serverSettings.getSettings = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/serversettings/getsettings/", doneCallback, failCallback);
    };

    dsmx.api.serverSettings.saveSettings = function (settings, doneCallback, failCallback) {
        dsmx.api.core.postJson("/api/serversettings/savesettings", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.serverSettings.getAvailableMailTemplates = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/serversettings/availablemailtemplates", doneCallback, failCallback);
    };

    //#endregion

    dsmx.api.contacts.statistics.getHourly = function (hourlyModel, doneCallback, failCallback) {
        var json;

        if (dsmx.api.isNotSet(hourlyModel, "You need to provide a model.", failCallback)) {
            return false;
        }

        if (dsmx.api.isNotSet(hourlyModel.eventTypes, "You need to provide the event types you are interested in. Please set the property 'eventTypes'.", failCallback)) {
            return false;
        }

        if (dsmx.api.isNotArray(hourlyModel.eventTypes, "You need to provide the event types you are interested in as array. Please set the array 'eventTypes'.", failCallback)) {
            return false;
        }

        json = JSON.stringify(hourlyModel);
        dsmx.api.core.postJson("/api/contacts/statistics/hourly", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.statistics.getDaily = function (dailyModel, doneCallback, failCallback) {
        var json;

        if (dsmx.api.isNotSet(dailyModel, "You need to provide a model.", failCallback)) {
            return false;
        }

        if (dsmx.api.isNotSet(dailyModel.startDate, "You need to provide a start date. Please set the property 'startDate'.", failCallback)) {
            return false;
        }

        if (dsmx.api.isNotSet(dailyModel.endDate, "You need to provide an end date. Please set the property 'endDate'.", failCallback)) {
            return false;
        }

        if (dsmx.api.isNotSet(dailyModel.eventTypes, "You need to provide the event types you are interested in. Please set the property 'eventTypes'.", failCallback)) {
            return false;
        }

        if (dsmx.api.isNotArray(dailyModel.eventTypes, "You need to provide the event types you are interested in as array. Please set the array 'eventTypes'.", failCallback)) {
            return false;
        }

        json = JSON.stringify(dailyModel);
        dsmx.api.core.postJson("/api/contacts/statistics/daily", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.statistics.getCombined = function (combinedModel, doneCallback, failCallback) {
        var json;

        if (dsmx.api.isNotSet(combinedModel, "You need to provide a model.", failCallback)) {
            return false;
        }

        if (dsmx.api.isNotSet(combinedModel.startDate, "You need to provide a start date. Please set the property 'startDate'.", failCallback)) {
            return false;
        }

        if (dsmx.api.isNotSet(combinedModel.endDate, "You need to provide an end date. Please set the property 'endDate'.", failCallback)) {
            return false;
        }

        if (dsmx.api.isNotSet(combinedModel.eventTypes, "You need to provide the event types you are interested in. Please set the property 'eventTypes'.", failCallback)) {
            return false;
        }

        if (dsmx.api.isNotArray(combinedModel.eventTypes, "You need to provide the event types you are interested in as array. Please set the array 'eventTypes'.", failCallback)) {
            return false;
        }

        json = JSON.stringify(combinedModel);
        dsmx.api.core.postJson("/api/contacts/statistics/combined", json, doneCallback, failCallback);
    };

    dsmx.api.contacts.statistics.getCounter = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/statistics/counter", doneCallback, failCallback);
    };

    dsmx.api.contacts.unsubscribers.export = function (settings, doneCallback, failCallback) {
        //settings: {
        //format: "csv"
        //columns: ["column1,column2"] or null or empty
        //}

        dsmx.api.core.postJson("/api/contacts/unsubscribers/export", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.contacts.unsubscribers.statusE = {
        unknown: -1,
        error: 0,
        queued: 1,
        processing: 2,
        finished: 3
    };

    dsmx.api.contacts.unsubscribers.status = function (key, doneCallback, failCallback) {
        key = ("" + key);

        dsmx.api.core.get("/api/contacts/unsubscribers/status/" + encodeURIComponent(key), doneCallback, failCallback);
    };

    dsmx.api.contacts.unsubscribers.get = function (parameters, doneCallback, failCallback) {
        //Params: {currentPage: 1, resultsPerPage: 2}

        if (!parameters) {
            throw "No parameters given.";
        } else if (!parameters.currentPage) {
            throw "No currentPage property given.";
        } else if (!parameters.resultsPerPage) {
            throw "No resultsPerPage property given.";
        }

        dsmx.api.core.get("/api/contacts/unsubscribers/get/" + encodeURIComponent(parameters.currentPage) + "/" + encodeURIComponent(parameters.resultsPerPage), doneCallback, failCallback);
    };

    dsmx.api.contacts.unsubscribers.count = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/contacts/unsubscribers/count", doneCallback, failCallback);
    };

    dsmx.api.contacts.export = function (settings, doneCallback, failCallback) {
        //settings: {
        //  format: "csv",                    Valid: csv, xls, xlsx, default csv
        //  columns: ["column1","column2"]    optional
        //  wheres: []                        optional, format: filter wheres
        //}

        dsmx.api.core.postJson("/api/contacts/export/", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.contacts.exportStatus = function (exportId, doneCallback, failCallback) {
        //settings: {
        //format: "csv"
        //columns: ["column1,column2"] or null or empty
        //}

        dsmx.api.core.get("/api/contacts/exportstatus/" + encodeURIComponent(exportId), doneCallback, failCallback);
    };



    dsmx.api.buckets.getAvailableFilters = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/filters", doneCallback, failCallback);
    };

    dsmx.api.buckets.getAvailableEventFilters = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/eventfilters", doneCallback, failCallback);
    };

    dsmx.api.buckets.getAvailableActions = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/actions", doneCallback, failCallback);
    };

    dsmx.api.buckets.getAvailableDataUpdaters = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/dataupdaters", doneCallback, failCallback);
    };

    dsmx.api.buckets.getAvailableCombiners = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/combiners", doneCallback, failCallback);
    };

    dsmx.api.buckets.getEntityInfo = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/entityinfo", doneCallback, failCallback);
    };

    dsmx.api.buckets.getDatabases = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/databases", doneCallback, failCallback);
    };

    dsmx.api.buckets.getWorkflows = function (leadsTableId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/workflows/" + leadsTableId, doneCallback, failCallback);
    };

    dsmx.api.buckets.getWorkflowsForCampaign = function (params, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/workflows/" + params.leadsTableId + "/" + params.campaignId, doneCallback, failCallback);
    };

    dsmx.api.buckets.getWorkflowBuckets = function (leadsTableId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/database/" + leadsTableId + "/workflowbuckets", doneCallback, failCallback);
    };

    dsmx.api.buckets.getWorkflowBucketsForCampaign = function (params, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/database/" + params.leadsTableId + "/campaign/" + params.campaignId + "/workflowbuckets", doneCallback, failCallback);
    };

    dsmx.api.buckets.getWorkflowEntities = function (workflowGuid, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/entities/" + workflowGuid, doneCallback, failCallback);
    };

    dsmx.api.buckets.getWorkflowConnections = function (workflowGuid, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/connections/" + workflowGuid, doneCallback, failCallback);
    };

    dsmx.api.buckets.getValidColumns = function (params, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/getvalidcolumns/" + params.workflowGuid + "/" + params.entityGuid, doneCallback, failCallback);
    };

    dsmx.api.buckets.getUiParameters = function (entityGuid, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/getuiparameters/" + entityGuid, doneCallback, failCallback);
    };

    dsmx.api.buckets.getAvailableEMails = function (campaignId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/" + campaignId + "/getavailableemails", doneCallback, failCallback);
    };

    dsmx.api.buckets.getAvailableSms = function (campaignId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/" + campaignId + "/getavailablesms", doneCallback, failCallback);
    };

    dsmx.api.buckets.getAvailablePages = function (campaignId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/" + campaignId + "/getavailablepages", doneCallback, failCallback);
    };

    dsmx.api.buckets.getAvailableDocuments = function (campaignId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/" + campaignId + "/getAvailableDocuments", doneCallback, failCallback);
    };

    dsmx.api.buckets.getAvailableMedia = function (campaignId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/" + campaignId + "/getAvailableMedia", doneCallback, failCallback);
    };

    dsmx.api.buckets.loadDataSources = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/buckets/loadDataSources", doneCallback, failCallback);
    };

    dsmx.api.svg.info = function (params, doneCallback, failCallback) {
        var campaignPart;
        var imageName;

        if (!isAssigned(params)) {
            throw "No params provided.";
        }

        if (!isAssigned(params.campaignName) && !isAssigned(params.campaignId)) {
            throw "No campaignName/campaignId provided.";
        }

        if (!isAssigned(params.imageName)) {
            throw "No imageName provided.";
        }

        if (isAssigned(params.campaignName)) {
            campaignPart = params.campaignName;
        } else {
            campaignPart = params.campaignId;
        }

        imageName = params.imageName;
        dsmx.api.core.getNoSigning("/api/svg/" + campaignPart + "/" + encodeURIComponent(imageName) + "/info", doneCallback, failCallback);
    };

    dsmx.api.translations.get = function (query, doneCallback, failCallback) {
        //var query = {
        //    filter: null,
        //    orderBy: ["Column1", "Column2"],
        //    perPage: 0,
        //    page: 0,
        //    languages: ["en", "en-GB", "en-US"],
        //    campaign: {
        //        campaignName: "",//Campaign name or campaign id
        //        campaignId: 0,//Campaign name or campaign id
        //    }
        //};

        dsmx.api.core.postJson("/api/translations/get", JSON.stringify(query), doneCallback, failCallback);
    };

    dsmx.api.translations.set = function (translation, doneCallback, failCallback) {
        //var translation = {
        //    "key": "myFirstTranslation",
        //    "translations": {
        //        "en": "English translation",
        //        "en-US": "US english translation",
        //        "de": "Deutsche Übersetzung"
        //    },
        //    campaign: {
        //        campaignName: "",//Campaign name or campaign id
        //        campaignId: 0,//Campaign name or campaign id
        //    }
        //};

        dsmx.api.core.postJson("/api/translations/set", JSON.stringify(translation), doneCallback, failCallback);
    };

    dsmx.api.translations.delete = function (translations, doneCallback, failCallback) {
        //var translations = {
        //    keys: ["Key1","Key2","Key3"]
        //    campaign: {
        //        campaignName: "",//Campaign name or campaign id
        //        campaignId: 0,//Campaign name or campaign id
        //    }
        //};

        dsmx.api.core.postJson("/api/translations/delete", JSON.stringify(translations), doneCallback, failCallback);
    };

    dsmx.api.translations.export = function (exportSettings, doneCallback, failCallback) {
        //var exportSettings = {
        //    exportAsCsv: false,
        //    campaign: {
        //        campaignName: "",//Campaign name or campaign id
        //        campaignId: 0,//Campaign name or campaign id
        //    }
        //};

        dsmx.api.core.postJson("/api/translations/export", JSON.stringify(exportSettings), doneCallback, failCallback);
    };

    dsmx.api.translations.assignLanguagesToCampaign = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    languages: ["en", "en-US"],
        //    campaign: {
        //        campaignName: "",//Campaign name or campaign id
        //        campaignId: 0,//Campaign name or campaign id
        //    }
        //};

        dsmx.api.core.postJson("/api/translations/assignlanguagestocampaign", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.translations.removeLanguagesFromCampaign = function (settings, doneCallback, failCallback) {
        //var settings = {
        //    languages: ["en", "en-US"],
        //    campaign: {
        //        campaignName: "",//Campaign name or campaign id
        //        campaignId: 0,//Campaign name or campaign id
        //    }
        //};

        dsmx.api.core.postJson("/api/translations/removelanguagesfromcampaign", JSON.stringify(settings), doneCallback, failCallback);
    };

    dsmx.api.translations.exportStatus = function (exportId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/translations/exportstatus/" + encodeURIComponent(exportId), doneCallback, failCallback);
    };

    dsmx.api.translations.importStatus = function (importId, doneCallback, failCallback) {
        dsmx.api.core.get("/api/translations/importstatus/" + encodeURIComponent(importId), doneCallback, failCallback);
    };

    dsmx.api.translations.supportedLanguages = function (doneCallback, failCallback) {
        dsmx.api.core.get("/api/translations/supportedlanguages/", doneCallback, failCallback);
    };

    dsmx.api.core.generatePostMethods(dsmx.api.buckets,
        "/api/buckets/",
        [
            "loadInitializationData", "createWorkflow", "addBucket", "addExistingBucket", "addFilter", "addEventFilter", "addAction", "addCombiner", "connect", "disconnect", "deleteEntity",
            "setConnectionChannel", "configureEntity", "executeEntity", "deleteWorkflow", "setCoordinates", "startWorkflow", "stopWorkflow", "hideWorkflowRootDataSource",
            "showWorkflowRootDataSource", "addOrUpdateExecutionTime", "setExecutionStrategy", "setEntityName", "readExecutionDates", "getBucketCounts",
            "readWorkflowColumns", "readEntityColumns", "readValidEntityColumns", "addDataUpdater", "deleteExecutionDate", "readSourceConnections", "addGoogleDrive", "deleteGoogleDrive", "updateGoogleDrive", "readGoogleDrives", "readGoogleDriveDirectories",
            "setConnectionDelay", "setWorkflowName", "addCustomerToBucket", "removeCustomerFromBucket", "workflowsOverview", "createStandardWorkflow", "loadWorkflowsFromDsmi",
            "loadWorkflowCampaignMappings", "readEntityErrors", "setIsOnHoldValue", "adjustWorkflowForDsf", "checkWorkflowForDsfCompatibility", "loadEventSources", "deleteTesterEvents"
        ]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.buckets,
        [
            "getEntityInfo", "getAvailableFilters", "getAvailableEventFilters", "getAvailableActions", "getAvailableCombiners",
            "getDatabases", "getAvailableDataUpdaters", "loadDataSources"
        ]);

    dsmx.api.core.createEasyWrappers(dsmx.api.buckets,
        [
            "getWorkflowEntities", "getWorkflowConnections", "getValidColumns", "getUiParameters",
            "getWorkflowBuckets", "getAvailableEMails", "getAvailableSms", "getAvailablePages", "getAvailableDocuments", "getWorkflows",
            "getWorkflowsForCampaign", "getWorkflowBucketsForCampaign", "getAvailableMedia"
        ]);


    dsmx.api.core.generatePostMethods(dsmx.api.smartCampaign, "/api/smartcampaign/",
        [
            "create", "savePages", "autolink", "getCampaigns", "getCampaign", "getCampaignByName", "loadUnsavedCommands", "save",
            "saveRawXml", "loadRawXml", "getSmartCanvasData", "getVersions", "getVersionData", "saveTheme", "deleteTheme", "saveDefaultForm",
            "convertImages", "exportCampaign", "importCampaign", "loadSmsConfiguration", "saveSmsConfiguration", "addMissingThemeResources",
            "validateAdminKeys"
        ]);

    dsmx.api.core.generatePostMethods(dsmx.api.campaigns, "/api/campaign/", ["getCampaignIdByName", "writeXml", "writeXmlMultiple",
        "readXml", "readXmlMultiple", "sendTestSms"]);

    dsmx.api.core.generatePostMethods(dsmx.api.campaigns, "/api/campaign/orders/",
        ["createJobOrder", "getCountForJobOrder", "executeJobOrder"]);

    dsmx.api.core.generatePostMethods(dsmx.api.smartServer, "/api/smartserver/", ["overwrite", "uploadOverwrite"]);
    dsmx.api.core.createEasyWrappers(dsmx.api.campaigns, ["changeSettings", "setLanguage", "getSettings", "getFirstContact"]);


    //#region "easy wrappers"
    //create wrapper methods for the .e namespace
    dsmx.api.core.createEasyWrappers(dsmx.api.admin,
        ["singleSignOn", "get50LogEntries", "getLogEntriesBySource", "createStatistics", "getStatisticsStatus"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.admin,
        ["getLogSources", "recycle", "gcCollect", "gcCompactCollect", "serverSettings"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.dashboard,
        ["userOverview", "filteredUsersOverview", "filteredUserOverview", "export"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.dashboard.smartCampaign,
        ["getEventCount", "getUniqueEventCount", "getStandardEventCounts", "getColumnCounts",
            "getBucketCounts", "getDashboardUserMetaData", "getCombined", "getDatabaseCounter",
            "getSurveyStatistics", "getColumns", "getRecords", "getEventContextCount", "exportDatabase", "getDatabaseExportStatus",
            "getDataRelationStatistics"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.dashboard,
        ["usersOverview"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.portalUserRoles,
        ["get"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.portalUsers,
        ["getUserInfo"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.accounts,
        ["getAbsoluteTaskStates"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.accounts,
        ["getAccountUsers", "deleteAccountUser", "deleteAccount", "getAccountDeletionStatus"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.contacts.unsubscribers,
        ["export", "status", "get"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.contacts.unsubscribers,
        ["count"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.contacts.statistics,
        ["getCombined", "getDaily", "getHourly"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.contacts.statistics,
        ["getCounter"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.campaigns.statistics,
        [
            "getDailyVisitorsCurrentMonth", "getDailyVisitorsPreviousMonth", "getHourlyVisitors", "getResponse",
            "getPagesOverview", "getColumnsCount", "getMailsOverview", "getHourlyMailOpener", "getDailyMailOpenerPreviousMonth",
            "getDailyMailOpenerCurrentMonth"
        ]);

    dsmx.api.core.createEasyWrappers(dsmx.api.campaigns,
        [
            "getStructure", "replaceDocument", "getDocumentReplaceStatus", "setThumbnailFromDocumentTemplate",
            "getWithStatistics", "deleteCampaign", "setFilter", "deleteFilter", "getAutomatedTasks", "getAutomatedTaskStates",
            "setAutomatedTaskExecutionDates", "executeTasksOnExecutionDates", "setDomain", "getStreamImageUrl", "getDocumentImportStatus",
            "writeXml", "writeXmlMultiple", "readXml", "writeNotes", "getCampaignIdByName", "getActivityAffectedRecordCount"
        ]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.campaigns,
        ["getAll", "getAllWithStatistics", "getImpositions", "getPdfPresets"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.contacts,
        ["getBatches", "getBatchContexts", "getAdditionalColumns"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.contacts,
        ["getWithQuery", "countWithQuery", "insert", "updateField", "update", "delete"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.login,
        ["getOneTimeToken"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.login, ["get", "create", "delete", "assign", "unassign", "resetPassword"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.login, ["getEnvironmentsAndCampaigns"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.campaignCategories,
        ["getAll"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.documentTemplates,
        ["getImportStatus", "continueImport", "getAvailableByPlaceholder", "getByCategory"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.images,
        ["getImportStatus", "getByCategory"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.resources,
        ["importFromURL", "getConversionStatusByAccountParams", "renameGroup", "changeGroup"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.campaignTemplates,
        ["getWithQuery", "connectCategory", "disconnectCategory", "getMetaData"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.campaignTemplates,
        ["get"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.twitter,
        ["postImage", "postDocument"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.applications, ["get", "save", "delete"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.applications.admin, ["get", "save", "delete"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.fonts.admin, ["getProgress", "get", "delete"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.fonts, ["get"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.svg, ["info"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.impositions.admin, ["createViewModel", "getAll", "create", "get", "getAllContents", "save", "delete", "updateDetails"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.impositions, ["createViewModel", "create", "get", "getAllContents", "save", "delete", "updateDetails"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.impositions, ["getAll"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.dbSync.admin, ["getDataRelations", "getDataRelationTables", "getDataRelationColumns", "getColumnMappings",
        "validateSyncSettings", "startImport", "synchronize", "getSyncStatus", "isSynchronized", "disableSync",
        "getAvailableSyncLogs", "getLogFileContent", "getSyncLogDetail", "changeSettings",
        "getSyncCounters", "repeatFailedTask", "getFailedTasks", "deleteFailedTasks"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.dbSync, ["getDataRelationTables", "getDataRelationColumns", "getColumnMappings", "validateSyncSettings", "startImport",
        "getSyncStatus", "synchronize", "isSynchronized", "disableSync", "getLogFileContent", "getSyncLogDetail", "changeSettings", "getSyncCounters", "deleteFailedTasks",
        "repeatFailedTask", "confirmAndRepeatFailedTasks", "getFailedTasks"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.dbSync, ["getDataRelations", "getAvailableSyncLogs"]);
    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.contacts.filter, ["getAll"]);


    dsmx.api.core.createEasyWrappers(dsmx.api.extensionItems.admin.categories, ["write", "delete"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.extensionItems.admin.categories, ["getAll"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.extensionItems.admin.items, ["write", "delete"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.extensionItems.admin.items, ["getAll"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.extensionItems.admin.versions, ["write", "delete", "getAll"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.database, [
        "getCampaignDatabase", "changeCampaignDatabase", "getDatabaseByName", "getDatabaseById",
        "createDatabase", "exportDatabase", "getDatabaseExportStatus", "getEventGroups",
        "getColumnMappings", "createColumnMapping", "deleteColumnMapping", "getColumnNames",
        "createDatabaseFromFile", "importDatabaseFromFile", "getCreationStatus", "getImportStatus", "exists", "delete",
        "getEnvironmentMetaData", "getInfo", "recreateLpLogins", "getLpLoginRecreationStatus",
        "getLpLogin", "changePasswordField"
    ]);

    dsmx.api.core.createEasyWrappers(dsmx.api.database.admin, [
        "refreshUploadSession", "getColumnMappings", "createColumnMapping", "deleteColumnMapping",
        "getColumnNames", "createDatabaseFromFile", "importDatabaseFromFile", "exists", "delete",
        "getEnvironmentMetaData", "getInfo", "changePasswordField"
    ]);

    //#region dsmx.api.smartserver

    dsmx.api.core.createEasyWrappers(dsmx.api.smartServer,
        ["createDocumentTemplate", "deleteDocumentTemplate", "loadDocument", "loadDocumentById", "loadDocumentByNameAndId", "loadVersions", "loadDocumentVersion", "saveDocument", "saveCampaignDocument",
            "saveCampaign", "renderProofPdf", "renderPrintPdf", "migrate", "createMigrationPackage", "getMigrationPackageCreationStatus", "getMigrationStatus",
            "loadCampaignDocumentVersion", "loadDocumentVersions", "exportDesign", "loadThemeDocument", "renameDocument",
            "renderProofPdfReturnStatus", "getRenderDocumentStatus", "convertCmykColors"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.smartServer,
        ["loadDirectSmileSets"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.smartServer.temporaryStorage,
        ["create", "copy", "loadDocument", "saveDocument", "saveCampaign"]);

    //#endregion dsmx.api.smartserver

    //#region dsmx.api.emails.smtpServers

    dsmx.api.core.createEasyWrappers(dsmx.api.emails, ["sendSingle", "getUnsubscriberImportStatus", "addUnsubscribers", "removeUnsubscribers", "exportUnsubscribers", "getUnsubscriberExportStatus", "getUnsubscriberMetaDataForAccount"]);
    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.emails, ["getUnsubscriberMetaData"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.emails.smtpServers, ["getForAccount", "delete", "deleteInAccount", "create", "update", "rename", "updateProperty", "setDefault", "setDefaultForAccount"]);
    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.emails.smtpServers, ["get"]);



    //#endregion dsmx.api.emails.smtpServers

    //#region "portal easy wrappers"

    dsmx.api.core.createEasyWrappers(dsmx.api.campaignCategories.portal,
        ["getContainingTemplates"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.campaignCategories.portal,
        ["getContainingApprovedTemplates", "getContainingNotApprovedTemplates", "getContainingAllTemplates"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.campaignTemplates.portal,
        ["getApprovedByPlaceholder", "getNotApprovedByPlaceholder", "getAllByPlaceholder", "getApprovedByCategory", "getNotApprovedByCategory", "getAllByCategory", "getByPlaceholder", "getByCategory"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.documentTemplates.portal,
        ["getApprovedByPlaceholder", "getNotApprovedByPlaceholder", "getAllByPlaceholder", "getApprovedByCategory", "getNotApprovedByCategory", "getAllByCategory", "getByPlaceholder", "getByCategory"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.images.portal,
        ["getApprovedByCategory", "getNotApprovedByCategory", "getAllByCategory", "getByCategory"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.portalSkins, ["delete", "create", "copy", "save", "loadSettings", "saveSettings", "getResources", "deleteResource", "exportByName", "exportById", "getStatus", "getByName"]);
    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.portalSkins, ["getAll"]);

    //#endregion "portal wrappers"

    //#region "Smart Campaign easy wrappers"

    dsmx.api.core.createEasyWrappers(dsmx.api.smartCampaign, ["login", "getDashboardUserMetaData"]);
    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.smartCampaign, ["getAllDatabases"]);
    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.database, ["getAllDatabases", "refreshUploadSession"]);
    //#endregion "Smart Campaign easy wrappers"

    //#region "contact duplicates"
    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.duplicateContacts, ["getFilter", "rehashDatabase"]);
    dsmx.api.core.createEasyWrappers(dsmx.api.duplicateContacts, ["getFilterByAccount", "setFilter", "setFilterByAccount", "setFilterOnAll", "getHashingStatus", "rehashDatabaseByAccount"]);
    //#endregion "contact duplicates"

    //#region "Translations"
    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.translations, ["supportedLanguages"]);
    dsmx.api.core.createEasyWrappers(dsmx.api.translations, ["get", "set", "delete", "export", "exportStatus", "importStatus", "assignLanguagesToCampaign", "removeLanguagesFromCampaign"]);
    //#endregion "Translations"

    //#region "DataRelations"
    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.dataRelations.admin, ["getMetaData"]);
    dsmx.api.core.createEasyWrappers(dsmx.api.dataRelations.admin, ["getCampaignRelations", "getMetaDataForType", "getTables", "getTableNames",
        "getColumns", "get", "count", "update", "updateConvert", "create", "delete2", "event", "execute", "getAvailableDataTypesForColumnCreation", "getScriptingRelationMetaData",
        "getScriptingRelationLog", "createColumn2", "getDeleteableColumns", "deleteColumn2", "supportsColumnCreation", "getFieldsInfo", "executeColumnAction", "getMetaDataForVersion"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.dataRelations.admin.campaign, ["getColumns", "get", "count", "update", "create", "delete2", "event", "execute"]);

    dsmx.api.core.createEasyWrappersNoParams(dsmx.api.dataRelations, ["getMetaData"]);
    dsmx.api.core.createEasyWrappers(dsmx.api.dataRelations, ["getAvailableDataTypesForColumnCreation", "createColumn2", "getDeleteableColumns", "deleteColumn2",
        "getColumns", "get2", "count2", "update2", "create2", "delete2", "event2", "execute2", "getImportStatus", "getImportColumnMappings", "getImportResult", "startImport2", "getUserRights"]);

    dsmx.api.core.createEasyWrappers(dsmx.api.campaignDatabase, ["get", "update"]);

    //#endregion "DataRelations"

    //#endregion "easy wrappers"


    //Data Relations

    dsmx.model.dataRelations = {
    };
    dsmx.model.dataRelations.dataRelationQuery = {
    };
    dsmx.model.dataRelations.dataRelationSettings = {
    };
    dsmx.model.dataRelations.dataRelationTable = {
    };
    dsmx.model.dataRelations.dataRelationSettingsAndTable = {
    };
    dsmx.model.dataRelations.dataRelationEvent = {
    };
    dsmx.model.dataRelations.dataRelationSettingsAndEvent = {
    };
    dsmx.model.dataRelations.dataRelationSettingsAndButtonAction = {
    };

    dsmx.model.dataRelations.dataRelationQuery.create = function () {
        var r = {
        };

        r.filter = null; //DataType: string; null = no filter
        r.currentPage = null;//DataType: int; values [1..x]; null = default value
        r.perPage = null;//Results per page; DataType: int; values [1..x]; null = default value
        r.columns = null;//DataType: array; Column names that should be returned [Column1,Column2, Column3, ...] //Empty list or null for all columns
        r.orderBy = null;//DataType: array; Columns names that should be used for sort ordering [Column1, Column2, Column3, ...], empty list or null for default values
        r.descendingSortOrder = null;//DataType: bool; false: ascending sort order, true: descending sort order, null: default value
        r.mode = null;//DataType: string; Data relation data mode.  "data": normal, "datadistinct": destinct retrieval of data

        return r;
    };

    dsmx.model.dataRelations.dataRelationSettings.create = function () {
        //creates a new DataRelationSettings object

        var r = {
        };

        r.campaignName = "";//Campaign name of campaign that should be used for data retieval, required because some DR's might need it
        r.relationType = "";//Type of data relation (E.g. Leads) for the internal Database DataRelation (see the metadata retrieval for details)
        r.tableName = "";//The name of the table that should be used for data retrieval etc
        r.relationParameters = null; //DataType: Object. Represents a list of key value pairs containing parameters that are required by data relations. ex: r.relationParameters.LoginName = "loginname"; r.relationParameters.Password = "password"; see metadata calls to get a list of reqired parameters; null = no parameters provided
        r.query = null; //Filter settings for data retrieval; DataType: dataRelationQuery; can be created via dsmx.model.dataRelations.dataRelationQuery.create()

        return r;
    };

    dsmx.model.dataRelations.dataRelationTable.create = function () {
        //Creates a new DataRelationTable object

        var r = {
        };

        r.columns = [];//List of all columns inside this table
        r.rows = [];

        r.addColumn = function (columnName) {
            var i;

            if (r.columns == null) {
                r.columns = [];
            }

            r.columns.push(columnName);

            if (r.rows == null) {
                r.rows = [];
            }

            for (i = 0; i < r.rows.length; i += 1) {
                r.rows[i].push(null);
            }
        };

        r.addRow = function () {
            var i;
            var row = [];

            if (r.columns == null) {
                r.columns = [];
            }

            if (r.rows == null) {
                r.rows = [];
            }

            for (i = 0; i < r.columns.length; i += 1) {
                row.push(null);
            }

            r.rows.push(row);

            return row;
        };

        r.getColumnIndex = function (columnName) {
            var ret = 0;

            if (r.columns != null) {
                for (var i = 0; i < r.columns.length; i += 1) {
                    if (r.columns[i] == columnName) {
                        ret = i;
                        break;
                    }
                }
            }

            return ret;
        };

        return r;
    };

    dsmx.model.dataRelations.dataRelationTable.toViewModel = function (dataRelationName, dataRelationTable, columnDefinitions, columnsToDisplay) {
        var ret = [];
        ret.columnDefinitions = {
        };
        ret.columns = [];
        ret.dataRelationName = dataRelationName;

        ret.primaryColumnName = "DSM_CustomerID";

        if (typeof columnDefinitions != "undefined" && columnDefinitions != null && columnDefinitions.length > 0) {
            for (var i = 0; i < columnDefinitions.length; i += 1) {
                var column = columnDefinitions[i];
                ret.columnDefinitions[column.name] = column;

                if (column.isPrimaryColumn) {
                    ret.primaryColumnName = column.name;
                }
            }

            if (typeof dataRelationTable != "undefined" && dataRelationTable != null && typeof dataRelationTable.columns != "undefined" && dataRelationTable.columns != null && typeof dataRelationTable.rows != "undefined" && dataRelationTable.rows != null && dataRelationTable.columns.length > 0 && dataRelationTable.rows.length > 0) {
                for (var rowIndex = 0; rowIndex < dataRelationTable.rows.length; ++rowIndex) {
                    var currentRecord = {
                    };

                    for (var columnIndex = 0; columnIndex < dataRelationTable.columns.length; ++columnIndex) {
                        currentRecord[dataRelationTable.columns[columnIndex]] = dataRelationTable.rows[rowIndex][columnIndex];
                    }

                    ret.push(currentRecord);
                }
            }

            if (typeof columnsToDisplay != "undefined" && columnsToDisplay != null && columnsToDisplay.length > 0) {
                for (var i = 0; i < columnsToDisplay.length; i += 1) {
                    if (ret.columnDefinitions.hasOwnProperty(columnsToDisplay[i])) {
                        ret.columns.push(ret.columnDefinitions[columnsToDisplay[i]]);
                    }
                }
            }

            if (ret.columns.length == 0) {
                for (var property in ret.columnDefinitions) {
                    if (ret.columnDefinitions.hasOwnProperty(property)) {
                        ret.columns.push(ret.columnDefinitions[property]);
                    }
                }
            }

            ret.getValue = function (column, model) {
                return model[column.name];
            };

            ret.getDisplayValue = function (column, model) {
                if (column.type == "bool" || column.type == "boolean") {
                    if (model[column.name]) {
                        return "Yes";
                    } else {
                        return "No";
                    }
                } else {
                    return ret.getValue(column, model);
                }
            };

            ret.saveValue = function (column, model, newValue, saveFinishedCallBack) {
                var primaryColumn = ret.getPrimaryColumName();

                if (primaryColumn.length == 0) {
                    alert("No primary column found!");
                    saveFinishedCallBack();
                } else {
                    var dataRelationTable = dsmx.model.dataRelations.dataRelationTable.create();
                    var valueToWrite = "";

                    dataRelationTable.addColumn(primaryColumn);
                    dataRelationTable.addColumn(column.name);
                    dataRelationTable.addRow();
                    dataRelationTable.rows[0][0] = model[primaryColumn];
                    dataRelationTable.rows[0][1] = newValue;

                    dsmx.api.dataRelations.update(ret.dataRelationName, dataRelationTable, function (response) {
                        if (response.state == 0) {
                            model[column.name] = newValue;
                        } else {
                            alert(response.failureMessage);
                        }

                        saveFinishedCallBack();
                    }, function (e) {
                        if (e.responseJSON && e.responseJSON.state == 1) {
                            alert(e.responseJSON.failureMessage);
                        } else {
                            alert(e.statusText);
                        }

                        saveFinishedCallBack();
                    });
                }
            };

            ret.deleteRecords = function (records, deleteFinishedCallBack) {
                if (typeof records != "undefined" && records != null && Object.prototype.toString.call(records) === "[object Array]" && records.length > 0) {
                    var ids = [];

                    for (var i = 0; i < records.length; i += 1) {
                        ids.push(records[i][ret.primaryColumnName]);
                    }

                    dsmx.api.dataRelations.delete(ret.dataRelationName, ids, function (result) {
                        if (result.state != 0) {
                            alert("Unable to delete records: " + result.failureMessage);
                        } else {
                            deleteFinishedCallBack(result.responseObject);
                        }
                    }, function () {
                        deleteFinishedCallBack(ids); alert("Unable to delete records.");
                    });
                }
            };

            ret.insert = function (model, doneCallback, failCallback) {
                if (typeof model !== "undefined" && model != null && typeof model === "object") {
                    var table = dsmx.model.dataRelations.dataRelationTable.create();

                    for (var property in model) {
                        if (model.hasOwnProperty(property)) {
                            table.addColumn(property);
                        }
                    }

                    var row = table.addRow();

                    for (var i = 0; i < table.columns.length; i += 1) {
                        row[i] = model[table.columns[i]];
                    }

                    dsmx.api.dataRelations.create(ret.dataRelationName, table, doneCallback, failCallback);
                }
            };

            ret.update = function (model, doneCallback, failCallback) {
                if (typeof model !== "undefined" && model != null && typeof model === "object") {
                    var table = dsmx.model.dataRelations.dataRelationTable.create();

                    for (var property in model) {
                        if (model.hasOwnProperty(property)) {
                            table.addColumn(property);
                        }
                    }

                    var row = table.addRow();

                    for (var i = 0; i < table.columns.length; i += 1) {
                        row.push(model[table.columns[i]]);
                    }

                    dsmx.api.dataRelations.update(ret.dataRelationName, table, doneCallback, failCallback);
                }
            };
        }

        ret.getPrimaryColumName = function () {
            return ret.primaryColumnName;
        };

        return ret;
    };

    dsmx.model.dataRelations.dataRelationSettingsAndTable.create = function () {
        //Creates a new DataRelationSettingsAndTable object

        var r = {
        };

        r.settings = dsmx.model.dataRelations.dataRelationSettings.create();
        r.records = dsmx.model.dataRelations.dataRelationTable.create();

        return r;
    };

    dsmx.model.dataRelations.dataRelationEvent.create = function () {
        //Creates a new DataRelationSettingsAndTable object

        var r = {
        };
        var date = new Date();

        r.leadID = "";//The record id of the record that will receive the event
        r.eventName = "";//The name of the event that should be added to the record
        r.occuredOnUTC = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());//The UTC date time when the event was created
        r.context = ""; //The event source, e.g PURL1.html
        r.destination = "";//The event Destination. For example the destination page name of a LinkClick event
        r.message = "";// A custom message that should be added to the event

        return r;
    };

    dsmx.model.dataRelations.dataRelationSettingsAndEvent.create = function () {
        var r = {
        };

        r.settings = dsmx.model.dataRelations.dataRelationSettings.create();
        r.event = dsmx.model.dataRelations.dataRelationEvent.create();

        return r;
    };

    dsmx.model.dataRelations.dataRelationSettingsAndButtonAction.create = function () {
        var r = {
        };

        r.settings = dsmx.model.dataRelations.dataRelationSettings.create();//The required data relation settings
        r.name = "";//The name of the button action
        r.parameters = {
        };//The required parameters for the button action. required parameters can be retrieved by using the getMetaData call

        return r;
    };

    dsmx.model.dataRelations.convertTableToObjectArray = function (table) {
        var ret = [];

        if (table.columns && table.rows && table.columns.length > 0 && table.rows.length > 0) {
            for (var iRow = 0; iRow < table.rows.length; ++iRow) {
                var newRecord = {
                };

                for (var iColumn = 0; iColumn < table.columns.length && iColumn < table.rows[iRow].length; ++iColumn) {
                    newRecord[table.columns[iColumn]] = table.rows[iRow][iColumn];
                }

                ret.push(newRecord);
            }
        }

        return ret;
    };

    dsmx.model.dataRelations.convertObjectArrayToTable = function (objectArray) {
        var ret = {
            columns: [],
            rows: [],
        };

        if (objectArray) {
            if (Object.prototype.toString.call(objectArray) === '[object Array]') {
                var columnIndexLookup = {
                };

                for (var i = 0; i < objectArray.length; ++i) {
                    for (var propertyName in objectArray[i]) {
                        if (objectArray[i].hasOwnProperty(propertyName)) {
                            var lowerName = propertyName.toLowerCase();

                            if (!columnIndexLookup.hasOwnProperty(lowerName)) {
                                columnIndexLookup[lowerName] = ret.columns.length;
                                ret.columns.push(propertyName);
                            }
                        }
                    }
                }

                for (var i = 0; i < objectArray.length; ++i) {
                    var newRow = Array.apply(null, Array(ret.columns.length)).map(function () {
                        return null;
                    });//Creates an array of length ret.columns.length containing null values

                    for (var propertyName in objectArray[i]) {
                        if (objectArray[i].hasOwnProperty(propertyName)) {
                            var lowerName = propertyName.toLowerCase();

                            if (columnIndexLookup.hasOwnProperty(lowerName)) {
                                newRow[columnIndexLookup[lowerName]] = objectArray[i][propertyName];
                            }
                        }
                    }

                    ret.rows.push(newRow);
                }
            } else if (typeof objectArray === 'object') {
                return dsmx.model.dataRelations.convertObjectArrayToTable([objectArray]);
            }
        }

        return ret;
    };
    /* models end */










































    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    */
    var CryptoJS = CryptoJS || function (h, s) {
        var f = {}, g = f.lib = {}, q = function () { }, m = g.Base = { extend: function (a) { q.prototype = this; var c = new q(); a && c.mixIn(a); c.hasOwnProperty("init") || (c.init = function () { c.$super.init.apply(this, arguments); }); c.init.prototype = c; c.$super = this; return c; }, create: function () { var a = this.extend(); a.init.apply(a, arguments); return a; }, init: function () { }, mixIn: function (a) { for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.init.prototype.extend(this) } },
            r = g.WordArray = m.extend({
                init: function (a, c) {
                    a = this.words = a || []; this.sigBytes = c != s ? c : 4 * a.length
                }, toString: function (a) { return (a || k).stringify(this) }, concat: function (a) {
                    var c = this.words, d = a.words, b = this.sigBytes; a = a.sigBytes; this.clamp(); if (b % 4) for (var e = 0; e < a; e++) c[b + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((b + e) % 4); else if (65535 < d.length) for (e = 0; e < a; e += 4) c[b + e >>> 2] = d[e >>> 2]; else c.push.apply(c, d); this.sigBytes += a; return this
                }, clamp: function () {
                    var a = this.words, c = this.sigBytes; a[c >>> 2] &= 4294967295 <<
                        32 - 8 * (c % 4); a.length = h.ceil(c / 4);
                }, clone: function () { var a = m.clone.call(this); a.words = this.words.slice(0); return a }, random: function (a) {
                    for (var c = [], d = 0; d < a; d += 4) c.push(4294967296 * h.random() | 0); return new r.init(c, a)
                }
            }), l = f.enc = {}, k = l.Hex = {
                stringify: function (a) { var c = a.words; a = a.sigBytes; for (var d = [], b = 0; b < a; b++) { var e = c[b >>> 2] >>> 24 - 8 * (b % 4) & 255; d.push((e >>> 4).toString(16)); d.push((e & 15).toString(16)) } return d.join("") }, parse: function (a) {
                    for (var c = a.length, d = [], b = 0; b < c; b += 2) d[b >>> 3] |= parseInt(a.substr(b,
                        2), 16) << 24 - 4 * (b % 8); return new r.init(d, c / 2)
                }
            }, n = l.Latin1 = { stringify: function (a) { var c = a.words; a = a.sigBytes; for (var d = [], b = 0; b < a; b++) d.push(String.fromCharCode(c[b >>> 2] >>> 24 - 8 * (b % 4) & 255)); return d.join("") }, parse: function (a) { for (var c = a.length, d = [], b = 0; b < c; b++) d[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - 8 * (b % 4); return new r.init(d, c) } }, j = l.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(n.stringify(a))) } catch (c) { throw Error("Malformed UTF-8 data"); } }, parse: function (a) { return n.parse(unescape(encodeURIComponent(a))) } },
            u = g.BufferedBlockAlgorithm = m.extend({
                reset: function () { this._data = new r.init; this._nDataBytes = 0 }, _append: function (a) {
                    "string" == typeof a && (a = j.parse(a)); this._data.concat(a); this._nDataBytes += a.sigBytes
                }, _process: function (a) { var c = this._data, d = c.words, b = c.sigBytes, e = this.blockSize, f = b / (4 * e), f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0); a = f * e; b = h.min(4 * a, b); if (a) { for (var g = 0; g < a; g += e) this._doProcessBlock(d, g); g = d.splice(0, a); c.sigBytes -= b } return new r.init(g, b) }, clone: function () {
                    var a = m.clone.call(this);
                    a._data = this._data.clone(); return a
                }, _minBufferSize: 0
            }); g.Hasher = u.extend({
                cfg: m.extend(), init: function (a) { this.cfg = this.cfg.extend(a); this.reset() }, reset: function () { u.reset.call(this); this._doReset() }, update: function (a) {
                    this._append(a); this._process(); return this
                }, finalize: function (a) { a && this._append(a); return this._doFinalize() }, blockSize: 16, _createHelper: function (a) {
                    return function (c, d) {
                        return (new a.init(d)).finalize(c)
                    }
                }, _createHmacHelper: function (a) {
                    return function (c, d) {
                        return (new t.HMAC.init(a,
                            d)).finalize(c)
                    }
                }
            }); var t = f.algo = {}; return f
    }(Math);
    (function (h) {
        for (var s = CryptoJS, f = s.lib, g = f.WordArray, q = f.Hasher, f = s.algo, m = [], r = [], l = function (a) { return 4294967296 * (a - (a | 0)) | 0 }, k = 2, n = 0; 64 > n;) { var j; a: { j = k; for (var u = h.sqrt(j), t = 2; t <= u; t++) if (!(j % t)) { j = !1; break a } j = !0 } j && (8 > n && (m[n] = l(h.pow(k, 0.5))), r[n] = l(h.pow(k, 1 / 3)), n++); k++ } var a = [], f = f.SHA256 = q.extend({
            _doReset: function () { this._hash = new g.init(m.slice(0)) }, _doProcessBlock: function (c, d) {
                for (var b = this._hash.words, e = b[0], f = b[1], g = b[2], j = b[3], h = b[4], m = b[5], n = b[6], q = b[7], p = 0; 64 > p; p++) {
                    if (16 > p) a[p] =
                        c[d + p] | 0; else { var k = a[p - 15], l = a[p - 2]; a[p] = ((k << 25 | k >>> 7) ^ (k << 14 | k >>> 18) ^ k >>> 3) + a[p - 7] + ((l << 15 | l >>> 17) ^ (l << 13 | l >>> 19) ^ l >>> 10) + a[p - 16] } k = q + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & m ^ ~h & n) + r[p] + a[p]; l = ((e << 30 | e >>> 2) ^ (e << 19 | e >>> 13) ^ (e << 10 | e >>> 22)) + (e & f ^ e & g ^ f & g); q = n; n = m; m = h; h = j + k | 0; j = g; g = f; f = e; e = k + l | 0
                } b[0] = b[0] + e | 0; b[1] = b[1] + f | 0; b[2] = b[2] + g | 0; b[3] = b[3] + j | 0; b[4] = b[4] + h | 0; b[5] = b[5] + m | 0; b[6] = b[6] + n | 0; b[7] = b[7] + q | 0
            }, _doFinalize: function () {
                var a = this._data, d = a.words, b = 8 * this._nDataBytes, e = 8 * a.sigBytes;
                d[e >>> 5] |= 128 << 24 - e % 32; d[(e + 64 >>> 9 << 4) + 14] = h.floor(b / 4294967296); d[(e + 64 >>> 9 << 4) + 15] = b; a.sigBytes = 4 * d.length; this._process(); return this._hash
            }, clone: function () {
                var a = q.clone.call(this); a._hash = this._hash.clone(); return a
            }
        }); s.SHA256 = q._createHelper(f); s.HmacSHA256 = q._createHmacHelper(f)
    })(Math);
    (function () {
        var h = CryptoJS, s = h.enc.Utf8; h.algo.HMAC = h.lib.Base.extend({
            init: function (f, g) { f = this._hasher = new f.init; "string" == typeof g && (g = s.parse(g)); var h = f.blockSize, m = 4 * h; g.sigBytes > m && (g = f.finalize(g)); g.clamp(); for (var r = this._oKey = g.clone(), l = this._iKey = g.clone(), k = r.words, n = l.words, j = 0; j < h; j++) k[j] ^= 1549556828, n[j] ^= 909522486; r.sigBytes = l.sigBytes = m; this.reset() }, reset: function () { var f = this._hasher; f.reset(); f.update(this._iKey) }, update: function (f) {
                this._hasher.update(f); return this
            }, finalize: function (f) {
                var g =
                    this._hasher; f = g.finalize(f); g.reset(); return g.finalize(this._oKey.clone().concat(f))
            }
        })
    })();




    /*
    CryptoJS v3.1.2
    code.google.com/p/crypto-js
    (c) 2009-2013 by Jeff Mott. All rights reserved.
    code.google.com/p/crypto-js/wiki/License
    */
    var CryptoJS = CryptoJS || function (s, p) {
        var m = {}, l = m.lib = {}, n = function () { }, r = l.Base = { extend: function (b) { n.prototype = this; var h = new n; b && h.mixIn(b); h.hasOwnProperty("init") || (h.init = function () { h.$super.init.apply(this, arguments) }); h.init.prototype = h; h.$super = this; return h }, create: function () { var b = this.extend(); b.init.apply(b, arguments); return b }, init: function () { }, mixIn: function (b) { for (var h in b) b.hasOwnProperty(h) && (this[h] = b[h]); b.hasOwnProperty("toString") && (this.toString = b.toString) }, clone: function () { return this.init.prototype.extend(this) } },
            q = l.WordArray = r.extend({
                init: function (b, h) {
                    b = this.words = b || []; this.sigBytes = h != p ? h : 4 * b.length
                }, toString: function (b) { return (b || t).stringify(this) }, concat: function (b) {
                    var h = this.words, a = b.words, j = this.sigBytes; b = b.sigBytes; this.clamp(); if (j % 4) for (var g = 0; g < b; g++) h[j + g >>> 2] |= (a[g >>> 2] >>> 24 - 8 * (g % 4) & 255) << 24 - 8 * ((j + g) % 4); else if (65535 < a.length) for (g = 0; g < b; g += 4) h[j + g >>> 2] = a[g >>> 2]; else h.push.apply(h, a); this.sigBytes += b; return this
                }, clamp: function () {
                    var b = this.words, h = this.sigBytes; b[h >>> 2] &= 4294967295 <<
                        32 - 8 * (h % 4); b.length = s.ceil(h / 4);
                }, clone: function () { var b = r.clone.call(this); b.words = this.words.slice(0); return b }, random: function (b) {
                    for (var h = [], a = 0; a < b; a += 4) h.push(4294967296 * s.random() | 0); return new q.init(h, b)
                }
            }), v = m.enc = {}, t = v.Hex = {
                stringify: function (b) { var a = b.words; b = b.sigBytes; for (var g = [], j = 0; j < b; j++) { var k = a[j >>> 2] >>> 24 - 8 * (j % 4) & 255; g.push((k >>> 4).toString(16)); g.push((k & 15).toString(16)) } return g.join("") }, parse: function (b) {
                    for (var a = b.length, g = [], j = 0; j < a; j += 2) g[j >>> 3] |= parseInt(b.substr(j,
                        2), 16) << 24 - 4 * (j % 8); return new q.init(g, a / 2)
                }
            }, a = v.Latin1 = { stringify: function (b) { var a = b.words; b = b.sigBytes; for (var g = [], j = 0; j < b; j++) g.push(String.fromCharCode(a[j >>> 2] >>> 24 - 8 * (j % 4) & 255)); return g.join("") }, parse: function (b) { for (var a = b.length, g = [], j = 0; j < a; j++) g[j >>> 2] |= (b.charCodeAt(j) & 255) << 24 - 8 * (j % 4); return new q.init(g, a) } }, u = v.Utf8 = { stringify: function (b) { try { return decodeURIComponent(escape(a.stringify(b))) } catch (g) { throw Error("Malformed UTF-8 data"); } }, parse: function (b) { return a.parse(unescape(encodeURIComponent(b))) } },
            g = l.BufferedBlockAlgorithm = r.extend({
                reset: function () { this._data = new q.init; this._nDataBytes = 0 }, _append: function (b) {
                    "string" == typeof b && (b = u.parse(b)); this._data.concat(b); this._nDataBytes += b.sigBytes
                }, _process: function (b) { var a = this._data, g = a.words, j = a.sigBytes, k = this.blockSize, m = j / (4 * k), m = b ? s.ceil(m) : s.max((m | 0) - this._minBufferSize, 0); b = m * k; j = s.min(4 * b, j); if (b) { for (var l = 0; l < b; l += k) this._doProcessBlock(g, l); l = g.splice(0, b); a.sigBytes -= j } return new q.init(l, j) }, clone: function () {
                    var b = r.clone.call(this);
                    b._data = this._data.clone(); return b
                }, _minBufferSize: 0
            }); l.Hasher = g.extend({
                cfg: r.extend(), init: function (b) { this.cfg = this.cfg.extend(b); this.reset() }, reset: function () { g.reset.call(this); this._doReset() }, update: function (b) {
                    this._append(b); this._process(); return this
                }, finalize: function (b) { b && this._append(b); return this._doFinalize() }, blockSize: 16, _createHelper: function (b) {
                    return function (a, g) {
                        return (new b.init(g)).finalize(a)
                    }
                }, _createHmacHelper: function (b) {
                    return function (a, g) {
                        return (new k.HMAC.init(b,
                            g)).finalize(a)
                    }
                }
            }); var k = m.algo = {}; return m
    }(Math);
    (function (s) {
        function p(a, k, b, h, l, j, m) { a = a + (k & b | ~k & h) + l + m; return (a << j | a >>> 32 - j) + k } function m(a, k, b, h, l, j, m) { a = a + (k & h | b & ~h) + l + m; return (a << j | a >>> 32 - j) + k } function l(a, k, b, h, l, j, m) { a = a + (k ^ b ^ h) + l + m; return (a << j | a >>> 32 - j) + k } function n(a, k, b, h, l, j, m) { a = a + (b ^ (k | ~h)) + l + m; return (a << j | a >>> 32 - j) + k } for (var r = CryptoJS, q = r.lib, v = q.WordArray, t = q.Hasher, q = r.algo, a = [], u = 0; 64 > u; u++) a[u] = 4294967296 * s.abs(s.sin(u + 1)) | 0; q = q.MD5 = t.extend({
            _doReset: function () {
                this._hash = new v.init([1732584193, 4023233417, 2562383102, 271733878])
            },
            _doProcessBlock: function (g, k) {
                for (var b = 0; 16 > b; b++) {
                    var h = k + b, w = g[h]; g[h] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360
                } var b = this._hash.words, h = g[k + 0], w = g[k + 1], j = g[k + 2], q = g[k + 3], r = g[k + 4], s = g[k + 5], t = g[k + 6], u = g[k + 7], v = g[k + 8], x = g[k + 9], y = g[k + 10], z = g[k + 11], A = g[k + 12], B = g[k + 13], C = g[k + 14], D = g[k + 15], c = b[0], d = b[1], e = b[2], f = b[3], c = p(c, d, e, f, h, 7, a[0]), f = p(f, c, d, e, w, 12, a[1]), e = p(e, f, c, d, j, 17, a[2]), d = p(d, e, f, c, q, 22, a[3]), c = p(c, d, e, f, r, 7, a[4]), f = p(f, c, d, e, s, 12, a[5]), e = p(e, f, c, d, t, 17, a[6]), d = p(d, e, f, c, u, 22, a[7]),
                    c = p(c, d, e, f, v, 7, a[8]), f = p(f, c, d, e, x, 12, a[9]), e = p(e, f, c, d, y, 17, a[10]), d = p(d, e, f, c, z, 22, a[11]), c = p(c, d, e, f, A, 7, a[12]), f = p(f, c, d, e, B, 12, a[13]), e = p(e, f, c, d, C, 17, a[14]), d = p(d, e, f, c, D, 22, a[15]), c = m(c, d, e, f, w, 5, a[16]), f = m(f, c, d, e, t, 9, a[17]), e = m(e, f, c, d, z, 14, a[18]), d = m(d, e, f, c, h, 20, a[19]), c = m(c, d, e, f, s, 5, a[20]), f = m(f, c, d, e, y, 9, a[21]), e = m(e, f, c, d, D, 14, a[22]), d = m(d, e, f, c, r, 20, a[23]), c = m(c, d, e, f, x, 5, a[24]), f = m(f, c, d, e, C, 9, a[25]), e = m(e, f, c, d, q, 14, a[26]), d = m(d, e, f, c, v, 20, a[27]), c = m(c, d, e, f, B, 5, a[28]), f = m(f, c,
                        d, e, j, 9, a[29]), e = m(e, f, c, d, u, 14, a[30]), d = m(d, e, f, c, A, 20, a[31]), c = l(c, d, e, f, s, 4, a[32]), f = l(f, c, d, e, v, 11, a[33]), e = l(e, f, c, d, z, 16, a[34]), d = l(d, e, f, c, C, 23, a[35]), c = l(c, d, e, f, w, 4, a[36]), f = l(f, c, d, e, r, 11, a[37]), e = l(e, f, c, d, u, 16, a[38]), d = l(d, e, f, c, y, 23, a[39]), c = l(c, d, e, f, B, 4, a[40]), f = l(f, c, d, e, h, 11, a[41]), e = l(e, f, c, d, q, 16, a[42]), d = l(d, e, f, c, t, 23, a[43]), c = l(c, d, e, f, x, 4, a[44]), f = l(f, c, d, e, A, 11, a[45]), e = l(e, f, c, d, D, 16, a[46]), d = l(d, e, f, c, j, 23, a[47]), c = n(c, d, e, f, h, 6, a[48]), f = n(f, c, d, e, u, 10, a[49]), e = n(e, f, c, d,
                            C, 15, a[50]), d = n(d, e, f, c, s, 21, a[51]), c = n(c, d, e, f, A, 6, a[52]), f = n(f, c, d, e, q, 10, a[53]), e = n(e, f, c, d, y, 15, a[54]), d = n(d, e, f, c, w, 21, a[55]), c = n(c, d, e, f, v, 6, a[56]), f = n(f, c, d, e, D, 10, a[57]), e = n(e, f, c, d, t, 15, a[58]), d = n(d, e, f, c, B, 21, a[59]), c = n(c, d, e, f, r, 6, a[60]), f = n(f, c, d, e, z, 10, a[61]), e = n(e, f, c, d, j, 15, a[62]), d = n(d, e, f, c, x, 21, a[63]); b[0] = b[0] + c | 0; b[1] = b[1] + d | 0; b[2] = b[2] + e | 0; b[3] = b[3] + f | 0
            }, _doFinalize: function () {
                var a = this._data, k = a.words, b = 8 * this._nDataBytes, h = 8 * a.sigBytes; k[h >>> 5] |= 128 << 24 - h % 32; var l = s.floor(b /
                    4294967296); k[(h + 64 >>> 9 << 4) + 15] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360; k[(h + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360; a.sigBytes = 4 * (k.length + 1); this._process(); a = this._hash; k = a.words; for (b = 0; 4 > b; b++) h = k[b], k[b] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360; return a
            }, clone: function () {
                var a = t.clone.call(this); a._hash = this._hash.clone(); return a
            }
        }); r.MD5 = t._createHelper(q); r.HmacMD5 = t._createHmacHelper(q);
    })(Math);

    return dsmx;
});