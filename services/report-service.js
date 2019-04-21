const sequelize = require("../db/sequelize"),
    UserReport = sequelize.user_report,
    Sequelize = require("sequelize"),
    BadRequestException = require("../exceptions/bad-request-exception"),
    InternalErrorException = require("../exceptions/internal-error-exception");

exports.createUserReport = async function (reporterId, reportedId, description) {
    try {
        let userReport = await UserReport.build({
            reporter_id: reporterId,
            reported_id: reportedId,
            status: "pending",
            description: description
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
        throw new InternalErrorException("A problem occurred when saving the user report", e);
    }
}

exports.getUserReports = async function (status) {
    try {
        let whereStatement = `where ur.reporter_id = u1.id and
        ur.reported_id = u2.id`;
        if (status) {
            whereStatement.status += `and ur.status = :status`;
        }

        let userReports = await sequelize.query(`select u1.username as reporter_username, u2.username as reported_username, u1.id as reporter_id, u2.id as reported_id, ur.status, ur.description, ur.id from
        user_reports as ur, users as u1, users as u2 ` + whereStatement,
        {replacements: { status: status }, type: sequelize.QueryTypes.SELECT});

        return userReports;
    } catch (e) {
        throw new InternalErrorException("A problem occurred when retrieving user reports", e);
    }
}