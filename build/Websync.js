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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var Transfer_1 = require("./Transfer");
var CloudFrontIndalidator_1 = require("./CloudFrontIndalidator");
var Stats_1 = require("./Stats");
var GlobTable_1 = require("./GlobTable");
var Errors = require("./Errors");
var diff_1 = require("./diff");
var parseContainerFromURL_1 = require("./parseContainerFromURL");
var generateInvalidations_1 = require("./generateInvalidations");
var isS3Container = function (container) {
    return container.type === 'S3';
};
var processModifiers = function (item, options, modifiers) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, modifiers.reduce(function (p, m) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, p];
                            case 1:
                                _e.sent();
                                _b = (_a = Object).assign;
                                _c = [options];
                                if (!(typeof m === 'function')) return [3 /*break*/, 3];
                                return [4 /*yield*/, m(item)];
                            case 2:
                                _d = _e.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _d = m;
                                _e.label = 4;
                            case 4:
                                _b.apply(_a, _c.concat([_d]));
                                return [2 /*return*/];
                        }
                    });
                }); }, Promise.resolve())];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var Websync = (function (_super) {
    __extends(Websync, _super);
    function Websync(options) {
        var _this = _super.call(this) || this;
        _this.diffBy = 'modtime';
        _this.wildcardPolicy = 'majority';
        _this.wildcardAll = false;
        _this.invalidateDeletes = false;
        _this.initialized = false;
        _this.completed = false;
        _this.diffs = [];
        _this.completeCount = 0;
        _this.source = parseContainerFromURL_1.default(options.source);
        _this.target = parseContainerFromURL_1.default(options.target);
        _this.filterOptions = { include: options.include, exclude: options.exclude };
        _this.putOptionsTable = new GlobTable_1.default(options.modifiers || {});
        _this.deleteOptionsTable = new GlobTable_1.default(options.deleteModifiers || {});
        _this.completeCount = 0;
        if (options.diffBy) {
            _this.diffBy = options.diffBy;
        }
        if (options.wildcardPolicy) {
            _this.wildcardPolicy = options.wildcardPolicy;
        }
        if (typeof options.wildcardAll === 'boolean') {
            _this.wildcardAll = options.wildcardAll;
        }
        if (typeof options.invalidateDeletes === 'boolean') {
            _this.invalidateDeletes = options.invalidateDeletes;
        }
        if (options.distributions) {
            _this.distributions = options.distributions;
        }
        _this.stats = new Stats_1.default({
            source: options.source,
            target: options.target,
        });
        return _this;
    }
    Websync.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (this.initialized) {
                            throw new Errors.AlreadyInitialized();
                        }
                        _a = this;
                        return [4 /*yield*/, diff_1.default(this.source, this.target, this.diffBy, this.filterOptions)];
                    case 1:
                        _a.diffs = _h.sent();
                        this.transfer = new Transfer_1.default({
                            source: this.source,
                            target: this.target,
                            diffs: this.diffs,
                        });
                        this.transfer
                            .on('putObject', function (item, options) { return __awaiter(_this, void 0, void 0, function () {
                            var modifiers;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        modifiers = this.putOptionsTable.lookup(item.key);
                                        return [4 /*yield*/, processModifiers(item, options, modifiers)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })
                            .on('deleteObject', function (item, options) { return __awaiter(_this, void 0, void 0, function () {
                            var modifiers;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        modifiers = this.deleteOptionsTable.lookup(item.key);
                                        return [4 /*yield*/, processModifiers(item, options, modifiers)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })
                            .on('itemComplete', function (data) {
                            _this.completeCount++;
                            _this.emit('progress', Object.assign({
                                progress: _this.completeCount / _this.diffs.length,
                            }, data));
                            if (data.success && (data.type === 'UPDATE' || data.type === 'CREATE')) {
                                _this.stats.amount += data.item.size;
                            }
                        });
                        this.stats.update({
                            diffs: this.diffs,
                            completed: false,
                            constitutesPayment: false,
                            invalidated: false,
                        });
                        if (!isS3Container(this.target)) return [3 /*break*/, 5];
                        _b = this;
                        _c = generateInvalidations_1.default;
                        _d = {
                            diffs: this.diffs
                        };
                        return [4 /*yield*/, this.target.listItems()];
                    case 2:
                        _b.invalidations = _c.apply(void 0, [(_d.targetItems = _h.sent(),
                                _d.wildcardPolicy = this.wildcardPolicy,
                                _d.wildcardAll = this.wildcardAll,
                                _d.invalidateDeletes = this.invalidateDeletes,
                                _d)]);
                        this.invalidator = new CloudFrontIndalidator_1.default({
                            bucketName: this.target.getBucketName(),
                            paths: this.invalidations,
                            ids: this.distributions,
                        });
                        _f = (_e = this.stats).update;
                        _g = {};
                        return [4 /*yield*/, this.invalidator.constitutesPayment()];
                    case 3:
                        _g.constitutesPayment = _h.sent();
                        return [4 /*yield*/, this.invalidator.getDistributions()];
                    case 4:
                        _f.apply(_e, [(_g.distributions = _h.sent(),
                                _g.invalidations = this.invalidations,
                                _g)]);
                        _h.label = 5;
                    case 5:
                        this.initialized = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Websync.prototype.constitutesPayment = function () {
        if (!this.initialized) {
            throw new Error("Websync: Websync must be initialized before calling `constituesPayment`");
        }
        return this.stats.constitutesPayment;
    };
    Websync.prototype.sync = function (invalidate) {
        if (invalidate === void 0) { invalidate = true; }
        return __awaiter(this, void 0, void 0, function () {
            var startTime, err_1, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        this.stats.invalidated = false;
                        if (this.completed) {
                            throw new Errors.AlreadyCompleted();
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!(this.transfer !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.transfer.complete()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        throw new Errors.TransferFailed(err_1);
                    case 5:
                        if (!(this.invalidator && invalidate)) return [3 /*break*/, 9];
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.invalidator.invalidate()];
                    case 7:
                        _a.sent();
                        this.stats.invalidated = true;
                        return [3 /*break*/, 9];
                    case 8:
                        err_2 = _a.sent();
                        throw new Errors.InvalidationsFailed(err_2);
                    case 9:
                        this.stats.time = Date.now() - startTime;
                        this.completed = this.stats.completed = true;
                        return [2 /*return*/, this.stats.clone()];
                }
            });
        });
    };
    Websync.prototype.getStats = function () {
        if (!this.initialized) {
            throw new Error("Websync: Websync must be initialized before calling `getStats`");
        }
        return this.stats.clone();
    };
    return Websync;
}(events_1.EventEmitter));
exports.default = Websync;
