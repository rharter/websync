"use strict";
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
var cf = new aws_sdk_1.CloudFront();
exports.bucketToDomain = function (bucketName) { return bucketName + ".s3.amazonaws.com"; };
function listDistributions() {
    return __awaiter(this, void 0, void 0, function () {
        var marker, complete, distributions, params, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marker = '';
                    complete = false;
                    distributions = [];
                    _a.label = 1;
                case 1:
                    if (!!complete) return [3 /*break*/, 3];
                    params = {};
                    if (marker) {
                        params.Marker = marker;
                    }
                    return [4 /*yield*/, cf.listDistributions(params).promise()];
                case 2:
                    result = _a.sent();
                    if (!result.DistributionList) {
                        complete = true;
                        return [3 /*break*/, 3];
                    }
                    if (result.DistributionList.Items) {
                        distributions = distributions.concat(result.DistributionList.Items);
                    }
                    if (result.DistributionList.IsTruncated && result.DistributionList.NextMarker) {
                        marker = result.DistributionList.NextMarker;
                    }
                    else {
                        complete = true;
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, distributions];
            }
        });
    });
}
exports.listDistributions = listDistributions;
function findDistributions(_a) {
    var _b = _a.bucketName, bucketName = _b === void 0 ? '' : _b, _c = _a.ids, ids = _c === void 0 ? [] : _c;
    return __awaiter(this, void 0, void 0, function () {
        var distributions, domainName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, listDistributions()];
                case 1:
                    distributions = _a.sent();
                    domainName = exports.bucketToDomain(bucketName);
                    return [2 /*return*/, distributions.filter(function (dist) {
                            if (ids.length) {
                                var foundExplicitly = ids.some(function (id) { return dist.Id === id; });
                                if (foundExplicitly)
                                    return true;
                            }
                            if (!dist.Origins.Quantity || !dist.Origins.Items || !dist.Origins.Items.length)
                                return false;
                            return dist.Origins.Items.some(function (origin) { return origin.DomainName === domainName; });
                        })];
            }
        });
    });
}
exports.findDistributions = findDistributions;
var CloudFrontInvalidator = (function () {
    function CloudFrontInvalidator(options) {
        this.ids = [];
        this.bucketName = options.bucketName;
        this.paths = options.paths.filter(function (path, i) { return options.paths.indexOf(path) === i; });
        if (options.ids) {
            this.ids = options.ids;
        }
    }
    CloudFrontInvalidator.prototype.constitutesPayment = function () {
        return __awaiter(this, void 0, void 0, function () {
            var distributions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDistributions()];
                    case 1:
                        distributions = _a.sent();
                        return [2 /*return*/, distributions.length * this.paths.length > 1000];
                }
            });
        });
    };
    CloudFrontInvalidator.prototype.invalidate = function (enabledOnly) {
        if (enabledOnly === void 0) { enabledOnly = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var distributions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.paths.length) {
                            return [2 /*return*/, {
                                    committed: false,
                                    count: 0,
                                    reason: 'NO_PATHS',
                                }];
                        }
                        return [4 /*yield*/, this.getDistributions()];
                    case 1:
                        distributions = (_a.sent()).filter(function (dist) {
                            if (enabledOnly)
                                return dist.Enabled;
                            return true;
                        });
                        if (!distributions.length) {
                            return [2 /*return*/, {
                                    committed: false,
                                    count: 0,
                                    reason: 'NO_DISTS',
                                }];
                        }
                        return [4 /*yield*/, Promise.all(distributions.map(function (dist) {
                                return cf.createInvalidation({
                                    DistributionId: dist.Id,
                                    InvalidationBatch: {
                                        CallerReference: Date.now().toString(),
                                        Paths: {
                                            Quantity: _this.paths.length,
                                            Items: _this.paths,
                                        },
                                    },
                                }).promise();
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                committed: true,
                                count: distributions.length * this.paths.length,
                                reason: 'COMMITTED',
                            }];
                }
            });
        });
    };
    CloudFrontInvalidator.prototype.getDistributions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.distributions) return [3 /*break*/, 2];
                        options = {};
                        // Explicit ids overrides bucketName
                        if (this.ids.length) {
                            options.ids = this.ids;
                        }
                        else {
                            options.bucketName = this.bucketName;
                        }
                        _a = this;
                        return [4 /*yield*/, findDistributions(options)];
                    case 1:
                        _a.distributions = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.distributions];
                }
            });
        });
    };
    return CloudFrontInvalidator;
}());
exports.default = CloudFrontInvalidator;
