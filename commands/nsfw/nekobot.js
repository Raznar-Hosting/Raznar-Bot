const { Message, MessageEmbed } = require('discord.js');
const axios = require('axios').default;

module.exports = {
    name: 'nekobot',
    aliases: [],
    /**
     * @param {string} prefix
     * @param {string[]} args
     * @param {Message} msg
     */
    execute: async (prefix, args, msg) => {
        const channel = msg.channel;

        if (!channel.nsfw)
            return channel.send("The channel isn't valid for NSFW stuff :<");

        const apiUrl = 'https://nekobot.xyz/api/image?type='
        const embed = new MessageEmbed()
            .setTitle('NSFW Time')
            .setFooter('Thank you nekobot.xyz!', 'https://nekobot.xyz/apple-touch-icon.png');

        let searchFor = 'hentai';
        if (args[0])
            searchFor = args[0].toLowerCase();

        try {
            const response = await axios.get(`${apiUrl}${searchFor}`, {
                headers: {
                    'user-agent': 'RadianceBot',
                    'content-type': 'application/json'
                }
            });
    
            const data = response.data;
            embed.setColor(data['color'])
                .setImage(data['message']);

            return channel.send(embed);
        } catch (error) {
            return channel.send('Failed to fetch image!');
        }
    }
}