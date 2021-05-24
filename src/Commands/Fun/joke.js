const Command = require('../../Structures/Command');
const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');

module.exports = class joke extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Sends a random joke.',
			category: 'Fun'
        });
    }

    async run(message) {
        axios
            .get("https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky?blacklistFlags=nsfw,religious,political,racist,sexist,explicit")
                .then(res => {
                    if(res.data.setup && res.data.delivery) 
                        return message.channel.send(new MessageEmbed()
                            .setDescription(res.data.setup + "\n" + res.data.delivery)
                            .setColor('RANDOM')
                    )
                    else 
                        return message.channel.send(new MessageEmbed()
                            .setDescription(res.data.joke)
                            .setColor('RANDOM')
                        )
                })
    }
}