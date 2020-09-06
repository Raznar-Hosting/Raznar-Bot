/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ColorResolvable, Guild, Message, MessageEmbed } from 'discord.js';
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
         * Handles cleaning empty spaces
         */
        function cleanEmptySpaces() {
            const list = content.split(' ');
            content = list.filter(str => !!str).join(' ');
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
                return {};

            const regex = /\\(.+)\\/gi;
            const joinMessage = list.splice(index).join(' ');

            let value;

            const found = regex.exec(joinMessage);
            if (found) {
                value = joinMessage.split('\\')[1];
                
                content = content.replace(param, '')
                    .replace(`\\${value}\\`, '');
            } else {
                return {};
            }

            cleanEmptySpaces();
            return { key: param, value: value };
        }

        let finalMessage: string | MessageEmbed;

        const title = filterParamValue('-t');
        const color = filterParamValue('-c');

        try {
            if (filterSingleParam('-em')) {
                finalMessage = new MessageEmbed()
                    .setDescription(content);

                if (title)
                    finalMessage.setTitle(title.value);
                if (color)
                    finalMessage.setColor(color.value as ColorResolvable);
            } else {
                finalMessage = content;
            }

            return channel.send(finalMessage);
        } catch (error) {
            return channel.send(`An error has occurred! ${error}`)
                .then(m => m.delete({timeout: 5_000}));
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