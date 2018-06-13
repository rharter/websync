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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = require("aws-sdk");
var S3Prefixer_1 = require("./S3Prefixer");
var s3 = new aws_sdk_1.S3();
var S3Item = (function (_super) {
    __extends(S3Item, _super);
    function S3Item(bucketName, s3Object, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var _this = _super.call(this, prefix) || this;
        _this.bucketName = bucketName;
        _this.s3Object = s3Object;
        if (!s3Object.Key) {
            throw new Error("S3Item: Key is required on s3Object");
        }
        if (typeof s3Object.LastModified === 'undefined') {
            throw new Error("S3Item: LastModified is required on s3Object");
        }
        if (typeof s3Object.ETag === 'undefined') {
            throw new Error("S3Item: ETag is required on s3Object");
        }
        if (typeof s3Object.Size !== 'number') {
            throw new Error("S3Item: Size is required on s3Object");
        }
        _this.key = s3Object.Key;
        _this.modtime = s3Object.LastModified;
        _this.remoteEtag = s3Object.ETag;
        _this.size = s3Object.Size;
        _this.isSymbolicLink = false;
        return _this;
    }
    S3Item.prototype.getBody = function () {
        return __awaiter(this, void 0, void 0, function () {
            var objectOutput, ret, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, s3.getObject({
                            Bucket: this.bucketName,
                            Key: this.withPrefix(this.s3Object.Key),
                        }).promise()];
                    case 1:
                        objectOutput = _a.sent();
                        body = objectOutput.Body;
                        if (body instanceof Buffer) {
                            ret = body;
                        }
                        else if (typeof body === 'string') {
                            ret = new Buffer(body);
                        }
                        else if (body instanceof Uint8Array) {
                            ret = Buffer.from(body.buffer);
                        }
                        else {
                            ret = new Buffer(0);
                        }
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    S3Item.prototype.read = function () {
        return this.getBody();
    };
    S3Item.prototype.etag = function () {
        return this.remoteEtag;
    };
    return S3Item;
}(S3Prefixer_1.default));
exports.default = S3Item;
