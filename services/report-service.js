const sequelize = require("../db/sequelize"),
    UserReport = sequelize.user_report,
    Sequelize = require("sequelize"),
    BadRequestException = require("../exceptions/bad-request-exception"),
    InternalErrorException = require("../exceptions/internal-error-exception"),
    PediatricSupportException = require("../exceptions/pediatric-support-exception");

exports.createUserReport = async function (reporterId, reportedId, description) {
    try {
        let userReport = await UserReport.build({
            reporter_id: reporterId,
            reported_id: reportedId,
            status: "pending",
            description: description
        });
        return await userReport.save();
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

        let userReports = await sequelize.query(`select u1.username as reporter_username, u2.username as reported_username, 
        u1.id as reporter_id, u2.id as reported_id, u1.first_name as reporter_first_name, u2.first_name as reported_first_name,
        u1.last_name as reporter_last_name, u2.last_name as reported_last_name, ur.status, ur.description, ur.id from
        user_reports as ur, users as u1, users as u2 ` + whereStatement,
        {replacements: { status: status }, type: sequelize.QueryTypes.SELECT});

        return userReports;
    } catch (e) {
        throw new InternalErrorException("A problem occurred when retrieving user reports", e);
    }
}

exports.getUserReport = async function(reportId) {
    try {
        let report = await UserReport.findOne({
            where: {
                id: reportId
            }
        });

        if(!report) {
            throw new BadRequestException("The user report could not be found.");
        }

        return report;
    } catch(e) {
        if(e instanceof PediatricSupportException) {
            throw e;
        }
        throw new InternalErrorException("A problem occurred when retrieving user reports", e);
    }
}

exports.updateUserReport = async function (reportId, status) {
    let report = await this.getUserReport(reportId);

    try {
        report.status = status;
        await report.save();
    } catch(e) {
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        }
        throw new InternalErrorException("A problem occurred when updating the user report", e);
    }
}