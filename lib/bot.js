const Discord = require('discord.js');
const fs = require('fs');
const UserValidation = require('./userValidation/userValidation.js');



class Bot {
    constructor(config, client) {
        this.config = config;
        this.client = client;
        client.commands = new Discord.Collection();
        client.thisBot = this;
        const commandFiles = fs.readdirSync('./commands');
        this.lang = require("./lang/" + (config.lang || "fr-fr"));
        this._onReady();
        this._onMessage();

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            client.commands.set(command.name, command);
        }
    }

    _onReady() {
        this.client.on('ready', () => {
            console.log('I am ready!');
        });
    }

    _onMessage() {
        this.client.on('message', message => {

            if (!message.content.startsWith(this.config.prefix) || message.author.bot) return;

            const args = message.content.slice(this.config.prefix.length).split( " " );
            const command = args.shift().toLowerCase();

            if (!this.client.commands.has(command)) return;

            try {
                console.log("ok on est donc au moins ici");
                this.client.commands.get(command).execute(message, args);
            }
            catch (error) {
                console.error(error);
                message.reply('there was an error trying to execute that command!');
            }


        });
        console.log("this.client", this.client)
    }

}

module.exports = Bot
