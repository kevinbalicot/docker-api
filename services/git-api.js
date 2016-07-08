'use strict';

const fs = require('fs');
const git = require('nodegit');
const exec = require('child_process').exec;

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
     * Return list of repositories
     */
    getRepositories () {
        return new Promise((resolve, reject) => {
            fs.readdir(this.repositoriesPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }

    /**
     * Create a repository
     * @param name : repository name
     * @param isBare : Initialize the repository as bare or "checked out"
     */
    createRepository (name, isBare = 1) {
        return git.Repository.init(`${this.repositoriesPath}/${name}.git`, isBare)
            .then(repository => {
                // VERY VERY BAD :O
                exec(`chmod -R 777 ${this.repositoriesPath}/${name}.git`);
                return { status: 'Repository created' };
            });
    }

    /**
     * Clone a repository
     * @param name : name of repository directory
     */
    cloneRepository (path, name) {
        return git.Clone(path, `${this.repositoriesPath}/${name}.git`)
            .then(repository => {
                return { status: 'Repository cloned' };
            });
    }
}

module.exports = new GitApi();
