const Command = require('../../Structures/Command');

module.exports = class stop extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['leave'],
            category: "Music",
            nsfw: false,
            ownerOnly: false
        })
    }
    async run(message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("there is no player for this guild.");

        const { channel } = message.member.voice;

        if (!channel) return message.reply("you need to join a voice channel.");
        if (channel.id !== player.voiceChannel) return message.reply("you're not in the same voice channel.");

        player.destroy();
        return message.reply("destroyed the player.");
    }
};