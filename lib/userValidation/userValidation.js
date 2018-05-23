const ChromeCtrl = require("caretaker").ChromeCtrl;
const Utilities = require("../utilities/utilities.js");

class userValidation {

    constructor(bot) {
        this.bot = bot;
        this.tokens = {};
        this.validationMessage = (bot.lang.message || "voici le token pour Discord : \n \n !UB token {token}")
        new ChromeCtrl(bot.config).then(chrome => {
            this.browser = chrome;
            return chrome.login();
        }).then(() => this._register(bot))
    }

    _register(bot) {
        bot.commands["pseudo"] = (message, fragments) => (this._askForValidation(message, fragments, 11));
        bot.commands["identifie-moi-comme"] = (message, fragments) => (this._askForValidation(message, fragments, 24));
        bot.commands["token"] = (message, fragments) => (this._checkAndValidateUser(message, fragments));
    }

    askForValidation(message, fragments, offset) {
        const token = Utilities.generateToken();
        const nick = message.content.substring(offset);
        const content = this.validationMessage.replace("{token}", token);
        this.browser.sendMP(nick, this.bot.lang.mp.title, content).then(() => {
            this.tokens[message.author.username] = {
                key: token,
                nick: nick
            };
            message.reply(this.bot.lang.tokenSend);
        }).catch(err => message.reply(this.bot.lang.mp.sendError));
    }

    checkAndValidateUser(message, fragments) {
        const name = message.author.username;
        if (this.tokens[name] != null && (this.tokens[name].key == fragments[2])) {
            const userGuild = message.guild.member(message.author);
            userGuild.setNickname(this.tokens[name].nick);
            userGuild.addRole(this.bot.config.rolesID.verify) //message.guild.roles.get("name",config.roles.verify).id);
            delete this.tokens[name];
            message.reply(this.bot.lang.validation);
        } else {
            message.reply(this.bot.lang.invalidToken);
        }
    }

}

module.exports = userValidation;