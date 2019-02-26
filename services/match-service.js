const   Sequelize = require("sequelize"),
        sequelize = require("../db/sequelize"),
        User = require("../db/sequelize").user,
        Match = require("../db/sequelize").user_match,
        Attribute = require("../db/sequelize").attribute,
        PatientAttribute = require("../db/sequelize").patient_x_attribute,
        PatientInfo = require("../db/sequelize").patient_info,
        Op = Sequelize.Op,
        BadRequestException = require("../exceptions/bad-request-exception");

/**
 * Takes in two userIds. First one is person making the request, second is person receiving the request.
 * Creates a match which it sets to pending. Sends back a status code on whether the request succeeded.
 */
exports.createMatch = async function (userOneId, userTwoId) {
    try {
        const newMatch = {
            user_one_id: userOneId,
            user_two_id: userTwoId,
            type: 'pending'
        };
        let match = await Match.build(newMatch);
        await match.save();
        return 201;
    } catch (e) {
        // TODO: Turn this into a utility function in a utility class
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        } else if (e instanceof BadRequestException) {
            throw e;
        }
        throw new BadRequestException("A problem occured when saving the match.");
    }
}

exports.getMatches = async function (userId) {
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
                    attributes: ['type'],
                },
                order: [['createdAt', 'ASC']],
            }],
        });
        let filteredResults = results.UserMatch.map((result) => {
            return {
                id: result.id,
                user: result.username,
                type: result.user_match.type
            }
        });
        return filteredResults;

    } catch (e) {
        console.error(e);
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        } else if (e instanceof BadRequestException) {
            throw e;
        }
        throw new BadRequestException("Unable to retrieve user matches.");
    }
}

/**
 * Accepts a userId
 * Will use the matching engine to return all potential matches for a user
 */
exports.getPotentialMatches = async function (userId) {
    try {
        let userInterestsId = await PatientAttribute.findAll({
            attributes: ['attribute_id'],
            where: {
                patient_id: userId,
            },
        });

        userInterestsId = userInterestsId.map(interest => {
            return interest.attribute_id;
        });

        // find all matches with the passed user
        let matchedIds = await Match.findAll({
            attributes: [['user_one_id', 'userOneId'], ['user_two_id', 'userTwoId']],
            where: {
                [Op.or]: [
                    {
                        user_one_id: userId,
                    },
                    {
                        user_two_id: userId,
                    }
                ],
            }
        });

        // filter the results into a list of just the other user's id
        let normalizedMatchedIds = matchedIds.map((match) => {
            if (userId === match.userOneId) {
                return match.userTwoId;
            }
            return match.userOneId;
        });

        let similarIds = await PatientAttribute.findAll({
            attributes: ['patient_id', [sequelize.fn('COUNT', sequelize.col('attribute_id')), 'similarity']],
            where: {
                patient_id: {
                    [Op.not]: userId,
                    [Op.notIn]: normalizedMatchedIds,
                }
            },
            group: ['patient_id'],
            order: [sequelize.fn('COUNT', sequelize.col('attribute_id'))]
        });

        similarIds = similarIds.map((sim) => {
            return sim.dataValues.patient_id;
        });

        let results = await User.findAll({
            attributes: ['id', 'username'],
            where: {
                id: {
                    [Op.in]: similarIds
                },
                type: 'patient',
            },
            include: [{
                model: Attribute,
                attributes: ['name'],
                where: {
                    type: 'interest',
                },
            }]
        });

        results.sort(function(a, b) {
            return similarIds.indexOf(b.dataValues.id) - similarIds.indexOf(a.dataValues.id);
        })

        results = results.map(res => {
            return res.dataValues;
        });
        return results;
        // https://github.com/sequelize/sequelize/issues/222
    } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        } else if (e instanceof BadRequestException) {
            throw e;
        }
        console.error(e);
        throw new BadRequestException("Unable to retrieve user matches.");
    }
}

/**
 * Takes in matchId and updatedType. Returns 200 if success, 400 if fails.
 */
exports.updateMatchType = async function(matchId, updatedType) {
    try {
        let updates = {
            id: matchId,
            type: updatedType,
        };
        let response = await Match.update(updates, {
            where: {
                id: matchId,
            },
        });
        if (response[0] == 0) {
            // checks if no rows were affected by the update
            throw new BadRequestException("Match does not exist.");
        };
        return 200;
    } catch(e) {
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        } else if (e instanceof BadRequestException) {
            throw e;
        }
        throw new BadRequestException("Unable to update match status.");
    }
}

/**
 * Takes in matchId, returns 200 if success, 400 if not.
 */
exports.deleteMatch = async function(matchId) {
    try {
        let numRows = await Match.destroy({
            where: {
                id: matchId
            }
        });
        if (numRows == 0) {
            throw new BadRequestException("Match does not exist.");
        }
        return 200;
    } catch(e) {
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        } else if (e instanceof BadRequestException) {
            throw e;
        }
        throw new BadRequestException("Unable to update match status.");
    }
}