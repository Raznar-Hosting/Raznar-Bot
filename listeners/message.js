const { MessageEmbed, Client, Message } = require('discord.js');

// The blacklisted words in regex forms
// 
// NOTE: To test the regex please use https://regex101.com/
//       I've used this website to test my regex if it works or not
//       It also has cheat sheets for it.
const blacklistedWords = [
    // anjing // bajing
    /(ba)?(a|4)*nj(e|3|i|1)+n?g(an)?/gi,
    // monyet
    /m(o|0)*ny(e|3)*t/gi,
    // bangsat
    /b(a|4)*n?gs(a|4)*(t|d)/gi,
    // tolol
    /t(o|0)+l(o|0)+l?/gi,
    // pantek
    /p(a|4)*nt(e|3)*k/gi,
    // goblok
    /g(o|0)*bl(o|0)*(k|g)/gi,
    // kontol
    /k(o|0)*nt(o|0)*l/gi,
    // memek
    /m(e|3)*m(e|3)*k/gi,
    // tetek
    /t(e|3)+t(e|3)+k?/gi,
    // kimak
    /k(i|1)+m(a|4)+k/gi,
    // pussy
    /pu*ss+y/gi,
    // dick
    /d(i|1)+ck/gi,
    // babi
    /b(a|4)+b(i|1)+/gi,
    // nigga
    /\bn(i|1)*gg(a|e|3|4)*r?/gi,
    // fucking
    /fu*cki*(ng)?/gi,
    // faggot
    /f(a|4)*gg(o|0)*t/gi,
    // ngentot
    /ng(e|3)*nt(o|0|u)*(t|d)/gi,
    // coli
    /c(o|0)+l(i|1)+/gi,
    // kampret
    /k(a|4)*mpr(e|3)*t/gi,
    // asu
    /_?-?\ba+su+\b-?_?/gi,
    //boobs
    /b(0|o)(o|0)+bs?/gi,
    //bitches
    /b(i|1)+tch/gi,
    // autis
    /aut(i|1)*s/gi,
    // hentai
    /h(e|3)+nt(a|4)+i+/gi,
    // porn
    /p(o|0)+rn/gi,
    // bokep
    /b(o|0)+k(e|3)+p/gi
];

module.exports = {
    name: 'message',
    /**
     * @param {Client} client
     * @param {Message} msg
     */
    call: async (client, msg) => {
        const channel = msg.channel;
        const content = msg.content;

        // don't allow bot to mention the bot
        if (msg.author.bot)
            return;
        // don't allow dm
        if (channel.type === 'dm')
            return channel.send("The bot doesn't support DMs!");

        // broken
        //
        // if (msg.channel.name != "advertise" && msg.content.includes != "discord.gg" || msg.content.includes != "discord.io") {
        //     await msg.delete();

        //     const embed = new MessageEmbed()
        //         .setDescription("Dont be blind mang, go advertise in <#747304614898171905>")
        //         .setColor('RED')
        //         .setFooter(config['footer']);

        //     return channel.send(embed).then(m => m.delete({ timeout: 3_000 }));
        // }

        // in this one line of code
        // it uses the badwords regex list to find a bad word within the message
        const foundUsingWords = blacklistedWords.find(regex => content.match(regex));

        // once it's found it'll stop after deleting the message 
        // and sending a warning message
        if (msg.content.includes("color code"))
            return channel.send("Aye aye sir!, `§`");

        if (foundUsingWords) {
            msg.delete();

            const embed = new MessageEmbed()
                .setDescription('Please, watch your language!')
                .setColor('RED');

            return channel.send(embed).then(m => m.delete({ timeout: 5_000 }));
        }

        const mentionRegex = /^<@!?([0-9]{18})>$/g;
        const foundMention = mentionRegex.exec(content);

        // if the user mentions the bot, it'll send the command prefix to use the bot
        if (foundMention) {
            const userId = foundMention[1]
            // another check to determine if the mentioned user is the bot
            if (client.user.id !== userId)
                return;

            const prefix = require('../config.json')['prefix'];
            return channel.send('Hi there ' + msg.author.toString() + '! My command prefix is `' + prefix + '`!');
        }
    }
}