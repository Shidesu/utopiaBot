const UserValidation = require ("../userValidation/userValidation.js")

module.exports = {
    name: 'pseudo',
    description: 'Ping!',
    execute(message, args) {
        if (args.length() > 0){

        }
        else {
            message.reply( message.client.thisBot.lang.pseudoNeeded );
        }
    },
};
