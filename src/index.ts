import { Client } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import config from '../resources/config.json';

// loads the 
dotenv.config();

const client = new Client({
    partials: ['USER', 'MESSAGE', 'REACTION']
});

if (!fs.existsSync('../resources/presence.json')) {
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

