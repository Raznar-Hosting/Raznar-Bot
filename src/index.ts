/* eslint-disable @typescript-eslint/no-var-requires */
import { Client } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import { CommandManager } from './managers/commands';
import { Config, Package } from './objects/types';
import { loadListeners } from './managers/listens';
import sqlite from 'better-sqlite3';

const config: Config = require('../resources/config.json');
// loads the 
dotenv.config();

const client = new Client({ partials: ['USER', 'MESSAGE', 'REACTION'] });
const cmdManager = new CommandManager(config.prefix);

if (!fs.existsSync('./resources/presence.json')) {
    const presence = {
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

loadListeners(client, './dist/listeners/');

cmdManager.loadCommands('./dist/commands/');
cmdManager.startWorking(client);

// creates the database dir
try {
    fs.mkdirSync('./db');
} catch (error) {
    console.error(error);
}

const ticketdb = sqlite('./db/ticket.db');
ticketdb.prepare('CREATE TABLE IF NOT EXISTS tickets (user_id VARCHAR(128) NOT NULL, channel_id VARCHAR(128) NOT NULL);')
    .run();

export const objects: Package = {
    cmdManager: cmdManager,
    client: client,
    ticketdb: ticketdb
};

client.login(process.env.BOT_TOKEN);