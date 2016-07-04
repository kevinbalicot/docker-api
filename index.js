'strict mode';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dockerApi = require('./services/docker-api');
const utils = require('./services/utils');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Ping route
 */
app.get('/hello', (req, res) => res.send({ message: 'ok' }));

/**
 * Get list of containers
 */
app.get('/containers', (req, res) => dockerApi.getContainers().then(data => res.send(data)));

/**
 * Get list of images
 */
app.get('/images', (req, res) => dockerApi.getImages().then(data => res.send(data)));

/**
 * Create a new image
 * Body
 *      image : image name, exemple node:6
 */
app.post('/images', (req, res) => {

    if (!req.body.image) {
        return res.status(422).send({ error: 'Need image.' });
    }

    dockerApi.createImage(req.body.image)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ error: err }));
    }
);

/**
 * Run a container with docker params
 * Body
 *      json file, example
            {
                Image: 'node:6',
                Volumes: { "/volume": {} },
                Cmd: ['node', '/volume/server.js'],
                ExposedPorts: { "8080/tcp": {} },
                Env: ['NODE_PORT=8080'],
                HostConfig: {
                    Binds: ['/var/projects/my-project:/volume'],
                    PortBindings: { "8080/tcp": [{ HostPort: "8080" }] }
                }
            };
* Params
*       ?name: name of container
*/
app.post('/containers/run', (req, res) => {

    if (!req.body) {
        return res.status(422).send({ error: 'Need options.' });
    }

    dockerApi.runContainer(req.body, req.params.name || null)
        .then(data => res.send({ message: data }))
        .catch(err => res.status(500).send({ error: err }));
    }
);

/**
 * Start a container by id
 */
app.post('/containers/:id/start', (req, res) => {
    dockerApi.startContainer(req.params.id)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ error: err }));
    }
);

/**
 * Stop a container by id
 */
app.post('/containers/:id/stop', (req, res) => {
    dockerApi.stopContainer(req.params.id)
        .then(() => res.send({ message: 'ok '}))
        .catch(err => res.status(500).send({ error: err }));
    }
);

/**
 * Kill a container by id
 */
app.post('/containers/:id/kill', (req, res) => {
    dockerApi.killContainer(req.params.id)
        .then(() => res.send({ message: 'ok '}))
        .catch(err => res.status(500).send({ error: err }));
    }
);

/**
 * Delete a container by id
 * Params
 *      ?v : delete volume
 *      ?force : force delete
 */
app.delete('/containers/:id', (req, res) => {
    dockerApi.removeContainer(req.params.id, req.params.v || false, req.params.force || false)
        .then(() => res.send({ message: 'ok '}))
        .catch(err => res.status(500).send({ error: err }));
});

const port = process.env.NODE_PORT || 8080;

app.listen(port);
console.log(`🌏  Server start on port ${port}`);
