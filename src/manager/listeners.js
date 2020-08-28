const discord = require('discord.js');
const fs = require('fs');
const { AsyncFunction } = require('../objects/misc.js');

class ListenManager {

    /**
     * loads all listeners from a folder that contains all listener instances
     * 
     * @param {discord.Client} client
     * @param {fs.PathLike} path to the listeners folder
     */
    loadListeners(client, path) {
        if (!fs.existsSync(path) || !fs.lstatSync(path).isDirectory()) {
            console.error(`Cannot find path named ${path} or the file isn't a directory!`);
            return;
        }

        for (const file of fs.readdirSync(path)) {
            const fullPath = path + (path.endsWith('/') ? '' : '/') + file;

            if (!fs.existsSync(fullPath))
                continue;
            // if the path is a dir, do another repeat scan but for that dir
            if (fs.lstatSync(fullPath).isDirectory()) {
                this.loadListeners(client, fullPath);
                continue;
            }
            // file must be valid
            if (file.startsWith('__') || !file.endsWith('.js'))
                continue;

            const listener = require(`.${fullPath}`);
            
            if (!listener || !listener.name || !listener.call)
                continue;
            if (!(listener.call instanceof AsyncFunction))
                continue;

            console.log(`Loaded ${file}!`);
            client.on(listener.name, (...args) => listener.call(client, ...args));
        }
    }

}

module.exports = { ListenManager }