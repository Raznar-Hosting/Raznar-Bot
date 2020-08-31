/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Message, MessageEmbed, OverwriteResolvable } from 'discord.js';
import { Command } from '../../managers/commands';
import { Config, Package } from '../../objects/types';

/** creates a readable permission object 
                 * to be used in channel creations */
function createReadablePerm(id: OverwriteResolvable['id']): OverwriteResolvable {
    return {
        id: id,
        allow: [
            'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
            'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
        ]
    };
}

class TicketCommand extends Command {

    public name = 'ticket';
    public aliases: string[] = ['tickets', 'support', 'req', 'request', 'order'];
    public desc = 'Managers the tickets';

    public async execute(prefix: string, args: string[], msg: Message): Promise<any> {
        const { member, channel, guild } = msg;

        if (!args[0])
            return await this.execute(prefix, ['help'], msg);

        const config: Config = require('../../../resources/config.json');
        const packaging: Package = require('../../index').objects;

        const ticketdb = packaging.ticketdb;
        const category = guild?.channels.cache.get(config.channels['ticket-category']);

        const everyoneRole = guild?.roles.cache.get(config.roles.everyone);
        const supportRole = guild?.roles.cache.get(config.roles.support);
        const adminRole = guild?.roles.cache.get(config.roles.admin);

        const ticketTypes = ['SUPPORT', 'SERVICE', 'ADDON', 'SERVERS'];

        try {
            if (!category)
                throw Error('Cannot find the category to hold the tickets!');
            if (!everyoneRole || !supportRole || !adminRole)
                throw Error('Cannot find certain role(s)!');
        } catch (error) {
            console.error(error);
            return channel.send(error.message);
        }

        switch (args[0].toLowerCase()) {
            case 'create': {
                if (!args[1])
                    return await this.execute(prefix, ['help'], msg);

                const type = args[1].toUpperCase();
                if (!ticketTypes.includes(type))
                    return await this.execute(prefix, ['help'], msg);

                const data = ticketdb.prepare('SELECT * FROM tickets WHERE user_id = ?;').get(member?.id);
                // if the user already has a ticket
                // confirms the channel existence to prevent duplication
                if (data) {
                    const ticketChannel = guild?.channels.cache.get(data['channel_id']);
                    // prevents user to have more than 1 ticket channel
                    if (ticketChannel)
                        return channel.send(`You already have a ticket! Please open ${ticketChannel.toString()} to view your ticket!`)

                    // if the ticket channel cannot be found
                    // deletes the data
                    ticketdb.prepare('DELETE FROM tickets WHERE user_id = ?;')
                        .run(member?.id);
                }

                // generates an id for the channel name
                const randomId = Math.floor(Math.random() * 10_000);

                // creates the channel
                const ticketChannel = await guild?.channels.create(`${type.toLowerCase()}-${randomId}`, {
                    parent: category,
                    topic: `${member?.user.tag}'s ticket channel`,
                    type: 'text',
                    permissionOverwrites: [
                        {
                            id: everyoneRole,
                            deny: ['VIEW_CHANNEL']
                        },
                        createReadablePerm(member!),
                        createReadablePerm(supportRole),
                        createReadablePerm(adminRole)
                    ]
                });

                // inserts the new data
                ticketdb.prepare('INSERT INTO tickets (user_id, channel_id) VALUES (?, ?);')
                    .run(member?.id, ticketChannel?.id);

                // tells the user that their ticket channel is creat
                await ticketChannel?.send(
                    `${member?.toString()} your ticket has been created!`
                    + `\n\n`
                    + `Summon ${supportRole.toString()}`
                );
                await channel.send(
                    `${member?.toString()} your ticket has been created!`
                    + `\nYou may go to ${ticketChannel?.toString()}!`
                );

                break;
            }
            case 'delete':
            case 'close': {
                // if another argument exists
                // it's for force deleting a ticket
                if (args.length >= 2) {
                    // only admin can delete other 
                    if (!member?.hasPermission('ADMINISTRATOR'))
                        return channel.send('No permission!').then(m => m.delete({ timeout: 3_000 }));

                    const ticketChannel = Array.from(msg.mentions.channels.values())[0];
                    // checks the mentioned channel
                    if (!ticketChannel)
                        return channel.send('Please mention the correct ticket channel!');

                    const ticketId = ticketChannel.id;
                    const data = ticketdb.prepare('SELECT * FROM tickets WHERE channel_id = ?;')
                        .get(ticketId);

                    // checks if the channel is the same channel as the ticket channel
                    if (!data)
                        return channel.send("This channel isn't a ticket channel!");

                    const userId = data['user_id'];
                    const ticketOwner = guild?.members.cache.get(userId);
                    // notifies the ticket owner
                    if (ticketOwner)
                        ticketOwner.send('Your ticket channel named `' + ticketChannel.name + '` was deleted by ' + member?.user.tag + '!');

                    ticketChannel.delete('Force ticket close');
                    ticketdb.prepare('DELETE FROM tickets WHERE user_id = ?;')
                        .run(userId);
                    return;
                }

                const data = ticketdb.prepare('SELECT * FROM tickets WHERE user_id = ?;').get(member?.id);
                if (!data)
                    return channel.send("You don't have a ticket!");

                const ticketChannel = guild?.channels.cache.get(data['channel_id']);
                // deletes the ticket channel
                if (ticketChannel)
                    ticketChannel.delete();

                // deletes the ticket data
                ticketdb.prepare('DELETE FROM tickets WHERE user_id = ?;')
                    .run(member?.id);

                break;
            }
            default: {
                const embed = new MessageEmbed()
                    .setTitle('Ticket Help')
                    .setColor('RANDOM')
                    .setFooter(config['footer'])
                    .setDescription(
                        '`' + prefix + 'ticket create [SUPPORT/SERVICE/ADDON/SERVERS]` - To create a ticket based on your requests'
                        + '\n`' + prefix + 'ticket close` - To close a ticket'
                    );

                return channel.send(embed);
            }
        }
    }

}

export const command = new TicketCommand();