const discord = require('discord.js');
const fs = require('fs');
const { AsyncFunction } = require('../objects/misc.js');

class ListenManager {

    /**
     * loads all listeners from a folder that contains all listener instances
     * 
     * @param {discord.Client} client
     * @param {fs.PathLike} filePath to the listeners folder
     * @param {fs.PathLike} requirePath to be able to use the 'require' function
     */
    loadListeners(client, filePath, requirePath) {
        if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isDirectory()) {
            console.error(`Cannot find path named ${filePath} or the file isn't a directory!`);
            return;
        }

        for (const file of fs.readdirSync(filePath)) {
            const fullFilePath = filePath + (filePath.endsWith('/') ? '' : '/') + file;
            const fullRequirePath = requirePath + '/' + file

            if (!fs.existsSync(fullFilePath))
                continue;
            // if the path is a dir, do another repeat scan but for that dir
            if (fs.lstatSync(fullFilePath).isDirectory()) {
                this.loadListeners(client, fullFilePath, fullRequirePath);
                continue;
            }
            // file must be valid
            if (file.startsWith('__') || !file.endsWith('.js'))
                continue;

            const listener = require(fullRequirePath);

            // validates the listener
            if (!listener || !listener.name || !listener.call)
                continue;
            // the call function must be an async function
            if (!(listener.call instanceof AsyncFunction))
                continue;

            console.log(`Loaded listener from ${file}!`);
            client.on(listener.name, (...args) => listener.call(client, ...args));
        }
    }

}

module.exports = { ListenManager }