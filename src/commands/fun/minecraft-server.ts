import axios from 'axios';
import { Message, MessageAttachment, MessageEmbed } from 'discord.js';
import { Command } from '../../managers/commands';
import { Config } from '../../objects/types';

class MinecraftServerCommand extends Command {

    public name: string = 'mcserver';
    public aliases: string[] = ['mc', 'minecraft', 'mcstats', 'mcapi'];
    public desc: string = 'Shows a minecraft server status';

    public async execute(prefix: string, args: string[], msg: Message) {
        const channel = msg.channel;

        if (args.length === 0)
            return channel.send(`Usage: ${prefix}mcserver <server api>`);

        const address = args[0];
        const port = args[1] ? args[1] : '25565';

        // number check
        if (isNaN(+port))
            return channel.send("That doesn't look like a port to me!");

        let server;
        try {
            const response = await axios.get(`https://mcapi.us/server/status?ip=${address}&port=${port}`,
                { responseType: 'json' }
            );

            server = new MinecraftServer(response.data);
        } catch (error) {
            return channel.send('Failed to retrieve the minecraft server status!');
        }

        const encodedIcon = Buffer.from(server.iconData, 'base64');
        const attachment = new MessageAttachment(encodedIcon, `${address}.${server.iconType}`);
        const config: Config = require('../../../resources/config.json')

        const embed = new MessageEmbed()
            .attachFiles([attachment])
            .setTitle('Minecraft Server')
            .setColor('RANDOM')
            .addField('IP Address', address + (args[1] ? `:${port}` : ''))
            .addField('Players', `${server.currentPlayers}/${server.maxPlayers}`)
            .addField('Version', server.platform)
            .addField('MOTD', server.motd)
            .setThumbnail('attachment://' + attachment.name)
            .setFooter(config.footer);

        await channel.send(embed);
    }

}

export const command = new MinecraftServerCommand();