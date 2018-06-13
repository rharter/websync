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
var minimatch = require("minimatch");
var mime = require("mime");
var S3Prefixer_1 = require("./S3Prefixer");
var S3Item_1 = require("./S3Item");
var s3 = new aws_sdk_1.S3();
var MAX_LIST_OBJECTS = 1000;
var S3Container = (function (_super) {
    __extends(S3Container, _super);
    function S3Container(bucketName, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var _this = _super.call(this, prefix) || this;
        _this.type = 'S3';
        _this.bucketName = bucketName;
        return _this;
    }
    S3Container.prototype.listAllObjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var continuationToken, objects, done, params, res, newObjects;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        objects = [];
                        done = false;
                        _a.label = 1;
                    case 1:
                        if (!!done) return [3 /*break*/, 3];
                        params = {
                            Bucket: this.bucketName,
                            Prefix: this.prefix,
                        };
                        if (continuationToken) {
                            params.ContinuationToken = continuationToken;
                        }
                        return [4 /*yield*/, s3.listObjectsV2(params).promise()];
                    case 2:
                        res = _a.sent();
                        newObjects = res.Contents;
                        if (newObjects) {
                            objects = objects.concat(newObjects);
                        }
                        if (res.IsTruncated) {
                            continuationToken = res.NextContinuationToken;
                        }
                        else {
                            done = true;
                        }
                        return [3 /*break*/, 1];
                    case 3:
                        objects.forEach(function (obj) {
                            if (obj.Key) {
                                obj.Key = _this.withoutPrefix(obj.Key);
                            }
                        });
                        return [2 /*return*/, objects];
                }
            });
        });
    };
    S3Container.prototype.listItems = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var objects, include, exclude;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listAllObjects()];
                    case 1:
                        objects = _a.sent();
                        include = options.include, exclude = options.exclude;
                        if (include) {
                            objects = objects.filter(function (obj) { return obj.Key && minimatch(obj.Key, include, { matchBase: true }); });
                        }
                        if (exclude) {
                            objects = objects.filter(function (obj) { return obj.Key && !minimatch(obj.Key, exclude, { matchBase: true }); });
                        }
                        return [2 /*return*/, objects.map(function (obj) { return new S3Item_1.default(_this.bucketName, obj); })];
                }
            });
        });
    };
    S3Container.prototype.putItem = function (item, options) {
        return __awaiter(this, void 0, void 0, function () {
            var body, s3Options, key, params, objectOutput, objectHead, s3Object, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, item.read()];
                    case 1:
                        body = _a.sent();
                        s3Options = options && options.s3Options ? options.s3Options : {};
                        key = this.withPrefix(item.key);
                        params = Object.assign(s3Options, {
                            Bucket: this.bucketName,
                            Key: key,
                            Body: body,
                        });
                        if (!params.ContentType) {
                            params.ContentType = mime.getType(key) || 'application/octet-stream';
                        }
                        return [4 /*yield*/, s3.putObject(params).promise()];
                    case 2:
                        objectOutput = _a.sent();
                        return [4 /*yield*/, s3.headObject({
                                Bucket: this.bucketName,
                                Key: key,
                            }).promise()];
                    case 3:
                        objectHead = _a.sent();
                        s3Object = {
                            Key: key,
                            LastModified: objectHead.LastModified,
                            Size: body.length,
                        };
                        ret = new S3Item_1.default(item.key, s3Object);
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    S3Container.prototype.delItem = function (item, options) {
        return __awaiter(this, void 0, void 0, function () {
            var s3Options, key, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s3Options = options && options.s3Options ? options.s3Options : {};
                        key = this.withPrefix(item.key);
                        params = Object.assign(s3Options, {
                            Bucket: this.bucketName,
                            Key: key,
                        });
                        return [4 /*yield*/, s3.deleteObject(params).promise()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    S3Container.prototype.getBucketName = function () {
        return this.bucketName;
    };
    return S3Container;
}(S3Prefixer_1.default));
exports.default = S3Container;
