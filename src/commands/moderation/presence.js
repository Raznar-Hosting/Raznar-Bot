const { Message } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'presence',
    aliases: [],
    /**
     * @param {string} prefix
     * @param {string[]} args
     * @param {Message} msg
     */
    execute: async (prefix, args, msg) => {
        const { channel, client } = msg;

        if (!msg.member.hasPermission('ADMINISTRATOR'))
            return channel.send('No permission!').then(m => m.delete({ timeout: 3_000 }));
        if (!args[0])
            return channel.send(`Usage: ${prefix}status [type/message]`);

        const presence = require('../../../resources/presence.json');
        switch (args[0].toLowerCase()) {
            case 'status': {
                if (!args[1])
                    return channel.send(`Usage: ${prefix}presence status [ONLINE/IDLE/DND/OFFLINE]`);

                const status = args[1].toUpperCase();
                try {
                    await client.user.setPresence({ status: status });
                    presence['status'] = status;
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
                    await client.user.setPresence({ activity: { type: type, name: presence['activiy']['message'] } });
                    presence['activiy']['type'] = type;
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
                    await client.user.setPresence({ activity: { type: presence['activiy']['type'], name: message } })
                    presence['activiy']['message'] = message;
                } catch (error) {
                    return channel.send('Failed to set bot presence message!');
                }

                channel.send('Successfully set bot presence message to `' + message + '`!')
                    .then(m => m.delete({ timeout: 5_000 }));
                break;
            }
            default:
                return module.exports.execute(prefix, [], msg);
        }

        const json = JSON.stringify(presence, null, 4);
        fs.writeFileSync('./resources/presence.json', json, { encoding: 'utf-8' });
    }
}