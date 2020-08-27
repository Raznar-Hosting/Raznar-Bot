const { Message } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'status',
    aliases: ['presence', 'stats'],
    /**
     * @param {string} prefix
     * @param {string[]} args
     * @param {Message} msg
     */
    execute: async (prefix, args, msg) => {
        const channel = msg.channel;

        if (!msg.member.hasPermission('ADMINISTRATOR'))
            return channel.send('No permission!').then(m => m.delete({ timeout: 3_000 }));
        if (!args[0])
            return channel.send(`Usage: ${prefix}status [type/message]`);

        const config = require('../../config.json');
        switch (args[0].toLowerCase()) {
            case 'type': {
                if (!args[1])
                    return channel.send(`Usage: ${prefix}status type [CUSTOM_STATUS/LISTENING/PLAYING/STREAMING/WATCHING]`);

                const type = args[1].toUpperCase();
                try {
                    await msg.client.user.setPresence({ activity: { type: type, name: config['status']['message'] } })
                    config['status']['type'] = type;
                } catch (error) {
                    return channel.send('Failed to set bot status type!');
                }

                channel.send('Successfully set bot status type to `' + type + '`!');
                break;
            }
            case 'message': {
                if (!args[1])
                    return channel.send(`Usage: ${prefix}status message <message>`);

                const message = args.splice(1).join(' ');
                try {
                    await msg.client.user.setPresence({ activity: { type: config['status']['type'], name: message } })
                    config['status']['message'] = message;
                } catch (error) {
                    return channel.send('Failed to set bot status message!');
                }

                channel.send('Successfully set bot status message to `' + message + '`!');
                break;
            }
            default:
                return module.exports.execute(prefix, [], msg);
        }
        
        const json = JSON.stringify(config, null, 4);
        fs.writeFileSync('./config.json', json, {encoding: 'utf-8'});
    }
}