/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ColorResolvable, Guild, Message, MessageEmbed } from 'discord.js';
import { Command } from '../../managers/commands';
import { Config } from '../../objects/types';

class SayCommand extends Command {

    public name = 'say';
    public aliases: string[] = [];
    public desc = "Use the command and you'll know what it does and what it can do!";

    public async execute(prefix: string, args: string[], msg: Message) {
        const config: Config = require('../../../resources/config.json');
        const { channel, member, guild, client } = msg;

        if (!member?.hasPermission('ADMINISTRATOR'))
            return await channel.send('No permission!').then(m => m.delete({ timeout: 3_000 }));
        if (!args[0]) {
            const info = [
                'This commands allows you to send a message that is sent by the bot!',
                '',
                'There are a bunch of filters/parameters that you can use to make a beautiful message.',
                'And those are:',
                '**●** `-em` - To make the message an embedded message',
                '**●** `-t \\<title>\\` - To set title to the embedded message',
                '**●** `-c \\<color>\\` - To set the embedded message color',
                '**●** `-f \\<footer>\\` - To set the embedded message footer, by default it\'s using the one from config',
                '**●** `-m` - To add the `@here` tag/mention to your message!',
                '',
                `**Command Usage:** ${prefix}say <message> <filters...>`,
                '**Examples:**',
                '',
                `**●** ${prefix}say just some random message -em -c \\RANDOM\\`,
                `**●** ${prefix}say Today, we have a good news and bad news -em -t \\Official Announcement\\ -c \\FF0000\\`,
                `**●** ${prefix}say yes -em -f \\Just a simple footer\\`
            ].join('\n');

            const embed = new MessageEmbed()
                .setDescription(info)
                .setFooter(config.footer)
                .setColor(0x00E6FF)
                .setThumbnail(client.user!.displayAvatarURL())
                .setTitle('`say` Command information');

            return await channel.send(embed);
        }

        let content = args.join(' ');
        content = this.filterEmoji(content, guild!);

        /**
         * Handles cleaning empty spaces
         */
        function cleanEmptySpaces() {
            content = content.split(' ').filter(str => !!str).join(' ');
        }

        /**
         * Handles filtering a single parameter
         * this'll try to find the parameter and then removes it from the message content
         * 
         * @param param the accepted parameter
         * @returns `true` if the parameter is found, otherwise `false`
         */
        function filterSingleParam(param: string): boolean {
            const list = content.split(' ');
            const result = list.filter(str => str !== param);

            content = result.join(' ');
            cleanEmptySpaces();

            return list.length !== result.length;
        }

        /**
         * Handles filtering a key value pair like parameters
         * 
         * The sample is like `-t \hey guys\` where the `-t` is the key
         * and the `\hey guys\` is the value.
         * 
         * The value must starts and ends with '\'
         * 
         * @param param the accepted parameter
         * @returns the key-value pair in object, ex: {key: '-t', value: 'hey guys'}
         */
        function filterParamValue(param: string) {
            const list = content.split(' ');
            // the param index
            const index = list.findIndex(str => str === param);
            // if the index isn't found or there's no value, failed
            if (index < 0 || list.length - 1 <= index)
                return null;

            const regex = /\\(.+)\\/gi;
            let value;

            const keyValueMessage = list.splice(index).join(' ');
            const found = regex.exec(keyValueMessage);

            if (found) {
                value = keyValueMessage.split('\\')[1];

                content = content.replace(param, '')
                    .replace(`\\${value}\\`, '');
            } else {
                return null;
            }

            cleanEmptySpaces();
            return { key: param, value: value };
        }

        let finalMessage: string | MessageEmbed;
        const useMention = filterSingleParam('-m');

        try {
            if (filterSingleParam('-em')) {
                const title = filterParamValue('-t');
                const color = filterParamValue('-c');
                const footer = filterParamValue('-f');

                finalMessage = new MessageEmbed()
                    .setDescription(content)
                    .setFooter(config.footer);

                if (title) finalMessage.setTitle(title.value);
                if (color) finalMessage.setColor(color.value as ColorResolvable);
                if (footer) finalMessage.setFooter(footer.value);
            } else {
                finalMessage = content;
            }

            await channel.send(finalMessage);
            if (useMention)
                await channel.send('@here');
        } catch (error) {
            await channel.send(`An error has occurred! ${error}`)
                .then(m => m.delete({ timeout: 5_000 }));
        }
    }

    /**
     * Filters the newly formatted emojis into a valid emojis readable to Discord
     */
    private filterEmoji(content: string, guild: Guild): string {
        const regex = /{([a-zA-Z0-9_-]+)}/gi;
        let newContent = content;
        let result: RegExpExecArray | null;

        while ((result = regex.exec(content)) !== null) {
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