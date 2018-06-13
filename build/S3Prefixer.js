"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var S3Prefixer = (function () {
    function S3Prefixer(prefix) {
        if (prefix === void 0) { prefix = ''; }
        this.prefix = prefix.replace(/^\//, '');
        this.replaceReg = new RegExp("^" + this.prefix + "/?");
    }
    S3Prefixer.prototype.withPrefix = function (key) {
        return path.join(this.prefix, key);
    };
    S3Prefixer.prototype.withoutPrefix = function (key) {
        return key.replace(this.replaceReg, '');
    };
    return S3Prefixer;
}());
exports.default = S3Prefixer;
