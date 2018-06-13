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
var fs = require("fs-extra");
var Path = require("path");
var minimist = require("minimist");
var defaultConfigNames = [
    'websync.js',
    'websync.json',
];
var Config = (function () {
    function Config(_a) {
        var _b = _a.argv, argv = _b === void 0 ? [] : _b, _c = _a.configFileName, configFileName = _c === void 0 ? '' : _c;
        this.argv = argv;
        this.configFileName = configFileName;
    }
    Config.prototype.getDefaultConfigFileName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, stat, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < defaultConfigNames.length)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.stat(defaultConfigNames[i])];
                    case 3:
                        stat = _a.sent();
                        if (stat.isFile())
                            return [2 /*return*/, defaultConfigNames[i]];
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, ''];
                }
            });
        });
    };
    Config.prototype.readConfigFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, opts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.configFileName) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getDefaultConfigFileName()];
                    case 1:
                        _a.configFileName = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!this.configFileName) {
                            return [2 /*return*/, {}];
                        }
                        opts = require(Path.resolve(this.configFileName));
                        return [2 /*return*/, opts];
                }
            });
        });
    };
    Config.prototype.resolve = function () {
        return __awaiter(this, void 0, void 0, function () {
            var args, opts, _a, source, target;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        args = minimist(this.argv);
                        return [4 /*yield*/, this.readConfigFile()];
                    case 1:
                        opts = _b.sent();
                        if (args._.length) {
                            if (args._.length !== 2) {
                                throw new Error('Config: `source` and `target` are both required, if supplied by argv.');
                            }
                            _a = args._, source = _a[0], target = _a[1];
                            opts.source = source;
                            opts.target = target;
                        }
                        if (args.include) {
                            opts.include = args.include;
                        }
                        if (args.exclude) {
                            opts.exclude = args.exclude;
                        }
                        if (args.diffBy) {
                            opts.diffBy = args.diffBy;
                        }
                        if (args.wildcardPolicy) {
                            opts.wildcardPolicy = args.wildcardPolicy;
                        }
                        if ('wildcardAll' in args) {
                            opts.wildcardAll = Boolean(opts.wildcardAll);
                        }
                        if ('invalidateDeletes' in args) {
                            opts.invalidateDeletes = args.invalidateDeletes;
                        }
                        if ('distribution' in args) {
                            opts.distributions = Array.isArray(args.distribution)
                                ? args.distribution
                                : [args.distribution];
                        }
                        if (typeof opts.source !== 'string' || typeof opts.target !== 'string') {
                            throw new Error('Config: `source` and `target` options are required');
                        }
                        return [2 /*return*/, opts];
                }
            });
        });
    };
    return Config;
}());
exports.default = Config;
