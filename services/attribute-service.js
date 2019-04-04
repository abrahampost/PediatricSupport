const   Attribute = require("../db/sequelize").attribute,
        Sequelize = require("sequelize"),
        BadRequestException = require("../exceptions/bad-request-exception"),
        InternalErrorException = require("../exceptions/internal-error-exception");

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
        throw new InternalErrorException("A problem occurred when saving the attribute",e);
    }
}

exports.getAttributes = async function (type) {
    try {
        let whereStatement = {};
        if(type) {
            whereStatement.type = type;
        }

        let attributes = await Attribute.findAll({
            attributes: ['id', 'name'],
            where: whereStatement
        });
        return attributes;
    } catch (e) {
        throw new InternalErrorException("A problem occurred when retrieving attributes",e);
    }
}