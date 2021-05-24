const Event = require('../Structures/Event');
require("../Database/mongo");
const { Manager } = require("erela.js");

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	run() {
		console.log([
			`Logged in as ${this.client.user.tag}`,
			`Loaded ${this.client.commands.size} commands!`,
			`Loaded ${this.client.events.size} events!`
		].join('\n'));

		const activities = [
			`${this.client.guilds.cache.size} servers!`,
			`${this.client.channels.cache.size} channels!`,
			`${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users!`
		];

		let i = 0;
		setInterval(() => this.client.user.setActivity(`${this.client.prefix}help | ${activities[i++ % activities.length]}`, {
			type: 'WATCHING'
		}), 15000);



		const nodes = [{
			"host": "144.91.112.9",
			"port": 25515,
			"password": "youshallnotpass"
		}]

		this.client.manager = new Manager({
			nodes,
			send: (id, payload) => {
				const guild = this.client.guilds.cache.get(id);
				// NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
				if (guild) guild.shard.send(payload);
			}
		});

		this.client.manager.on('nodeConnect', node => {
			console.log(`Node connected to ${node.options.identifier}`)
		});

		this.client.manager.on("nodeError", (node, error) => {
			console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
		})

		this.client.manager.on("trackStart", (player, track) => {
			const channel = this.client.channels.cache.get(player.textChannel);
			channel.send(`Now playing: \`${track.title}\`, requested by \`${track.requester.tag}\`.`);
		});

		this.client.manager.on("queueEnd", player => {
			const channel = this.client.channels.cache.get(player.textChannel);
			player.destroy();
		});


		this.client.manager.init(this.client.user.id)
	}

};