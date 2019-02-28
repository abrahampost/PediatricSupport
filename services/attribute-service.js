const   Attribute = require("../db/sequelize").attribute,
        Sequelize = require("sequelize"),
        BadRequestException = require("../exceptions/bad-request-exception");

exports.createAttribute = async function (name, type) {
    try {
        let attribute = await Attribute.build({
            name,
            type
        });
        await attribute.save();
    } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        }
        console.error(`A problem occurred when saving an attribute: ${e.stack}`);
        throw new InternalErrorException("A problem occurred when saving the attribute");
    }
}