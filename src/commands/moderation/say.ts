/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Guild, Message, MessageEmbed } from 'discord.js';
import { Command } from '../../managers/commands';

class SayCommand extends Command {

    public name = 'say';
    public aliases: string[] = [];
    public desc = 'The command to be able to say something as the bot!';

    public async execute(prefix: string, args: string[], msg: Message) {
        const { channel, member, guild } = msg;

        if (!member?.hasPermission('ADMINISTRATOR'))
            return channel.send('No permission!').then(m => m.delete({ timeout: 3_000 }));
        if (!args[0])
            return channel.send(`Usage: ${prefix}say <message>`);

        let content = args.join(' ');
        content = this.filterEmoji(content, guild!);

        /**
         * Handles filtering a single parameter
         * this'll try to find the parameter and then removes it from the message content
         * 
         * @param param the parameter value
         * @returns `true` if the parameter is found, otherwise `false`
         */
        function filterSingleParam(param: string): boolean {
            const list = content.split(' ');
            const result = list.filter(str => str !== param);

            content = result.join(' ');
            return !!list.find(str => str === param);
        }

        let finalMessage: string | MessageEmbed;
        if (filterSingleParam('-em'))
            finalMessage = new MessageEmbed()
                .setDescription(content);
        else
            finalMessage = content;

        return channel.send(finalMessage);
    }

    /**
     * Filters the newly formatted emojis into a valid emojis readable to Discord
     */
    private filterEmoji(content: string, guild: Guild): string {
        const regex = /{([a-zA-Z0-9_-]+)}/gi;
        let newContent = content;
        let result: RegExpExecArray | null;

        while ((result = regex.exec(content)) !== null) {
            if (result.index === regex.lastIndex)
                regex.lastIndex++;

            const fullEmoji = result[0];
            const emojiName = result[1];

            if (!fullEmoji || !emojiName)
                continue;

            const emoji = guild.emojis.cache.find(e => e.name === emojiName);
            if (!emoji)
                continue;

            newContent = newContent.replace(fullEmoji, emoji.toString());
        }

        return newContent;
    }

}

export const command = new SayCommand();