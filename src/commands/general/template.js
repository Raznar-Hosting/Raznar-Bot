const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'template',
    aliases: ['link', 'promote', 'discord'],
    desc: 'Shows the discord information',
    /**
     * @param {string} prefix 
     * @param {string[]} args
     * @param {Message} msg 
     */
    execute: async (prefix, args, msg) => {
        const templateContent = fs.readFileSync('./resources/template-promotion.txt', { encoding: 'utf-8' });
        const config = require('../../../resources/config.json');

        const { channel, guild } = msg;

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(guild.iconURL)
            .setDescription(templateContent)
            .setFooter(config['footer']);

        return channel.send(embed);
    }
}