const fs = require('fs');

const sendFile = require('./file');

const owfsStorage = (opts) => {
    this.getDestination = (opts.destination);
    this.getFilename = (opts.filename);
}

owfsStorage.prototype._handleFile = (req, file, cb) => {
    this.getDestination(req, file, (err, dest) => {
        if (err) return cb(err);
        this.getFilename(req, file, (err, filename) => {
            if(err) return cb(err);

            sendFile.sendStreamSlave(file.stream, dest, filename);
        });
    });
}

owfsStorage.prototype._removeFile = (req, file, cb) => {
    fs.unlink(file.path, cb);
}

module.exports = (opts) => {
    return new owfsStorage(opts);
}