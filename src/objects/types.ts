import { ActivityType, Client } from 'discord.js';
import { CommandManager } from '../managers/commands';
import { Database } from 'better-sqlite3';

/** the config typings */
export type Config = {
    /** the default command prefix */
    prefix: string,
    /** the default embed footer */
    footer: string,
    /** determines if the bot should receive from all channels or from certain channels */
    'bot-lock': boolean,
    /** the available roles */
    roles: {
        everyone: string,
        ceo: string,
        support: string,
        'plugin-maker': string,
    },
    channels:{
        /** the ticket category channel id */
        'ticket-category': string,
        /** the bot commands channel ids */
        'bot-cmds': string[]
    }
}

export type Presence = {
    /** the presence status */
    status: 'ONLINE' | 'OFFLINE' | 'IDLE' | 'DND',
    /** the presence activity */
    activity: {
        /** the presence type */
        type: ActivityType,
        /** the presence message */
        message: string
    }
}

export type Package = {
    cmdManager: CommandManager,
    client: Client,
    ticketdb: Database
}