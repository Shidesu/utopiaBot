module.exports = function (config, database, lang, userValidation) {

    return {
        name: 'token',
        description: 'Permet de vérifier le token et de devenir un membre validé.',
        execute(message, args) {
            if (args.length > 1) {
                message.reply(message.content);
                userValidation.checkAndValidateUser(message, args);
            }
            else {
                message.reply(lang.tokenNeeded);
            }
        },
    }
};