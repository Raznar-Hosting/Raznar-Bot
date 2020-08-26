const { Client } = require('discord.js');
const fs = require('fs');
const { userInfo } = require('os');
const { AsyncFunction } = require('../objects/misc.js');

class CommandManager {

    /** determines if the manager is working with commands */
    isWorking = false;

    /**
     * this map stores all commands
     * 
     * @type {Map<string, object>}
     */
    commandMap = new Map();

    /** the command prefix */
    prefix = '';

    constructor(prefix) {
        this.prefix = prefix;
    }

    /**
     * loads all commands from a folder that contains all commands instances
     * 
     * @param {fs.PathLike} path to the commands folder
     */
    loadCommands(path) {
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

            const command = require(fullPath);

            // validates the command
            if (!command || !command.name || this.findCommand(name))
                continue;
            // the command execute function must be an async function
            if (!(command.execute instanceof AsyncFunction))
                continue;

            // adds the command    
            this.commandMap.set(command.name, command);
        }
    }

    /**
     * tries to find a command based on the name or aliases
     * 
     * @param {string} name the command name or alias
     * @returns the command object if found, otherwise `null`
     */
    findCommand(name) {
        if (this.commandMap.has(command.name))
            return this.commandMap.get(name);

        const commands = Array.from(this.commandMap.values);
        for (const cmd in commands) {
            if (cmd.aliases.includes(name))
                return cmd;
        }

        return null;
    }

    /**
     * starts the command manager
     * this will make sure that all commands are running
     * 
     * @param {Client} client 
     */
    startWorking(client) {
        if (this.isWorking)
            throw Error('The command manager is already working!')

        this.isWorking = true;
        client.on('message', async (msg) => {
            const content = msg.content;

            // the command sender must be a valid user
            if (msg.author.bot || msg.webhookID)
                return;
            if (!content.startsWith(this.prefix))
                return;

            const args = content.slice(this.prefix.length).split(' ');
            const name = array.shift().toLowerCase();

            const command = this.findCommand(name);
            if (!command)
                return;

            // executes the command if found
            command.execute(this.prefix, args, msg);
        });
    }

}

module.exports = { CommandManager }