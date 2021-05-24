const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');


module.exports = class kick extends Command {
    constructor(...args) {
        super(...args, {
            category: 'Moderation',
            description: "kicks a member from the guild",
            usage: "<member | member id> <reason>",
            userPerms: ['KICK_MEMBERS', 'ADMINISTRATOR'],
            botPerms: ['KICK_MEMBERS', 'ADMINISTRATOR']
        });
    }

    async run (message, args) {
        const member = message.mentions.members.last() || message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[1]);
        const reason = args.slice(1).join(' ') || args.slice(2).join(' ');

        message.delete({ timeout: 2000 });

        if(!member) 
            return message.reply("you must provide a member to kick").then(m => m.delete({ timeout: 2000 }));

        if(!reason) 
            return message.reply("you must provide a reason to kick").then(m => m.delete({ timeout: 2000 }));

        if(member.roles.highest.position >= message.member.roles.highest.position && message.author.id != message.guild.ownerID && member.hasPermission("ADMINISTRATOR"))
            return message.channel.send(`${message.author.tag}. you're not allowed to kick ${member.user.tag}`);

        
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


        if(member.bot) return message.reply("Failed to dm " + member.user.tag + " (bot)")


        member.send({
            embed: {
                title: `**Hello ${member.user.tag}**`,
                description: `You have been permanently kicked from ${message.guild.name} \nReason: ${reason}\nBy: ${message.author.tag}`,
                Color: 'RANDOM'
            }
        })

        return await member.kick(reason);
   }
}