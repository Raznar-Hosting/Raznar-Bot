const { Message, MessageEmbed } = require('discord.js');
const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');

module.exports = {
    name: 'instagram',
    aliases: ['insta', 'ig'],
    /**
     * @param {string} prefix
     * @param {string[]} args
     * @param {Message} msg
     */
    execute: async (prefix, args, msg) => {
        const channel = msg.channel;
        if (!args[0])
            return channel.send(`Usage: ${prefix}instagram <name>`);

        let userRaw = {};
        try {
            const res = await axios.get(`https://www.instagram.com/${args[0]}`, {
                headers: { 'user-agent': 'Mozilla/5.0' }
            });

            const $ = cheerio.load(res.data);
            const script = $('body > script').get()[0];

            const data = String(script.children[0].data)
                .substring('window._sharedData = '.length)
                .replace(/;$/g, '');

            const json = JSON.parse(data);
            userRaw = json['entry_data']['ProfilePage'][0]['graphql']['user'];
        } catch (error) {
            return channel.send('Failed to fetch instagram user for ' + args[0] + '!');
        }

        const user = userRaw;
        
        const embed = new MessageEmbed()
            .setTitle(`${user.username}'s instagram`)
            .setColor('RANDOM')
            .setThumbnail(user.profile_pic_url_hd)
            .addField('Full Name', user.full_name)
            .addField('Biography', '```\n' + user.biography + '```')
            .addField('Followers', user.edge_followed_by.count, true)
            .addField('Following', user.edge_follow.count, true)
            .addField('Posts', user.edge_owner_to_timeline_media.count, true)
            .addField('Is Private', user.is_private ? 'Yes' : 'No', true);

        channel.send(embed);
    }
}