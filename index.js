const { Client } = require('discord.js');
const { CommandManager } = require('./manager/commands.js');
const { ListenManager } = require('./manager/listeners.js');

const client = new Client({
    partials: ['USER', 'MESSAGE', 'REACTION']
});

// loads the .env
require('dotenv').config();
// loads the config.json
const config = require('config.json');

const cmdManager = new CommandManager(config['prefix']);
const listenManager = new ListenManager();

// loads the commands and listeners
cmdManager.loadCommands('./commands');
listenManager.loadListeners(client, './listeners');

cmdManager.startWorking(client);

client.login(process.env.BOT_TOKEN);