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

app.get('/hello', (req, res) => res.send({ message: 'ok' }));

app.get('/containers', (req, res) => dockerApi.getContainers().then(data => res.send(data)));
app.get('/images', (req, res) => dockerApi.getImages().then(data => res.send(data)));

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
Example
options = {
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
**/
app.post('/containers/run', (req, res) => {

    if (!req.body) {
        return res.status(422).send({ error: 'Need options.' });
    }

    dockerApi.runContainer(req.body, req.params.name || null)
        .then(data => res.send({ message: data }))
        .catch(err => res.status(500).send({ error: err }));
    }
);

app.post('/containers/:id/start', (req, res) => {
    dockerApi.startContainer(req.params.id)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ error: err }));
    }
);

app.post('/containers/:id/stop', (req, res) => {
    dockerApi.stopContainer(req.params.id)
        .then(() => res.send({ message: 'ok '}))
        .catch(err => res.status(500).send({ error: err }));
    }
);

app.post('/containers/:id/kill', (req, res) => {
    dockerApi.killContainer(req.params.id)
        .then(() => res.send({ message: 'ok '}))
        .catch(err => res.status(500).send({ error: err }));
    }
);

const port = process.env.NODE_PORT || 8080;

app.listen(port);
console.log(`🌏  Server start on port ${port}`);
