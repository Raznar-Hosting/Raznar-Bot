const { Client } = require('discord.js');
const { CommandManager } = require('./manager/commands.js');
const { ListenManager } = require('./manager/listeners.js');
const sqlite = require('better-sqlite3');

const client = new Client({
    partials: ['USER', 'MESSAGE', 'REACTION']
});

// loads the .env
require('dotenv').config();
// loads the config.json
const config = require('./config.json');

const cmdManager = new CommandManager(config['prefix']);
const listenManager = new ListenManager();

// loads the commands and listeners
cmdManager.loadCommands('./commands');
listenManager.loadListeners(client, './listeners');

cmdManager.startWorking(client);

const ticketdb = sqlite('./db/ticket.db');
ticketdb.prepare(`
    CREATE TABLE IF NOT EXISTS tickets (user_id VARCHAR(128) NOT NULL, channel_id VARCHAR(128) NOT NULL);
`).run();

module.exports = {
    cmdManager: cmdManager,
    listenManager: listenManager,
    ticketdb: ticketdb
}

client.login(process.env.BOT_TOKEN);