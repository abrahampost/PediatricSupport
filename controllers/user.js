let express = require("express"),
    router = express.Router(),
    userService = require("../services/user-service"),
    emailService = require("../services/email-service");

router.post('/', async function(req, res, next) {
    try {
        let patientEmail = req.body.patientEmail;
        let patientLastName = req.body.patientLastName;
        let patientFirstName = req.body.patientFirstName;
        let parentEmail = req.body.parentEmail;
        let parentLastName = req.body.parentLastName;
        let parentFirstName = req.body.parentFirstName;

        let patientUsername = userService.generateRandom();
        let patientPassword = userService.generateRandom();
        let parentUsername = userService.generateRandom();
        let parentPassword = userService.generateRandom();

        let patient = await userService.signUp(patientUsername, patientPassword, patientLastName, patientFirstName, patientEmail, "patient");
        let parent = await userService.signUp(parentUsername, parentPassword, parentLastName, parentFirstName, parentEmail, "parent");

        await emailService.sendSignupEmail(patientUsername, patientEmail, patientPassword);
        await emailService.sendSignupEmail(parentUsername, parentEmail, parentPassword);
        await userService.linkPatientParent(patient, parent);

        res.sendStatus(201);
    } catch(e)  {
        next(e);
    }
});

router.put('/passwords/reset', async function(req, res, next) {
    try {
        let username = req.body.username;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        await userService.resetPassword(username, oldPassword, newPassword);

        res.sendStatus(204);
    } catch(e)  {
        next(e);
    }
});

module.exports = router;