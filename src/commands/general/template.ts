/* eslint-disable @typescript-eslint/no-var-requires */
import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../../managers/commands';
import fs from 'fs';
import { Config } from '../../objects/types';


class TemplateCommand extends Command {
    public name = 'template';
    public aliases: string[] = ['link', 'promote', 'discord'];
    public desc = 'Shows the discord information';

    public async execute(prefix: string, args: string[], msg: Message) {
        const templateContent = fs.readFileSync('./resources/template-promotion.txt', { encoding: 'utf-8' });
        const config: Config = require('../../../resources/config.json');

        const { channel, guild } = msg;

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(guild?.iconURL() || '')
            .setDescription(templateContent)
            .setFooter(config['footer']);

        return channel.send(embed);
    }

}

export const command = new TemplateCommand();