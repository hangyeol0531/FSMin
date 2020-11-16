const net = require('net');
const file = require('./file');
//const dns = require('dns');

const hosts = require('../config.json').hosts;

//const saveFile()
const delFile = (host, filename, cb)=>{
    const conn = net.connect(host.port, host.ip, ()=>{
        conn.write(`[DEL]${filename}`);
    });
    conn.on('error',err=>{
        cb('[ERROR] node server closed.');
    });
    conn.on('data', data=>{
        if(data.toString() == 'OK'){
            cb(undefined);
        }
        else{
            cb(`[ERROR] delete failed ${data}`);
        }
    });
}


const getDiskSize = (nodeList, callback) =>{
    let arr = [];
    let checked = 0;
    nodeList.forEach((host,idx) => {
        const conn = net.connect(host.port, host.ip, ()=>{
            conn.on('lookup',(err)=>{
                console.log('asdfasfae')
                console.log(err);
            })
            conn.write('[GET] SIZE');
            conn.on('data', size =>{
                arr[idx] = (parseInt(size.toString()));    
                conn.end('OK');

                if(++checked == nodeList.length) callback(arr);
            });
        });
        conn.on('error',(error)=>{
            console.log(`Server Error (${host.ip}:${host.port})`);
            arr[idx] = 'X';    
            if(++checked == nodeList.length) callback(arr);
        });
    });
};

const ar = [{"ip":"localhost","port":5000}];

delFile(hosts[0],"test.txt",(err)=>{
    if(err) throw err;
    console.log(err);
})

// getDiskSize(hosts,(data)=>{
//     console.log(data);
// });
