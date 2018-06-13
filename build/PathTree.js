"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var splitPath = function (path) { return path.split('/').filter(function (s) { return !!s; }); };
var joinPaths = function (paths, count) {
    if (count === void 0) { count = -1; }
    return paths.slice(0, count < 0 ? paths.length : count).join('/');
};
var Node = (function () {
    function Node(name, path, parent) {
        this.children = [];
        this.parent = null;
        this.name = name;
        this.path = path;
        if (parent) {
            this.parent = parent;
        }
    }
    Node.prototype.toJSON = function () {
        return {
            name: this.name,
            path: this.path,
            children: this.children,
        };
    };
    return Node;
}());
exports.Node = Node;
var PathTree = (function () {
    function PathTree(paths) {
        var _this = this;
        this.root = new Node('%ROOT%', '/');
        if (paths) {
            paths.forEach(function (path) { return _this.add(path); });
        }
    }
    PathTree.prototype.add = function (path) {
        var _this = this;
        var paths = splitPath(path);
        var context = this.root;
        paths.forEach(function (path, i) {
            var node = _this.lookup(paths[i], context);
            if (!node) {
                node = new Node(paths[i], joinPaths(paths, i + 1), context);
                context.children.push(node);
            }
            context = node;
        });
        return context;
    };
    PathTree.prototype.lookup = function (path, context) {
        if (context === void 0) { context = this.root; }
        var paths = splitPath(path);
        for (var i = 0; i < paths.length; i++) {
            var prevContext = context;
            for (var j = 0; j < context.children.length; j++) {
                if (paths[i] === context.children[j].name) {
                    context = context.children[j];
                    break;
                }
            }
            // No node was found
            if (context === prevContext) {
                return null;
            }
        }
        return context;
    };
    PathTree.prototype.walk = function (pathOrNode, fn) {
        var node;
        if (typeof pathOrNode === 'string') {
            node = this.lookup(pathOrNode);
        }
        else {
            node = pathOrNode;
        }
        if (!node)
            return;
        var queue = [node];
        while (queue.length) {
            var n = queue.shift();
            if (!n)
                continue;
            fn(n);
            queue.push.apply(queue, n.children);
        }
    };
    PathTree.prototype.countAllChildren = function (pathOrNode, onlyFiles) {
        var _this = this;
        if (pathOrNode === void 0) { pathOrNode = this.root; }
        if (onlyFiles === void 0) { onlyFiles = true; }
        var count = 0;
        this.walk(pathOrNode, function (node) {
            count += onlyFiles ? _this.countDirectChildren(node) : node.children.length;
        });
        return count;
    };
    PathTree.prototype.countDirectChildren = function (pathOrNode) {
        if (pathOrNode === void 0) { pathOrNode = this.root; }
        var node = typeof pathOrNode === 'string'
            ? this.lookup(pathOrNode)
            : pathOrNode;
        if (!node)
            return 0;
        // only counts "files"
        return node.children.filter(function (child) { return child.children.length === 0; }).length;
    };
    return PathTree;
}());
exports.default = PathTree;
