const { Message } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'botlock',
    aliases: ['lock'],
    desc: 'Locks or unlocks the bot, if locked the bot can only execute commands on certain channels',
    /**
     * @param {string} prefix
     * @param {string[]} args
     * @param {Message} msg
     */
    execute: async (prefix, args, msg) => {
        const { channel, member } = msg;

        if (!member.hasPermission('ADMINISTRATOR'))
            return channel.send('No permission!').then(m => m.delete({timeout: 3_000}));

        const config = require('../../../resources/config.json');
        config['bot-lock'] = !config['bot-lock'];
        
        let message = '';
        if (config['bot-lock'])
            message = 'The bot has been locked! You can only use the bot within certain channels!';
        else
            message = 'The bot has been unlocked! You can now use the bot in every channel!';

        // saves the file
        fs.writeFileSync(
            './resources/config.json', 
            JSON.stringify(config, null, 4),
            { encoding: 'utf-8' }
        );
        return channel.send(message).then(m => m.delete(10_000));
    }
}