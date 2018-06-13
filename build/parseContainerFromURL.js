"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Url = require("url");
var FileContainer_1 = require("./FileContainer");
var S3Container_1 = require("./S3Container");
var FILE_PROTO_RE = /^file\:\/\//;
// file: ./foo/bar
// file: /foo/bar
// file: foo/bar
// file: file:///foo/bar
// s3: s3://buckename
// s3: s3://buckname/prefix
function parseContainerFromURL(url) {
    var urlObj = Url.parse(url);
    if (!urlObj.protocol) {
        return new FileContainer_1.default(url);
    }
    if (urlObj.protocol === 'file:') {
        return new FileContainer_1.default(url.replace(FILE_PROTO_RE, ''));
    }
    if (urlObj.protocol === 's3:') {
        if (!urlObj.hostname) {
            throw new Error("Missing s3 bucket name.");
        }
        var prefix = urlObj.pathname || '';
        return new S3Container_1.default(urlObj.hostname, prefix);
    }
    throw new Error("Could not interpret URL: \"" + url + "\"");
}
exports.default = parseContainerFromURL;
