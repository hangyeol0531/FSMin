const fs = require('fs');
const net = require('net');

const sendFile = require('./file');

function owfsStorage(opts){
    this.getDestination = (opts.destination);
    this.getFileName = (opts.filename);

    
}

owfsStorage.prototype._handleFile = function _handleFile(req, file, cb){
    var that = this;
    console.log(this.getDestination);
    
    that.getDestination(req, file, function(err, dest){
        if (err) return cb(err);
        console.log(this.getFileName);
        that.getFileName(req, file, function(err, filename){
            
            if(err) return cb(err);
            const conn = net.createConnection(dest.port, dest.ip, ()=>{
                sendFile.sendStreamSlave(file.stream, conn, filename, (packcnt,packsize)=>{
                    cb(null, {
                        path: dest,
                        size: packsize
                    })
                });
            });
            
        });
        
        
    });
}

owfsStorage.prototype._removeFile = function _removeFile(req, file, cb){
    fs.unlink(file.path, cb);
}

module.exports = function(opts){
    return new owfsStorage(opts);
}