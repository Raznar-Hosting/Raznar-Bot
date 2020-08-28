const { Message, MessageEmbed } = require("discord.js");
const config = require('../../../resources/config.json');

module.exports = {
    name: 'help',
    aliases: ['helpme', 'idk'],

    /**
     * executes the help command
     * 
     * @param {string} prefix 
     * @param {Message} msg 
     */
    execute: async (prefix, args, msg) => {
        const main = require('../../index.js');
        const manager = main.cmdManager;

        const channel = msg.channel;
        const names = [];

        for (const name of manager.commandMap.keys())
            names.push('`' + name + '`');

        const embed = new MessageEmbed()
            .setTitle('~~[----~~ Help Page ~~-----]~~')
            .setColor('RANDOM')
            .setDescription('The list of commands ' 
                + '\n'
                + '\n' + names.join(', '))
            .setFooter(config['footer'])

        await channel.send(embed);
    }
}
