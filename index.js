var path = require('path');
var fs = require('fs');

module.exports = function (app, options) {
    if (!options || typeof options.root === 'string') {
        if (!path.isAbsolute(options.root)) {
            options.root = path.join(process.cwd(), options.root);
        }
    } else {
        throw Error('root must be specified');
    }
    options.suffix = options.suffix || '.js';
    options.action = options.action || 'index';

    return function* koaResource(next) {
        var url = this.url.split('?');
        var querystring = url[1];

        var url = url[0].split(path.sep);
        for (var i = 0; i < url.length; i++) {
            if (i == url.length - 2) {
                url[i] += options.suffix;
            }
        }

        var _url = '';
        var params = [];
        var action = options.action;
        for (var i = 0; i < url.length - 1; i++) {
            if (!url[i]) {
                continue;
            }

            var exists = fs.existsSync(options.root + _url + '/' + url[i]);
            if (exists) {
                _url += '/' + url[i];
            } else {
                params.push(url[i]);
            }

            if (url.length - 2 == i && !exists) {
                throw Error('Not Found');
            }
        }

        this.params = params;
        this.querystring = querystring;

        var _require = require(path.join(options.root, _url));
        yield _require[action](this, next);

        yield next;
    };
};