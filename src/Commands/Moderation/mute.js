const Command = require('../../Structures/Command');
const { MessageEmbed } = require("discord.js");
const ms = require('ms');

module.exports = class mute extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: "I don't think I need to explain this command",
            usage: "<@member | member id> <reason> [<time>]",
            category: "Moderation",
            userPerms: ["MANAGE_ROLES", "ADMINISTRATOR"],
            botPerms: ["MANAGE_ROLES", "ADMINISTRATOR"]
        });
    }

    async run(message, args) {
        const member = message.mentions.members.last() || message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[1]);
        const reason = args.slice(1).join(" ") || args.slice(2).join(" ");
        const time = args[2] || args[3];
        const role = message.guild.roles.cache.find(r => r.name === 'muted');

        if (!role) {
            message.channel.send("Mute role doesn't exist creating one....");
            try {
                message.guild.roles.create({
                    data: {
                        name: 'muted'
                    }
                })
            } catch (err) {
                message.reply(err.message);
            }
        }

        if (!ms(time)) {
            member.roles.add(role);
            message.channel.send(new MessageEmbed()
                .setAuthor(`${message.author.tag} has kickned | ${member.user.tag}`, member.user.displayAvatarURL())
                .addFields(
                    { name: "Member", value: member.user.tag, inline: true }, 
                    { name: "Moderator", value: message.author.tag, inline: true }, 
                    { name: "Reason", value: reason, inline: true }, 
                    { name: "Date", value: message.createdAt, inline: false }, 
                )
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor('RANDOM')
                .setFooter(`${message.guild.name} moderation system `, message.guild.iconURL({ dynamic: true }))
            );
        } else if (ms(time)) {
            message.channel.send(new MessageEmbed()
                .setAuthor(`${message.author.tag} has kickned | ${member.user.tag}`, member.user.displayAvatarURL())
                .addFields(
                    { name: "Member", value: member.user.tag, inline: true }, 
                    { name: "Moderator", value: message.author.tag, inline: true }, 
                    { name: "Reason", value: reason, inline: true },
                    { name: "Duration", value: time, inline: true }, 
                    { name: "Date", value: message.createdAt, inline: false }, 
                )
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor('RANDOM')
                .setFooter(`${message.guild.name} moderation system `, message.guild.iconURL({ dynamic: true }))
            );
            
            setTimeout(async () => {
                try {
                    await member.roles.remove(role);
                    if(member.bot) return;
                    member.send("You're mute has expired!")
                } catch(err)  {
                    message.reply(err);
                }
            }, ms(time));
        }
    }
}