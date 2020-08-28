const { Client } = require('discord.js');
const { CommandManager } = require('./manager/commands.js');
const { ListenManager } = require('./manager/listeners.js');
const sqlite = require('better-sqlite3');
const fs = require('fs');

const client = new Client({
    partials: ['USER', 'MESSAGE', 'REACTION']
});

// loads the .env
require('dotenv').config();
// loads the config.json
const config = require('../resources/config.json');

if (!fs.existsSync('./resources/presence.json')) {
    presence = {
        status: 'ONLINE',
        activity: {
            type: 'PLAYING',
            message: '...'
        }
    };

    fs.writeFileSync(
        './resources/presence.json',
        JSON.stringify(presence, null, 4),
        { encoding: 'utf-8' }
    );
}

const cmdManager = new CommandManager(config['prefix']);
const listenManager = new ListenManager();

// loads the commands and listeners
cmdManager.loadCommands('./src/commands');
listenManager.loadListeners(client, './src/listeners');

cmdManager.startWorking(client);

fs.mkdirSync('./db/')
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