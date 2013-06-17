(function () {
    'use strict';

    var im = require('imagemagick');
    var fs = require('fs');
    var path = require('path');

    var options = {
        baseDir: 'C:\\aaa\\pictest',
        pictureExtensions: ['.jpg', '.jpeg', '.png', '.gif']
    };

    var resize = function(file, callback) {
        im.resize({
            srcData: fs.readFileSync(file, 'binary'),
            width: 150
        }, function (err, stdout) {
            if (err) { throw err; }
            var filename = path.basename(file).split('.')[0] + '-small' + path.extname(file);
            filename = path.join(path.dirname(file), filename);
            fs.writeFileSync(filename, stdout, 'binary');
            callback();
        });
    }

    var _isPicture = function (filename) {
        return options.pictureExtensions.indexOf(path.extname(filename).toLowerCase()) > -1 ? true : false;
    };

    var depth = 0;
    var resizeAll = function (dir) {
        depth++;
        if (!dir) {
            dir = options.baseDir;
        }
        fs.readdir(dir, function (err, list) {
            if (err) { throw err; }
            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file) { return; }
                file = new Buffer(path.join(dir, file), 'utf8').toString('utf8');
                fs.stat(file, function (err, stat) {
                    if (err) { throw err; }
                    if (stat.isDirectory()) {
                        resizeAll(file);
                        next();
                    } else if (_isPicture(file) && file.indexOf('-small') < 0) {
                        resize(file, next);
                    } else {
                        next();
                    }
                });
            })();
        });
    };

    resizeAll(options.baseDir);

} ());