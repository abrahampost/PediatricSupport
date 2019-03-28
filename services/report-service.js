const   UserReport = require("../db/sequelize").user_report,
        Sequelize = require("sequelize"),
        BadRequestException = require("../exceptions/bad-request-exception"),
        InternalErrorException = require("../exceptions/internal-error-exception");

exports.createUserReport = async function (reporterId, reportedId) {
    try {
        let userReport = await UserReport.build({
            reporter_id: reporterId,
            reported_id: reportedId,
            status: "pending"
        });
        await userReport.save();
    } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        }
        throw new InternalErrorException("A problem occurred when saving the user report",e);
    }
}

exports.getUserReports = async function (status) {
    try {
        let whereStatement = {};
        if(status) {
            whereStatement.status = status;
        }

        let userReports = await UserReport.findAll({
            where: whereStatement
        });
        return userReports;
    } catch (e) {
        throw new InternalErrorException("A problem occurred when retrieving user reports",e);
    }
}