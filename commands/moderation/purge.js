modules.exports = {
  name: 'purge',
  aliases: [],
  async execute(prefix, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      return msg.channel.send("You are not allowed or do not have permission to purge");
    }

    if (isNaN(args[0]))
      return msg.channel.send(`Please provide a valid amount to purge`);

    if (args[0] > 1000)
      return msg.channel.send(`Please give an amount less than 1000`);

    msg.channel
      .bulkDelete(args[0])
      .then(messages =>
        msg.channel
          .send(`Successfully deleted ${messages.size}/${args[0]} messages!`)
          .then(m => m.delete({ timeout: 10000 }))
      );
  }
};

