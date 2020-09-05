import { Message } from 'discord.js';
import { Command } from '../../managers/commands';

class SayCommand extends Command {

    public name = 'say';
    public aliases: string[] = [];
    public desc = 'The command to be able to say something as the bot!';

    public async execute(prefix: string, args: string[], msg: Message) {
        const { channel, member } = msg;

        if (!member?.hasPermission('ADMINISTRATOR'))
            return channel.send('No permission!').then(m => m.delete({ timeout: 3_000 }));
        if (!args[0])
            return channel.send(`Usage: ${prefix}say <message>`);

        let content = args.join(' ');
        content = this.filterEmoji(content);

        return channel.send(content);
    }

    private filterEmoji(content: string): string {
        const filter = /{[a-zA-Z0-9_-]+}/gi;
        let newContent = content;
        let result: RegExpExecArray | null;

        while ((result = filter.exec(content)) !== null) {
            if (result.index >= filter.lastIndex)
                filter.lastIndex++;

            const fullEmoji = result[0];
            const emoji = result[1];

            if (!fullEmoji || !emoji)
                continue;

            newContent = content.replace(fullEmoji, `:${emoji}:`);
        }

        return newContent;
    }

}

export const command = new SayCommand();