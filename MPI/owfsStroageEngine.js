const fs = require('fs');
const net = require('net');

const sendFile = require('./file');

function owfsStorage(opts){
    this.getDestination = (opts.destination);
    this.getFileName = (opts.filename);

    
}

owfsStorage.prototype._handleFile = function _handleFile(req, file, cb){
    var that = this;
    
    that.getDestination(req, file, function(err, dest){
        if (err) return cb(err);
        that.getFileName(req, file, function(err, filename){
            let checked = 0;
            let arr = [];
            
            dest.forEach((host, idx)=>{
                if(err) return cb(err);
                const conn = net.createConnection(host.port, host.ip, ()=>{
                    conn.write('[POST]');
                });
                conn.on('data', data =>{
                    if(data == 'OK'){
                        console.log('sending')
                        sendFile.sendStreamSlave(file.stream, conn, filename, (packcnt,packsize)=>{
                            arr[idx] = 'OK';
                            if(++checked == dest.length){
                                cb(null, {
                                    path: dest,
                                    size: packsize
                                });
                            }
                        });
                    }
                })
                conn.on('error', error=>{
                    arr[idx] = 'X';
                    console.log(`Server Error (${host.ip}:${host.port})`);
                    if(++checked == dest.length){
                        cb(host, {
                            path: dest
                        });
                    }
                });

            });
            
            
        });
        
        
    });
}

owfsStorage.prototype._removeFile = function _removeFile(req, file, cb){
    var that = this;
    const filename = file.name;
    that.getDestination(err, file, function(err, dest){
        if(err) return cb(err);
        const conn = net.createConnection(dest.port, dst.ip, ()=>{
            conn.write(`[DEL]${filename}`);
        });
        conn.on('data', (data)=>{
            if(data.toString() == 'OK'){
                cb(undefined);
                delete file.destination;
                delete file.filename;
                delete file.path;
            }
            else cb('err');
        }); 
        conn.on('error',(err)=>{
            console.log(`Server Error (${host.ip}:${host.port})`);
            cb(err);
        });
    });
}

module.exports = function(opts){
    return new owfsStorage(opts);
}