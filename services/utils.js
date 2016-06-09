'strict mode';

const exec = require('child_process').exec;
const net = require('net');

class Utils {

    isPortOpened (port) {
        return new Promise((resolve, reject) => {
            exec(`netstat -an | grep ${port} | grep LISTEN`, (err, stdout, stderr) => {

                if (!!err) {
                    return reject(err);
                }

                return resolve(stdout == '' ? null : stdout);
            });
        });
    }

    getFreePort (callback) {
        let server = net.createServer();

        server.listen(0);
        server.on('listening', () => {
            callback(server.address().port);
        });
    }
}

module.exports = new Utils();
