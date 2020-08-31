/* eslint-disable @typescript-eslint/no-var-requires */
import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../../managers/commands';
import { Config, Package as Packaging } from '../../objects/types';

class HelpCommand extends Command {

    public name = 'help';
    public aliases: string[] = ['helpme', 'idk'];
    public desc = 'Shows the full command list';

    public async execute(prefix: string, args: string[], msg: Message) {
        const config: Config = require('../../../resources/config.json');
        const packaging: Packaging = require('../../index');

        const cmdManager = packaging.cmdManager;
        const { channel } = msg;

        const embed = new MessageEmbed()
            .setTitle('~~[----~~ Help Page ~~-----]~~')
            .setColor('RANDOM')
            .setFooter(config['footer']);

        if (!args[0]) {
            const names = [];
            for (const name of cmdManager.commandMap.keys())
                names.push('`' + name + '`');

            embed.setDescription('The list of commands '
                + '\n'
                + '\n' + names.join(', '));
        } else {
            const possibleCmd = args[0].toLowerCase();
            const command = cmdManager.findCommand(possibleCmd);

            if (!command)
                return channel.send('Cannot find any command or aliases called `' + possibleCmd + '`!');

            embed.setDescription(
                '**Name:** ' + command.name
                + '\n**Aliases:** [' + command.aliases.join(', ') + ']'
                + '\n**Description**: ' + (!command.desc ? 'None' : command.desc)
            );
        }

        await channel.send(embed);
    }

}

export const command = new HelpCommand();