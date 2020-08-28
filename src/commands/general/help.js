const { Message, MessageEmbed } = require("discord.js");
const config = require('../../../resources/config.json');

module.exports = {
    name: 'help',
    aliases: ['helpme', 'idk'],
    desc: 'Shows the full command list',
    /**
     * executes the help command
     * 
     * @param {string} prefix 
     * @param {string[]} args
     * @param {Message} msg 
     */
    execute: async (prefix, args, msg) => {
        const main = require('../../index.js');
        const manager = main.cmdManager;

        const { channel } = msg;

        const embed = new MessageEmbed()
            .setTitle('~~[----~~ Help Page ~~-----]~~')
            .setColor('RANDOM')
            .setFooter(config['footer']);

        if (!args[0]) {
            const names = [];
            for (const name of manager.commandMap.keys())
                names.push('`' + name + '`');

            embed.setDescription('The list of commands ' 
                    + '\n'
                    + '\n' + names.join(', '));
        } else {
            const possibleCmd = args[0].toLowerCase();
            const command = manager.findCommand(possibleCmd);

            if (!command)
                return channel.send('Cannot find any command or aliases called `' + possibleCmd + '`!');

            embed.setDescription(
                '**Name:** ' + command.name
                + '\n**Aliases:** ' + command.aliases
                + '\n**Description**: ' + (command.desc ? 'None' : command.desc)
            );
        }

        await channel.send(embed);
    }
}
