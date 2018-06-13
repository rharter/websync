"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProgressBar = require("progress");
/**
 * Returns a function `ProgressBarFunc` to be called progressively with `percentComplete`, and
 * an optional map of `tokens` to be interpolated into the format string.
 */
function progressBar(format, total) {
    if (total === void 0) { total = 15; }
    var tick = 0;
    var bar = new ProgressBar(format, {
        total: total,
        incomplete: ':',
        complete: '\u2588',
        clear: true,
    });
    return function (percentComplete, tokens) {
        if (tokens === void 0) { tokens = {}; }
        if (bar.complete)
            return;
        var delta = Math.floor(percentComplete * total) - tick;
        tick += delta;
        bar.tick(delta, tokens);
    };
}
exports.default = progressBar;
