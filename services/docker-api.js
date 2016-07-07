'strict mode';

const exec = require('child_process').exec;

class DockerApi {

    _generateUrl (route, headers = []) {
        /*let url = `https://192.168.99.100:2376/${route} \
        --cert $DOCKER_CERT_PATH/cert.p12 \
        --pass docker \
        --key $DOCKER_CERT_PATH/key.pem \
        --cacert $DOCKER_CERT_PATH/ca.pem \
        `;*/

        let url = `--unix-socket /var/run/docker.sock http:/${route} `;

        if (headers.length > 0) {
            headers.forEach(header => url += `--Header "${header}"`);
        }

        return url;
    }

    _parseStdout (stdout) {
        try {
            let result = JSON.parse(stdout);
            return result;
        } catch (e) {
            return stdout;
        }
    }

    _formatStdout (stdout) {
        let result = stdout.split("\r\n");

        if (result.length === 1) {
            return this._parseStdout(result[0]);
        }

        return result.filter(res => !!res).map(res => this._parseStdout(res));
    }

    _exec (command) {
        return new Promise((resolve, reject) => {
           exec(command, { maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
                if (!!err) {
                    reject(err);
                } else {
                    resolve(this._formatStdout(stdout));
                }
            });
        });
    }

    _get (route) {
        const command = `curl ${this._generateUrl(route)}`;
        return this._exec(command);
    }

    _post (route, params = {}, headers = []) {
        const command = `curl -X POST ${this._generateUrl(route, headers)} --data '${JSON.stringify(params)}'`;
        return this._exec(command);
    }

    _delete (route) {
        const command = `curl -X DELETE ${this._generateUrl(route)}`;
        return this._exec(command);
    }

    /**
     * Return list of images
     */
    getImages () {
        return this._get('images/json');
    }

    /**
     * Create image
     */
    createImage (image) {
        return this._post('images/create?fromImage=' + image);
    }

    /**
     * Remove an image
     */
    removeImage (name, force = false, noprune = false) {
        return this._delete(`images/${name}?force=${force}&noprune=${noprune}`);
    }

    /**
     * Return list of containers
     */
    getContainers (all = true) {
        return this._get('containers/json?all=' + all);
    }

    /**
     * Create a container
     */
    createContainer (options, name = null) {
        return this._post(`containers/create${!!name ? '?name=' + name : ''}`, options, ["Content-Type:application/json"]);
    }

    /**
     * Start a container
     */
    startContainer (id) {
        return this._post(`containers/${id}/start`, {}, ["Content-Type:application/json"]);
    }

    /**
     * Stop a container
     */
    stopContainer (id, wait = 0) {
        return this._post(`containers/${id}/stop?t=${wait}`, {}, ["Content-Type:application/json"]);
    }

    /**
     * Kill a container
     */
    killContainer (id, signal = 'SIGKILL') {
        return this._post(`containers/${id}/kill?signal=${signal}`, {}, ["Content-Type:application/json"]);
    }

    /**
     * Remove a containers
     */
    removeContainer (id, deleteVolume = false, force = false) {
        return this._delete(`containers/${id}?v=${deleteVolume}&force=${force}`);
    }

    /**
     * Create and start container
     */
    runContainer (options, name = null) {
        return this.createContainer(options, name)
            .then(container => this.startContainer(container.Id));
    }
}

module.exports = new DockerApi();
