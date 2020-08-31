import { Message, TextChannel } from 'discord.js';
import { Command } from '../../managers/commands';

class PurgeCommand extends Command {

    public name = 'purge';
    public aliases: string[] = ['clear', 'clean'];
    public desc = 'Clears a channel with a certain amount of messages';

    public async execute(prefix: string, args: string[], msg: Message) {
        const { channel, member } = msg;
        if (!(channel instanceof TextChannel))
            return;


        if (!member?.hasPermission('MANAGE_MESSAGES'))
            return channel.send('No permission!').then(m => m.delete({ timeout: 3_000 }));

        if (isNaN(+args[0]))
            return msg.channel.send('Please provide a valid amount to purge!');

        const amount = +args[0];
        if (amount > 100)
            return msg.channel.send('Please give an amount less than 100!');

        channel.bulkDelete(amount)
            .then(messages =>
                msg.channel.send(`Successfully deleted ${messages.size}/${args[0]} messages!`)
                    .then(m => m.delete({ timeout: 10_000 }))
            );
    }

}

export const command = new PurgeCommand();