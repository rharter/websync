"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var minimatch = require("minimatch");
var GlobTable = (function () {
    function GlobTable(map) {
        this.map = map;
    }
    GlobTable.prototype.lookup = function (key) {
        var globs = Object.keys(this.map);
        var ret = [];
        for (var i = 0; i < globs.length; i++) {
            if (minimatch(key, globs[i])) {
                ret.push(this.map[globs[i]]);
            }
        }
        return ret;
    };
    return GlobTable;
}());
exports.default = GlobTable;
