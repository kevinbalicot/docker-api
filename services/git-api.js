'use strict';

const fs = require('fs');
const git = require('nodegit');

const SOURCES_PATH = '/var/docker-sources';

class GitApi {

    constructor () {
        this.repositoriesPath = SOURCES_PATH;

        // @TODO do it with better way
        try {
            fs.mkdirSync(this.repositoriesPath);
        } catch (e) {
            //do nothing
        }
    }

    /**
     * Create a repository
     * @param name : repository name
     * @param bare : Initialize the repository as bare or "checked out"
     */
    createRepository (name, bare = true) {
        return git.Repository.init(`${this.repositoriesPath}/${name}.git`, bare)
            .then(repository => { status: 'Repository created' });
    }

    /**
     * Clone a repository
     * @param name : name of repository directory
     */
    cloneRepository (path, name) {
        return git.Clone(path, `${this.repositoriesPath}/${name}.git`)
            .then(repository => { status: 'Repository cloned' });
    }
}

module.exports = new GitApi();
