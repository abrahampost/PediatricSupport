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
        let sentResults = await User.findOne({
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
                },
                order: [['createdAt', 'ASC']],
                include: [{
                    model: Attribute,
                    attributes: ['name'],
                    where: {
                        type: 'interest',
                    },
                    required: false,
                }]
            }],
        });

        if (sentResults) {
            sentResults = sentResults.UserMatch.map((result) => {
                let type = result.user_match.type;
                if (type === 'pending') {
                    type = 'sent';
                }
                let normalizedResult = {
                    id: result.user_match.id,
                    username: result.username,
                    type: type,
                }
                if(result.dataValues.attributes) {
                    normalizedResult['attributes'] = result.dataValues.attributes.map(attribute => attribute.name);
                }
                return normalizedResult;
            });
        } else {
            sentResults = [];
        }

        let receivedResults = await User.findAll({
            attributes: ['id', 'username', 'createdAt'],
            include: [{
                model: User,
                as: 'UserMatch',
                where: {
                    id: userId
                },
                through: {
                    attributes: ['id', 'type'],
                    order: [['createdAt', 'ASC']],
                },
            },{
                model: Attribute,
                attributes: ['name'],
                where: {
                    type: 'interest',
                },
                required: false,
            }],
        });

        if (receivedResults.length != 0) {
            receivedResults = receivedResults.map((res) => {
                return  {
                    id: res.UserMatch[0].user_match.id,
                    username: res.username,
                    type: res.UserMatch[0].user_match.type,
                    attributes: res.dataValues.attributes.map(attribute => attribute.name),
                }
            });
        } else {
            receivedResults = [];
        }

        let results = sentResults.concat(receivedResults);

        return results;
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
        let results = await sequelize.query(`
        SELECT
            u.id,
            u.username,
            array_agg ( a.NAME ) AS attributes,
            COUNT( p_a.patient_id ) * 1.0 / (SELECT COUNT(id) from patient_x_attributes where patient_id = :user_id group by patient_id) AS similarity 
        FROM
            users AS u,
            patient_x_attributes AS p_a,
            attributes AS a 
        WHERE
            u.id not in 
                (SELECT user_one_id as id from user_matches where user_two_id = :user_id
                    UNION
                 SELECT user_two_id as id from user_matches where user_one_id = :user_id)
            AND u.id = p_a.patient_id
            AND p_a.attribute_id = a.id 
            AND p_a.patient_id != :user_id 
            AND p_a.attribute_id IN ( SELECT id FROM patient_x_attributes WHERE patient_id = :user_id ) 
        GROUP BY
            u.id 
        ORDER BY
            similarity DESC;`, 
            { replacements: { user_id: userId }, type: sequelize.QueryTypes.SELECT});
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