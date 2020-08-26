const { Message } = require("discord.js");
const discord = require("discord.js")

module.exports = {
    name: 'help',
    aliases: ['helpme', 'idk'],

    /**
     * executes the help command
     * 
     * @param {string} prefix 
     * @param {Message} msg 
     */
    async execute(prefix, args, msg) {
        const user = msg.author;
        const channel = msg.channel;

        if (msg.content.length == 5) {
            const help = new discord.MessageEmbed()
                .setTitle("~~[----~~ Help Page ~~-----]~~")
                .addField(
                    // Service
                    "*!Service*", "Give you a full service list",
                    "",
                    // Minecraft Commands
                    "*Minecraft*",
                    // MCServer
                    "!MC-Server [Server]: Give you an information about a Minecraft server",
                    "",
                    // Music
                    "*Music*",
                    // Play
                    "!Play [Music name/url]: Play a music",
                    "!Stop: Stop the music",
                    "!Skip: Skip the music",
                    "!repeat: Repeat your music queue",
                    "",
                    "*Fun*",
                    "!Anime [Anime]:", "Give you an information about an anime")

                .setFooter("Copyright (c) 2020 Radiance Development Team")

            message.channel.send(help);
        }
        // todo: do command
    }
}
