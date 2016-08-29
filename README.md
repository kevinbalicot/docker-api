#DOCKER API

A docker REST API to manage docker on a server remotely

## INSTALLATION

```
& npm install
$ NODE_PORT=8080 npm start
```

## USAGE

### GET
* `/hello` : ping api
* `/free-port` : get free port on server
* `/containers` : get list of containers
* `/images` : get list of images

### POST
* `/images` : create a new image
    * **name** : image name
* `/images/<name>` : delete an image by name
    * **force** : force delete (optional, default: false)
    * **noprune** : (optional, default: false)
* `/containers/run` : run a container with docker file configuration
    * **name** : name of container (optional)
    * /!\ body have to be a json file

Body example :
```
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
}

```
* `/containers/<id>/start` : start a container by id
* `/containers/<id>/stop` : stop a container by id
* `/containers/<id>/kill` : kill a container by id

### DELETE
* `/containers/<id>` : delete a container by id
