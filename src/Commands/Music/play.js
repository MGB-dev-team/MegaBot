const Command = require('../../Structures/Command');

module.exports = class play extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['p'],
            description: "Plays music.",
            category: "Music",
            nsfw: false,
            ownerOnly: false
        })
    }
    async run(message, args) {
        let channel = message.member.voice.channel;
        if (!channel)return message.reply("I'm sorry but you need to be in a voice channel to play music!", message.channel);

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))return message.reply("I cannot connect to your voice channel, make sure I have the proper permissions!", message.channel);
        if (!permissions.has("SPEAK"))return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!", message.channel);

        const player = message.client.manager.create({
            guild: message.guild.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
        });

        if (player.state !== "CONNECTED") player.connect();

        const search = args.join(' ');
        let res;

        try {
            res = await player.search(search, message.author);
            if (res.loadType === 'LOAD_FAILED') {
                if (!player.queue.current) player.destroy();
                throw res.exception;
            }
        } catch (err) {
            return message.reply(`there was an error while searching: ${err.message}`);
        }

        switch (res.loadType) {
            case 'NO_MATCHES':
                if (!player.queue.current) player.destroy();
                return message.reply('there were no results found.');
            case 'TRACK_LOADED':
                player.queue.add(res.tracks[0]);

                if (!player.playing && !player.paused && !player.queue.size) await player.play();
                return message.reply(`enqueuing \`${res.tracks[0].title}\`.`);
            case 'PLAYLIST_LOADED':
                player.queue.add(res.tracks);

                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) await player.play();
                return message.reply(`enqueuing playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks.`);
            case 'SEARCH_RESULT':
                let max = 5, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
                if (res.tracks.length < max) max = res.tracks.length;

                const results = res.tracks
                    .slice(0, max)
                    .map((track, index) => `${++index} - \`${track.title}\``)
                    .join('\n');

                message.channel.send(results);

                try {
                    collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
                } catch (e) {
                    if (!player.queue.current) player.destroy();
                    return message.reply("you didn't provide a selection.");
                }

                const first = collected.first().content;

                if (first.toLowerCase() === 'end') {
                    if (!player.queue.current) player.destroy();
                    return message.channel.send('Cancelled selection.');
                }

                const index = Number(first) - 1;
                if (index < 0 || index > max - 1) return message.reply(`the number you provided too small or too big (1-${max}).`);

                const track = res.tracks[index];
                player.queue.add(track);

                if (!player.playing && !player.paused && !player.queue.size) await player.play();
                return message.reply(`enqueuing \`${track.title}\`.`);
        }
    }
};