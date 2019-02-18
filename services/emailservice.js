
/* 
Rudimentary email service
Currently creates emails for account creation, password changes, and error message if something else is attempted.

TODO:
- replace gmail with SMTP server
- incorporate userID, so a client's username/password/email can be fetched with a GET request
------ or will this already be done in some other piece of code?
- make transporter password a function parameter, instead of just having the email password sit there in plain sight
------ transporter's fields would have to be created in an outside function
------ then, just do:
------ let transporter = nodemailer.createTransport(setTransporterFields(password))

NOTES:
- got rid of "await" that was in front of transporter.sendMail(mail);
------ while the code successfully sends emails now, info.messageId now becomes undefined. 
------ does this matter? is there some other reason why it's better to have await?
*/

const nodemailer = require("nodemailer");

async function main(){
  // sets up info for email medium being used
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '523pediatrics@gmail.com',
      pass: 'monday1235'
    }
  });

  // helper function: actually sends the email
  function deliver(mail) {
    // previously:
    // let info = await transporter.sendMail(mail)
    let info = transporter.sendMail(mail)
    console.log("Message sent: %s", info.messageId);
  }

  // generate and send emails
  // user, email, pass - information specific to the recipient of the email
  // messageType       - specify what kind of message is being sent
  // --- in the event messageType is invalid, admin account sends email to itself with inputted params
  function sendNewEmail(messageType, user, email, pass) {
    if (messageType == "signup") {
      let mail = {
        from: '"UNC Hospitals" <523pediatrics@gmail.com>',
        to: email,
        subject: "UNC Pediatrics - Account Created",
        text: "Hello; you have successfully registered with UNC Pediatrics! Your account username is " 
              + user + ", and your password is " + pass + ".",
        html: "<p>Hello; you have successfully registered with UNC Pediatrics!</p><p>Your account username is " 
              + user + ", and your password is " + pass + ".</p>"
      };
      deliver(mail)
    }
    else if (messageType == "changepassword") {
      let mail = {
        from: '"UNC Hospitals" <523pediatrics@gmail.com>',
        to: email,
        subject: "UNC Pediatrics - Password Changed",
        text: "Hello; you have successfully changed the password of your UNC Pediatrics account, " 
              + user + ". Your new password is " + pass + ".",
        html: "<p>Hello; you have successfully changed the password of your UNC Pediatrics account, " 
        + user + ".</p><p>Your new password is " + pass + ".</p>"
      };
      deliver(mail)
    }
    else {
      let mail = {
        from: '"UNC Hospitals" <523pediatrics@gmail.com>',
        to: "523pediatrics@gmail.com",
        subject: "Bad email",
        text: "messageType = " + messageType + ", user = " + user + ", email = " + email + ", pass = " + pass,
        html: "<p>messageType = " + messageType + ", user = " + user + ", email = " + email + ", pass = " + pass + "</p>"
      };
      deliver(mail)
    }
  }

  // used this for testing
  // sendNewEmail("signup", "alex", "david.alex.aguero@gmail.com", "123456")

}

main().catch(console.error);