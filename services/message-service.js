const Sequelize = require("sequelize"),
  sequelize = require("../db/sequelize"),
  Op = Sequelize.Op,
  User = sequelize.user,
  Message = sequelize.message,
  InternalErrorException = require("../exceptions/internal-error-exception");

exports.getAllMessages = async function (userId) {
  try {
    let results = await User.findOne({
      attributes: ['id', 'createdAt'],
      where: {
        id: userId
      },
      include: [{
        model: User,
        as: 'UserMatch',
        attributes: ['id', 'username'],
        where: {
          type: {
            [Op.not]: 'blocked',
          },
        },
        through: {
          attributes: ['id', 'type'],
          include: [{
            model: Message,
            attributes: ['content', 'sender', 'createdAt'],
            order: [
              ['createdAt', 'DESC']
            ],
            require: false,
          }]
        },
      }]
    });
    return results;
  } catch (e) {
    console.error(e);
    if (e instanceof Sequelize.ValidationError) {
      let errorMessage = "The following values are invalid:";
      e.errors.forEach((error) => {
        errorMessage += `\n${error.path}: ${error.message}`;
      });
      throw new BadRequestException(errorMessage);
    }

    throw new InternalErrorException("Unable to retrieve user matches.");
  }
}