/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../../managers/commands';
import { Config, Package } from '../../objects/types';


class OrderCommand extends Command {

    public name = 'order';
    public aliases: string[] = ['orders', 'support', 'req', 'request'];
    public desc = 'Managers the orders';

    public async execute(prefix: string, args: string[], msg: Message): Promise<any> {
        const { member, channel, guild } = msg;

        if (!args[0])
            return await this.execute(prefix, ['help'], msg);

        const config: Config = require('../../../resources/config.json');
        const packaging: Package = require('../../index').objects;

        const orderdb = packaging.ticketdb;
        const category = guild?.channels.cache.get(config['channels']['ticket-category']);

        const everyoneRole = guild?.roles.cache.get(config['roles']['everyone'])
        const supportRole = guild?.roles.cache.get(config['roles']['support']);
        const adminRole = guild?.roles.cache.get(config['roles']['admin']);

        try {
            if (!category)
                throw Error('Cannot find the category to hold the orders!');
            if (!everyoneRole || !supportRole)
                throw Error('Cannot find certain role(s)!');
        } catch (error) {
            console.error(error);
            return channel.send(error.message);
        }

        switch (args[0].toLowerCase()) {
            case 'servers':
            case 'server': {
                const data = orderdb.prepare('SELECT * FROM orders WHERE user_id = ?;').get(member?.id);
                // if the user already has a ticket
                // confirms the channel existence to prevent duplication
                if (data) {
                    const orderChannel = guild?.channels.cache.get(data['channel_id']);
                    // prevents user to have more than 1 ticket channel
                    if (orderChannel)
                        return channel.send(`You already ordered the server! Please open ${orderChannel.toString()} to view your ticket!`)

                    // if the ticket channel cannot be found
                    // deletes the data
                    orderdb.prepare('DELETE FROM orders WHERE user_id = ?;')
                        .run(member?.id);
                }

                // generates an id for the channel name
                const randomId = Math.floor(Math.random() * 10_000);
                // creates the channel
                const orderChannel = await guild?.channels.create(`order#server-${randomId}`, {
                    parent: category,
                    topic: `${member?.user.tag}'s order channel`,
                    type: 'text',
                    permissionOverwrites: [
                        {
                            id: everyoneRole,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: member!,
                            allow: [
                                'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
                                'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
                            ]
                        },
                        {
                            id: adminRole,
                            allow: [
                                'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
                                'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
                            ]
                        },
                        {
                            id: supportRole,
                            allow: [
                                'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
                                'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
                            ]
                        }
                    ]
                });

                // inserts the new data
                orderdb.prepare('INSERT INTO orders (user_id, channel_id) VALUES (?, ?);')
                    .run(member?.id, orderChannel?.id);

                // tells the user that their ticket channel is creat
                await orderChannel?.send(
                    `${member?.toString()} your order has been created!`
                    + `\n\n`
                    + `Summon ${supportRole.toString()}`
                );
                await channel.send(
                    `${member?.toString()} your order has been created!`
                    + `\nYou may go to ${orderChannel?.toString()}!`
                );

                break;
            }
            case 'services':
            case 'service': {
                const data = orderdb.prepare('SELECT * FROM orders WHERE user_id = ?;').get(member?.id);
                // if the user already has a ticket
                // confirms the channel existence to prevent duplication
                if (data) {
                    const orderChannel = guild?.channels.cache.get(data['channel_id']);
                    // prevents user to have more than 1 ticket channel
                    if (orderChannel)
                        return channel.send(`You already ordered the services! Please open ${orderChannel.toString()} to view your ticket!`)

                    // if the ticket channel cannot be found
                    // deletes the data
                    orderdb.prepare('DELETE FROM orders WHERE user_id = ?;')
                        .run(member?.id);
                }

                // generates an id for the channel name
                const randomId = Math.floor(Math.random() * 10_000);
                // creates the channel
                const orderChannel = await guild?.channels.create(`order#service-${randomId}`, {
                    parent: category,
                    topic: `${member?.user.tag}'s order channel`,
                    type: 'text',
                    permissionOverwrites: [
                        {
                            id: everyoneRole,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: member!,
                            allow: [
                                'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
                                'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
                            ]
                        },
                        {
                            id: adminRole,
                            allow: [
                                'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
                                'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
                            ]
                        },
                        {
                            id: supportRole,
                            allow: [
                                'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
                                'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
                            ]
                        }
                    ]
                });

                // inserts the new data
                orderdb.prepare('INSERT INTO orders (user_id, channel_id) VALUES (?, ?);')
                    .run(member?.id, orderChannel?.id);

                // tells the user that their ticket channel is creat
                await orderChannel?.send(
                    `${member?.toString()} your order has been created!`
                    + `\n\n`
                    + `Summon ${supportRole.toString()}`
                );
                await channel.send(
                    `${member?.toString()} your order has been created!`
                    + `\nYou may go to ${orderChannel?.toString()}!`
                );

                break;
            }
            case 'addons':
            case 'addon': {
                const data = orderdb.prepare('SELECT * FROM orders WHERE user_id = ?;').get(member?.id);
                // if the user already has a ticket
                // confirms the channel existence to prevent duplication
                if (data) {
                    const orderChannel = guild?.channels.cache.get(data['channel_id']);
                    // prevents user to have more than 1 ticket channel
                    if (orderChannel)
                        return channel.send(`You already ordered the addons! Please open ${orderChannel.toString()} to view your ticket!`)

                    // if the ticket channel cannot be found
                    // deletes the data
                    orderdb.prepare('DELETE FROM orders WHERE user_id = ?;')
                        .run(member?.id);
                }

                // generates an id for the channel name
                const randomId = Math.floor(Math.random() * 10_000);
                // creates the channel
                const orderChannel = await guild?.channels.create(`order#addons-${randomId}`, {
                    parent: category,
                    topic: `${member?.user.tag}'s order channel`,
                    type: 'text',
                    permissionOverwrites: [
                        {
                            id: everyoneRole,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: member!,
                            allow: [
                                'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
                                'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
                            ]
                        },
                        {
                            id: adminRole,
                            allow: [
                                'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
                                'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
                            ]
                        },
                        {
                            id: supportRole,
                            allow: [
                                'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
                                'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
                            ]
                        }
                    ]
                });

                // inserts the new data
                orderdb.prepare('INSERT INTO orders (user_id, channel_id) VALUES (?, ?);')
                    .run(member?.id, orderChannel?.id);

                // tells the user that their ticket channel is creat
                await orderChannel?.send(
                    `${member?.toString()} your order has been created!`
                    + `\n\n`
                    + `Summon ${supportRole.toString() }`
                );
                await channel.send(
                    `${member?.toString()} your order has been created!`
                    + `\nYou may go to ${orderChannel?.toString()}!`
                );

                break;
            }
            case 'delete':
            case 'close': {
                if (args.length >= 2) {
                    // only admin can delete other 
                    if (!member?.hasPermission('ADMINISTRATOR'))
                        return channel.send('No permission!').then(m => m.delete({ timeout: 3_000 }));

                    const orderChannel = Array.from(msg.mentions.channels.values())[0];
                    // checks the mentioned channel
                    if (!orderChannel)
                        return channel.send('Please mention the correct order channel!');

                    const orderId = orderChannel.id;
                    const data = orderdb.prepare('SELECT * FROM tickets WHERE channel_id = ?;')
                        .get(orderId);

                    // checks if the channel is the same channel as the ticket channel
                    if (!data)
                        return channel.send("This channel isn't a order channel!");

                    const userId = data['user_id'];
                    const orderOwner = guild?.members.cache.get(userId);
                    // notifies the ticket owner
                    if (orderOwner)
                        orderOwner.send('Your ticket channel named `' + orderChannel.name + '` was deleted by ' + member?.user.tag + '!');

                    orderChannel.delete('Force ticket close');
                    orderdb.prepare('DELETE FROM tickets WHERE user_id = ?;')
                        .run(userId);
                    return;
                }

                const data = orderdb.prepare('SELECT * FROM tickets WHERE user_id = ?;').get(member?.id);
                if (!data)
                    return channel.send("You didn't order yet");

                const orderChannel = guild?.channels.cache.get(data['channel_id']);
                // deletes the ticket channel
                if (orderChannel)
                orderChannel.delete();

                // deletes the ticket data
                orderdb.prepare('DELETE FROM orders WHERE user_id = ?;')
                    .run(member?.id);

                break;
            }
            default: {
                const embed = new MessageEmbed()
                    .setTitle('Order Help')
                    .setColor('RANDOM')
                    .setFooter(config['footer'])
                    .setDescription(
                        '`' + prefix + 'order server` - To order products that in server category'
                        + '\n`' + prefix + 'order service` - To order services'
                        + '\n`' + prefix + 'order addons` - To order game addons'
                        + '\n`' + prefix + 'order close` - To close an order ticket'
                    );

                return channel.send(embed);
            }
        }
    }

}

export const command = new OrderCommand();
