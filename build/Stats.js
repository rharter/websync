"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var bytes = require("bytes");
var Stats = (function () {
    function Stats(stats) {
        if (stats === void 0) { stats = {}; }
        this.source = '';
        this.target = '';
        this.diffs = [];
        this.constitutesPayment = false;
        this.completed = false;
        this.invalidated = false;
        this.time = 0;
        this.amount = 0;
        this.update(stats);
    }
    Stats.prototype.diffToString = function (chalk, diff) {
        var method = diff.type === 'DELETE' ? 'red' : diff.type === 'CREATE' ? 'green' : 'yellow';
        var symbol = diff.type === 'DELETE' ? '-' : '+';
        return chalk[method](symbol + " " + diff.key);
    };
    Stats.prototype.getDistributionName = function (dist) {
        if (dist.Aliases.Items && dist.Aliases.Items.length) {
            return dist.Aliases.Items[0];
        }
        return dist.DomainName;
    };
    Stats.prototype.update = function (stats) {
        Object.assign(this, stats);
    };
    Stats.prototype.toString = function (_a) {
        var _this = this;
        var _b = (_a === void 0 ? {} : _a).colors, colors = _b === void 0 ? true : _b;
        var c = new chalk_1.default.constructor({ enabled: colors });
        var diffToString = this.diffToString.bind(this, c);
        var ret = this.source + " " + c.bold(c.greenBright("\u2192")) + " " + this.target;
        if (!this.diffs.length) {
            ret += "\nUP TO DATE";
            return ret;
        }
        ret += "\nTook: " + this.time / 1000 + " s";
        if (this.diffs.length) {
            var amount = c.cyan(bytes(this.amount, { unitSeparator: ' ' }));
            ret += "\nTransferred (" + amount + "):\n\t" + this.diffs.map(diffToString).join('\n\t') + "\n";
        }
        var invalidations = (this.invalidations || []).map(function (p) { return c.red(p); });
        if (this.invalidated && invalidations.length) {
            var domains = (this.distributions || []).map(function (d) { return c.cyan(_this.getDistributionName(d)); });
            ret += "Invalidated on (" + domains.join(', ') + "):\n\t" + invalidations.join('\n\t');
        }
        return ret;
    };
    Stats.prototype.clone = function () {
        var stats = {
            source: this.source,
            target: this.target,
            diffs: this.diffs,
            distributions: this.distributions,
            invalidations: this.invalidations,
            constitutesPayment: this.constitutesPayment,
            completed: this.completed,
            invalidated: this.invalidated,
            time: this.time,
            amount: this.amount,
        };
        return new Stats(stats);
    };
    return Stats;
}());
exports.default = Stats;
