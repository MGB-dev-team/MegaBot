const Command = require('../../Structures/Command');
const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');

module.exports = class devJoke extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Sends a random dev joke.',
			category: 'Fun'
        });
    }

    async run(message) {
        axios
            .get("https://v2.jokeapi.dev/joke/Programming")
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