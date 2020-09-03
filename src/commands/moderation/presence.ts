/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ActivityType, Message, PresenceStatusData } from 'discord.js';
import { Command } from '../../managers/commands';
import { Presence } from '../../objects/types';
import fs from 'fs';

class PresenceCommand extends Command {

    public name = 'presence';
    public aliases: string[] = [];
    public desc = 'Change the bot presence such as status and the message';

    public async execute(prefix: string, args: string[], msg: Message): Promise<any> {
        const { channel, client, member } = msg;

        if (!member?.hasPermission('ADMINISTRATOR'))
            return channel.send('No permission!').then(m => m.delete({ timeout: 3_000 }));
        if (!args[0])
            return channel.send(`Usage: ${prefix}presence [status/type/message]`);

        const presence: Presence = require('../../../resources/presence.json');
        switch (args[0].toLowerCase()) {
            case 'status': {
                if (!args[1])
                    return channel.send(`Usage: ${prefix}presence status [ONLINE/IDLE/DND/OFFLINE]`);

                const status = args[1].toUpperCase();
                try {
                    await client.user?.setPresence({ status: status as PresenceStatusData });
                    presence.status = status as Presence['status'];
                } catch (error) {
                    return channel.send('Failed to set bot presence status!');
                }

                channel.send('Successfully set bot presence status to `' + status + '`!')
                    .then(m => m.delete({ timeout: 5_000 }));
                break;
            }
            case 'type': {
                if (!args[1])
                    return channel.send(`Usage: ${prefix}presence type [CUSTOM_STATUS/LISTENING/PLAYING/STREAMING/WATCHING]`);

                const type = args[1].toUpperCase();
                try {
                    await client.user?.setPresence({ activity: { type: type as ActivityType, name: presence.activity.message } });
                    presence.activity.type = type as ActivityType;
                } catch (error) {
                    return channel.send('Failed to set bot presence type!');
                }

                channel.send('Successfully set bot presence type to `' + type + '`!')
                    .then(m => m.delete({ timeout: 5_000 }));
                break;
            }
            case 'message': {
                if (!args[1])
                    return channel.send(`Usage: ${prefix}status message <message>`);

                const message = args.splice(1).join(' ');
                try {
                    await client.user?.setPresence({ activity: { type:presence.activity.type, name: message } });
                    presence.activity.message = message;
                } catch (error) {
                    return channel.send('Failed to set bot presence message!');
                }

                channel.send('Successfully set bot presence message to `' + message + '`!')
                    .then(m => m.delete({ timeout: 5_000 }));
                break;
            }
            default:
                return await this.execute(prefix, [], msg);
        }

        const json = JSON.stringify(presence, null, 4);
        fs.writeFileSync('./resources/presence.json', json, { encoding: 'utf-8' });
    }

}

export const command = new PresenceCommand();