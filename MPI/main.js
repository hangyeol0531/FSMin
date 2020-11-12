const net = require('net');
const file = require('./file');
//const dns = require('dns');

const hosts = require('../config.json').hosts;

const saveFile()

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

getDiskSize(hosts,(data)=>{
    console.log(data);
});
