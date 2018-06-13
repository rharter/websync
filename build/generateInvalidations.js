"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PathTree_1 = require("./PathTree");
// @see: http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html#invalidation-specifying-objects
exports.match = function (path, pattern) {
    path = exports.normalizeInvalidationPath(path, false);
    pattern = exports.normalizeInvalidationPath(pattern, false);
    var re;
    if (/\/\*$/.test(pattern)) {
        // Cases:
        // 1. /foo/.../bar/* -> matches any object directly within `/foo/.../bar`
        // 2. /* -> matches all objects in distribution
        re = pattern === '/*'
            ? /.*/
            : new RegExp("^" + pattern.replace(/\/\*$/, '\/[^/]*') + "$");
    }
    else if (/\*$/.test(pattern)) {
        // /foo/bar* -> matches any object in `/foo/bar` and subdirectories if `bar` is a directory.
        // Otherwise, matches any files with in `/foo` that start with `bar`
        re = new RegExp("^" + pattern.replace(/\*$/, '.*') + "$");
    }
    else {
        // strict equality
        return path === pattern;
    }
    return re.test(path);
};
exports.normalizeInvalidationPath = function (path, wildcard) {
    if (wildcard === void 0) { wildcard = false; }
    if (path[0] !== '/')
        path = "/" + path;
    if (path[path.length - 1] !== '*' && wildcard)
        path = path + "*";
    return path;
};
exports.isInvalidated = function (path, invalidations) {
    return invalidations.some(function (invalidation) { return exports.match(path, invalidation); });
};
exports.shouldWildcard = function (diffChildCount, itemChildCount, policy) {
    // No children. It's a file.
    if (itemChildCount === 0) {
        return false;
    }
    switch (policy) {
        case 'minority':
            return diffChildCount > 0;
        case 'majority':
            return diffChildCount / itemChildCount > 0.5;
        case 'unanimous':
            return diffChildCount === itemChildCount;
    }
};
function generateInvalidations(_a) {
    var diffs = _a.diffs, targetItems = _a.targetItems, _b = _a.wildcardPolicy, wildcardPolicy = _b === void 0 ? 'majority' : _b, _c = _a.wildcardAll, wildcardAll = _c === void 0 ? false : _c, _d = _a.invalidateDeletes, invalidateDeletes = _d === void 0 ? true : _d;
    var filterDiffTypes = ['CREATE'];
    if (!invalidateDeletes)
        filterDiffTypes.push('DELETE');
    diffs = diffs.filter(function (diff) { return !~filterDiffTypes.indexOf(diff.type); });
    // TODO: Create two trees -- one for `targetItems` (represents target container)
    // and another for `diffs`. Walk the diff tree, at each node compare the children
    // count to the children count of the `targetItem` tree, use `wildcardPolicy` to
    // determine whether, or not, a given wildcard can be generated for a given
    // `diff` tree Node.
    var itemTree = new PathTree_1.default(targetItems.map(function (item) { return item.key; }));
    var diffTree = new PathTree_1.default(diffs.map(function (d) { return d.key; }));
    var invalidationPaths = [];
    var absoluteDiffMap = diffs.reduce(function (map, diff) {
        map[diff.key] = true;
        return map;
    }, {});
    diffTree.walk('/', function (diffNode) {
        if (exports.isInvalidated(diffNode.path, invalidationPaths)) {
            return;
        }
        var itemNode = itemTree.lookup(diffNode.path);
        if (!itemNode) {
            throw new Error("Expected item tree to have node: \"" + diffNode.path + "\"");
        }
        var diffChildCount = diffTree.countAllChildren(diffNode);
        var itemChildCount = itemTree.countAllChildren(itemNode);
        var diffDirectChildCount = diffTree.countDirectChildren(diffNode);
        var isWildcarded = exports.shouldWildcard(diffChildCount, itemChildCount, wildcardPolicy);
        var path = diffNode.path;
        // If the current path is a "directory" (because it's wildcarded) and all of the invalidations
        // required are direct children, then append a "/" to the path. See the Amazon Documentation
        // reference above for more info. Basically, a path like "/foo/*" will only invalidate direct
        // children of "foo", whereas "/foo*" invalidates all of the children.
        if (isWildcarded && path[path.length - 1] !== '/' && diffChildCount === diffDirectChildCount) {
            path += '/';
            isWildcarded = true;
        }
        // If the path is not wildcarded by now, the only case in which this path should be invalidated
        // is if it is an absolute path of a Transfer Operation, i.e. it's being invalidated itself.
        // Thus, if it's not in `absoluteDiffMap`, then don't invalidate because it means that it
        // has a child that is being invalided.
        if (!isWildcarded && !absoluteDiffMap[itemNode.path]) {
            return;
        }
        var invalidationPath = exports.normalizeInvalidationPath(path, isWildcarded || wildcardAll);
        invalidationPaths.push(invalidationPath);
    });
    return invalidationPaths;
}
exports.default = generateInvalidations;
