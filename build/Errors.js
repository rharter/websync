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
exports.ErrorCodes = {
    TransferFailed: 1,
    TooManyInvalidations: 2,
    InvalidationsFailed: 3,
    AlreadyInitialized: 4,
    AlreadyCompleted: 5,
};
var Base = (function (_super) {
    __extends(Base, _super);
    function Base(msg, code) {
        var _this = _super.call(this, msg) || this;
        _this.code = code;
        return _this;
    }
    return Base;
}(Error));
exports.Base = Base;
var TransferFailed = (function (_super) {
    __extends(TransferFailed, _super);
    function TransferFailed(transferError) {
        var _this = _super.call(this, "Websync: Transfer Failed.", exports.ErrorCodes.TransferFailed) || this;
        _this.transferError = transferError;
        return _this;
    }
    return TransferFailed;
}(Base));
exports.TransferFailed = TransferFailed;
var TooManyInvalidations = (function (_super) {
    __extends(TooManyInvalidations, _super);
    function TooManyInvalidations() {
        return _super.call(this, "Websync: Too many invalidations.", exports.ErrorCodes.TooManyInvalidations) || this;
    }
    return TooManyInvalidations;
}(Base));
exports.TooManyInvalidations = TooManyInvalidations;
var InvalidationsFailed = (function (_super) {
    __extends(InvalidationsFailed, _super);
    function InvalidationsFailed(invalidationsError) {
        var _this = _super.call(this, "Websync: Invalidations Failed.", exports.ErrorCodes.InvalidationsFailed) || this;
        _this.invalidationsError = invalidationsError;
        return _this;
    }
    return InvalidationsFailed;
}(Base));
exports.InvalidationsFailed = InvalidationsFailed;
var AlreadyInitialized = (function (_super) {
    __extends(AlreadyInitialized, _super);
    function AlreadyInitialized() {
        return _super.call(this, "Websync: Already initialized.", exports.ErrorCodes.AlreadyInitialized) || this;
    }
    return AlreadyInitialized;
}(Base));
exports.AlreadyInitialized = AlreadyInitialized;
var AlreadyCompleted = (function (_super) {
    __extends(AlreadyCompleted, _super);
    function AlreadyCompleted() {
        return _super.call(this, "Websync: Already completed.", exports.ErrorCodes.AlreadyCompleted) || this;
    }
    return AlreadyCompleted;
}(Base));
exports.AlreadyCompleted = AlreadyCompleted;
