const MeglanClient = require('./Structures/MeglanClient');
const config = require('../config.json');

const client = new MeglanClient(config);
client.start();
