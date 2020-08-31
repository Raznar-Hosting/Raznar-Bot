import { Client, PresenceStatusData } from 'discord.js';
import { Presence } from '../objects/types';

export function callEvent(client: Client): void {
    client.on('ready', async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const presence: Presence = require('../../resources/presence.json');

        client.user?.setPresence({
            status: presence.status as PresenceStatusData,
            activity: {
                name: presence['activity']['message'],
                type: presence['activity']['type']
            }
        });

        console.log('\nBot has fully started!');
    });
}