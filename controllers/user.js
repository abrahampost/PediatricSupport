let express = require("express"),
    router = express.Router(),
    userService = require("../services/user-service"),
    emailService = require("../services/email-service"),
    permissions = require("../middleware/permissions"),
    messageService = require("../services/message-service"),
    avatarService = require("../services/avatar-service");

router.post('/', permissions.ADMIN, async function(req, res, next) {
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

        await userService.createPatientInfo(patient);
        await userService.linkPatientParent(patient, parent);

        await emailService.sendSignupEmail(patientUsername, patientEmail, patientPassword);
        await emailService.sendSignupEmail(parentUsername, parentEmail, parentPassword);

        res.sendStatus(201);
    } catch(e)  {
        next(e);
    }
});

router.put('/', permissions.PATIENT, async function(req, res, next) {
    try {
        let userid = req.decoded.id;
        let interests = req.body.interests;
        let biography = req.body.biography;
        let avatar = req.body.avatar;

        await userService.updatePatientInfo(userid, interests, biography, avatar);
        res.sendStatus(200);
    } catch(e) {
        next(e);
    }
});

router.get('/', permissions.PATIENT, async function(req, res, next) {
  try {
    let userId = req.decoded.id;
    let data = await userService.getPatientInfo(userId);
    res.json(data);
  } catch(e) {
    next(e);
  }
});

router.get('/:id', permissions.ADMIN, async function(req, res, next) {
    try {
      let userId = req.params.id;
      let data = await userService.getPatientInfo(userId);
      res.json(data);
    } catch(e) {
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

router.get("/:userOneId/conversations/:userTwoId", permissions.ADMIN, async function(req, res, next) {
    try {
      let userOneId = req.params.userOneId;
      let userTwoId = req.params.userTwoId;

      let messages = await messageService.getConversation(userOneId, userTwoId);
      let userOneAvatar = await avatarService.getAvatar(userOneId);
      let userTwoAvatar = await avatarService.getAvatar(userTwoId);

      res.json({ messages, userOneAvatar, userTwoAvatar });
    } catch (e) {
      next(e);
    }
  });

module.exports = router;