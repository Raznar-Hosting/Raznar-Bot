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
        if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
            console.error(`Cannot find path named ${path} or the file isn't a directory!`);
            return;
        }

        const fileList = fs.readdirSync(path)
            .filter(value => !value.startsWith('_') && value.endsWith('.js'));

        for (const file of fileList) {
            const fullPath = path + file;

            if (!fs.existsSync(fullPath))
                continue;

            const listener = require(fullPath);
            
            if (!listener || !listener.name || !listener.call)
                continue;
            if (!(listener.call instanceof AsyncFunction))
                continue;

            client.on(listener.name, (...args) => listener.call(client, ...args));
        }
    }

}

module.exports = { ListenManager }