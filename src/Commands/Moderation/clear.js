const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');


module.exports = class clear extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['purge'],
            category: 'Moderation',
            description: "clears x amount of messages",
            usage: "<number> ",
            userPerms: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
            botPerms: ['MANAGE_MESSAGES', 'ADMINISTRATOR']
        });
    }

    async run(message, args) {
        const args2 = message.content.split(' ').slice(1);
        const amount = args2.join(' ');

        if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!');
        if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!');

        if (amount > 100) return message.reply('You can`t delete more than 100 messages at once!');
        if (amount < 1) return message.reply('You have to delete at least 1 message!');

        await message.channel.messages.fetch({
            limit: amount
        }).then(messages => {
            message.channel.bulkDelete(messages);
            message.channel.send(new MessageEmbed()
                .setDescription("Removed " + messages.size + " messages")
            ).then(msg => {
                msg.delete({ timeout: 2000 });
            })
        });
    }
}