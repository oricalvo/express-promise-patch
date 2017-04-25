"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function isProduction() {
    return process.env.NODE_ENV == "production";
}
function writeContent(req, res, retVal) {
    if (typeof retVal == "object") {
        res.json(retVal);
    }
    else {
        res.write(retVal ? retVal.toString() : "");
        res.end();
    }
}
function writeError(req, res, err) {
    var statusCode = 500;
    var statusMessage = err.message;
    if (err instanceof HttpError) {
        statusCode = err.statusCode;
        statusMessage = err.statusMessage || err.message;
    }
    res.status(statusCode);
    res.statusMessage = statusMessage;
    if (!isProduction()) {
        res.write(err.stack.toString());
    }
    res.end();
}
function handler(req, res, originalHandler) {
    var _this = this;
    var _arguments = arguments;
    Promise.resolve()
        .then(function () {
        return originalHandler.apply(_this, _arguments);
    })
        .then(function (retVal) {
        writeContent(req, res, retVal);
    })
        .catch(function (err) {
        writeError(req, res, err);
    });
}
function patch(app) {
    var methods = ["get", "post"];
    var _loop_1 = function (method) {
        var original = app[method];
        app[method] = function () {
            var originalHandler = arguments[1];
            if (typeof originalHandler == "function") {
                arguments[1] = function (req, res) {
                    handler(req, res, originalHandler);
                };
            }
            return original.apply(this, arguments);
        };
    };
    for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
        var method = methods_1[_i];
        _loop_1(method);
    }
}
exports.patch = patch;
var HttpError = (function (_super) {
    __extends(HttpError, _super);
    function HttpError(message, statusCode, statusMessage) {
        var _this = _super.call(this, message) || this;
        _this.statusMessage = statusMessage;
        _this.statusCode = statusCode;
        return _this;
    }
    return HttpError;
}(Error));
exports.HttpError = HttpError;
//# sourceMappingURL=index.js.map